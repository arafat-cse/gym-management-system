"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import type { Branch } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AccountStep =
  | "register"
  | "payment"
  | "awaiting_approval"
  | "active"
  | "expired"
  | "rejected";

type Me = {
  user: { first_name: string; last_name: string; email: string };
  step: AccountStep;
  registration_id: number | null;
  rejection_reason: string | null;
};

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  gender: "male" | "female" | "other" | "";
  date_of_birth: string;
  branch_id: string;
};

type SignupState = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

const EMPTY_FORM: FormState = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address: "",
  gender: "",
  date_of_birth: "",
  branch_id: "",
};

const EMPTY_SIGNUP: SignupState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
};

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterFlow />
    </Suspense>
  );
}

function RegisterFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");
  const urlError = searchParams.get("error");

  const [phase, setPhase] = useState<
    "loading" | "auth" | "form" | "awaiting_approval" | "expired"
  >("loading");
  const [user, setUser] = useState<Me["user"] | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  // Route the member to the right step based on their account status.
  const routeByStep = useCallback(
    (data: Me) => {
      setUser(data.user);
      setRejectionReason(data.rejection_reason);
      setForm((f) => ({
        ...f,
        first_name: data.user.first_name ?? "",
        last_name: data.user.last_name ?? "",
        email: data.user.email ?? "",
      }));

      const planQuery = planId ? `?plan=${planId}` : "";

      switch (data.step) {
        case "payment":
          router.replace(`/register/payment/${data.registration_id}${planQuery}`);
          return;
        case "awaiting_approval":
          setPhase("awaiting_approval");
          return;
        case "active":
          // Membership is active — send straight to the member portal.
          // The session cookie is shared across localhost ports, so the
          // portal at :3000 picks it up without a second login.
          window.location.href = "http://localhost:3000/portal/dashboard";
          return;
        case "expired":
          setPhase("expired");
          return;
        default:
          // register / rejected — show the registration form
          setPhase("form");
      }
    },
    [planId, router],
  );

  useEffect(() => {
    fetch("/api/branches")
      .then((res) => res.json())
      .then((data) => setBranches(Array.isArray(data) ? data : []))
      .catch(() => setBranches([]));
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (res) => {
        if (res.status === 401) {
          setPhase("auth");
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          setPhase("auth");
          return;
        }
        routeByStep(data);
      })
      .catch(() => setPhase("auth"));
  }, [routeByStep]);

  async function handleSignup(e: React.FormEvent, signup: SignupState) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signup),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? { email: [data.message ?? "Signup failed."] });
        return;
      }

      const me = await fetch("/api/auth/me").then((r) => r.json());
      routeByStep(me);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogin(e: React.FormEvent, credentials: { email: string; password: string }) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? { email: [data.message ?? "Login failed."] });
        return;
      }

      const me = await fetch("/api/auth/me").then((r) => r.json());
      routeByStep(me);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone || null,
          address: form.address || null,
          gender: form.gender || null,
          date_of_birth: form.date_of_birth || null,
          branch_id: form.branch_id || null,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? {});
        return;
      }

      const registrationId = data.registration?.id;
      const paymentUrl = planId
        ? `/register/payment/${registrationId}?plan=${planId}`
        : `/register/payment/${registrationId}`;
      router.push(paymentUrl);
    } finally {
      setSubmitting(false);
    }
  }

  function fieldError(name: string) {
    return errors[name]?.[0];
  }

  if (phase === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (phase === "auth") {
    return (
      <AuthCard
        signupError={urlError}
        errors={errors}
        submitting={submitting}
        onSignup={handleSignup}
        onLogin={handleLogin}
        onSwitchMode={() => setErrors({})}
      />
    );
  }

  if (phase === "awaiting_approval" || phase === "expired") {
    return <StatusCard phase={phase} reason={rejectionReason} />;
  }

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-center py-16 sm:py-24">
      {/* Decorative background glows */}
      <div className="absolute top-[20%] left-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[20%] right-[-10%] -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="container grid gap-12 lg:grid-cols-12 items-center">
        <div className="lg:col-span-5 grid gap-6 text-left">
          <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
            Join PulseFit
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Start your membership today
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Fill out the form, then pick a plan and pay via bKash/Nagad on the
            next step. Our team verifies your payment and activates your
            membership shortly after.
          </p>
          <div className="h-px bg-border/40 w-full my-2" />
          <ul className="grid gap-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                ✓
              </span>
              <span>No long-term contracts, cancel anytime</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                ✓
              </span>
              <span>Pay via bKash or Nagad — no card needed</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                ✓
              </span>
              <span>Pick your plan right after this form</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7">
          <Card className="bg-card/40 border-border/60 shadow-2xl p-4 sm:p-8 backdrop-blur rounded-3xl">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-2xl font-bold">Registration Form</CardTitle>
              <CardDescription>
                Signed in as {user?.email}. Confirm your details to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {rejectionReason && (
                <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  Your previous registration was rejected: {rejectionReason}
                </p>
              )}
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first_name" className="text-xs font-semibold text-muted-foreground">First name</Label>
                    <Input
                      id="first_name"
                      required
                      readOnly
                      value={form.first_name}
                      className="bg-background/60 border-border/60 text-muted-foreground"
                    />
                    {fieldError("first_name") && (
                      <p className="text-xs text-destructive">{fieldError("first_name")}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last_name" className="text-xs font-semibold text-muted-foreground">Last name</Label>
                    <Input
                      id="last_name"
                      required
                      readOnly
                      value={form.last_name}
                      className="bg-background/60 border-border/60 text-muted-foreground"
                    />
                    {fieldError("last_name") && (
                      <p className="text-xs text-destructive">{fieldError("last_name")}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    readOnly
                    value={form.email}
                    className="bg-background/60 border-border/60 text-muted-foreground"
                  />
                  {fieldError("email") && (
                    <p className="text-xs text-destructive">{fieldError("email")}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground">Phone number</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      className="bg-background border-border/60 focus:border-primary/50"
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date_of_birth" className="text-xs font-semibold text-muted-foreground">Date of birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={form.date_of_birth}
                      className="bg-background border-border/60 focus:border-primary/50"
                      onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Gender</Label>
                    <Select
                      value={form.gender || "none"}
                      onValueChange={(v) =>
                        setForm({ ...form, gender: v === "none" ? "" : (v as FormState["gender"]) })
                      }
                    >
                      <SelectTrigger className="bg-background border-border/60 focus:border-primary/50">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Prefer not to say</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Preferred Branch</Label>
                    <Select
                      value={form.branch_id || "none"}
                      onValueChange={(v) => setForm({ ...form, branch_id: v === "none" ? "" : v })}
                    >
                      <SelectTrigger className="bg-background border-border/60 focus:border-primary/50">
                        <SelectValue placeholder="Select a branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No preference</SelectItem>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={String(branch.id)}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldError("branch_id") && (
                      <p className="text-xs text-destructive">{fieldError("branch_id")}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address" className="text-xs font-semibold text-muted-foreground">Home Address</Label>
                  <Textarea
                    id="address"
                    value={form.address}
                    className="bg-background border-border/60 focus:border-primary/50 min-h-[80px]"
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>

                <Button type="submit" size="lg" disabled={submitting} className="mt-4 font-bold uppercase tracking-wider text-xs py-6">
                  {submitting && <Loader2 className="animate-spin mr-2 size-4" />}
                  Continue to plan & payment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AuthCard({
  signupError,
  errors,
  submitting,
  onSignup,
  onLogin,
  onSwitchMode,
}: {
  signupError: string | null;
  errors: Record<string, string[]>;
  submitting: boolean;
  onSignup: (e: React.FormEvent, signup: SignupState) => void;
  onLogin: (e: React.FormEvent, credentials: { email: string; password: string }) => void;
  onSwitchMode: () => void;
}) {
  const [signup, setSignup] = useState<SignupState>(EMPTY_SIGNUP);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [mode, setMode] = useState<"signup" | "login">("signup");

  function fieldError(name: string) {
    return errors[name]?.[0];
  }

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-center py-16 sm:py-24">
      <div className="absolute top-[20%] left-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[20%] right-[-10%] -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="container grid gap-12 lg:grid-cols-12 items-center">
        <div className="lg:col-span-5 grid gap-6 text-left">
          <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
            Join PulseFit
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {mode === "signup" ? "Create your account first" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {mode === "signup"
              ? "Sign up with Google or your email, then fill in your details, pick a plan and pay via bKash/Nagad."
              : "Log in with the same email and password — we will take you exactly where you left off."}
          </p>
        </div>

        <div className="lg:col-span-7">
          <Card className="bg-card/40 border-border/60 shadow-2xl p-4 sm:p-8 backdrop-blur rounded-3xl">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-2xl font-bold">
                {mode === "signup" ? "Get started" : "Log in"}
              </CardTitle>
              <CardDescription>
                {mode === "signup"
                  ? "It takes less than a minute."
                  : "Use your email and password, or Google."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 grid gap-4">
              {signupError && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {signupError}
                </p>
              )}

              <Button variant="outline" size="lg" asChild className="py-6">
                <a href="/api/auth/google">
                  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z"
                      fill="#EA4335"
                    />
                  </svg>
                  {mode === "signup" ? "Continue with Google" : "Log in with Google"}
                </a>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    or use email
                  </span>
                </div>
              </div>

              {mode === "signup" ? (
                <form onSubmit={(e) => onSignup(e, signup)} className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="signup_first_name" className="text-xs font-semibold text-muted-foreground">First name</Label>
                      <Input
                        id="signup_first_name"
                        required
                        value={signup.first_name}
                        onChange={(e) => setSignup({ ...signup, first_name: e.target.value })}
                      />
                      {fieldError("first_name") && (
                        <p className="text-xs text-destructive">{fieldError("first_name")}</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signup_last_name" className="text-xs font-semibold text-muted-foreground">Last name</Label>
                      <Input
                        id="signup_last_name"
                        value={signup.last_name}
                        onChange={(e) => setSignup({ ...signup, last_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signup_email" className="text-xs font-semibold text-muted-foreground">Email</Label>
                    <Input
                      id="signup_email"
                      type="email"
                      required
                      value={signup.email}
                      onChange={(e) => setSignup({ ...signup, email: e.target.value })}
                    />
                    {fieldError("email") && (
                      <p className="text-xs text-destructive">{fieldError("email")}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signup_password" className="text-xs font-semibold text-muted-foreground">Password</Label>
                    <Input
                      id="signup_password"
                      type="password"
                      required
                      minLength={6}
                      value={signup.password}
                      onChange={(e) => setSignup({ ...signup, password: e.target.value })}
                    />
                    {fieldError("password") && (
                      <p className="text-xs text-destructive">{fieldError("password")}</p>
                    )}
                  </div>
                  <Button type="submit" size="lg" disabled={submitting} className="py-6 font-bold uppercase tracking-wider text-xs">
                    {submitting && <Loader2 className="animate-spin mr-2 size-4" />}
                    Create account
                  </Button>
                </form>
              ) : (
                <form
                  onSubmit={(e) => onLogin(e, credentials)}
                  className="grid gap-4"
                >
                  <div className="grid gap-2">
                    <Label htmlFor="login_email" className="text-xs font-semibold text-muted-foreground">Email</Label>
                    <Input
                      id="login_email"
                      type="email"
                      required
                      value={credentials.email}
                      onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    />
                    {fieldError("email") && (
                      <p className="text-xs text-destructive">{fieldError("email")}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="login_password" className="text-xs font-semibold text-muted-foreground">Password</Label>
                    <Input
                      id="login_password"
                      type="password"
                      required
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                    {fieldError("password") && (
                      <p className="text-xs text-destructive">{fieldError("password")}</p>
                    )}
                  </div>
                  <Button type="submit" size="lg" disabled={submitting} className="py-6 font-bold uppercase tracking-wider text-xs">
                    {submitting && <Loader2 className="animate-spin mr-2 size-4" />}
                    Log in
                  </Button>
                </form>
              )}

              <p className="text-sm text-muted-foreground text-center">
                {mode === "signup" ? "Already have an account? " : "New here? "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "signup" ? "login" : "signup");
                    onSwitchMode();
                  }}
                  className="font-medium text-primary underline"
                >
                  {mode === "signup" ? "Log in" : "Create an account"}
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  phase,
  reason,
}: {
  phase: "awaiting_approval" | "expired";
  reason: string | null;
}) {
  const content = {
    awaiting_approval: {
      title: "Awaiting approval",
      description:
        "We have received your registration and payment. Our team is verifying it — you will be able to access your member portal once approved.",
    },
    expired: {
      title: "Membership expired",
      description:
        "Your plan has expired. Please contact the gym or submit a new registration to renew your membership.",
    },
  }[phase];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">{content.title}</CardTitle>
          <CardDescription className="leading-relaxed">
            {content.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {phase === "expired" && (
            <Button variant="outline" asChild>
              <a href="/contact">Contact us</a>
            </Button>
          )}
          {reason && <p className="text-sm text-muted-foreground">{reason}</p>}
          <a href="/" className="text-sm font-medium underline">
            Back to home
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
