"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dumbbell, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WEBSITE_URL = "http://localhost:3001";

type Me = {
  step: "register" | "payment" | "awaiting_approval" | "active" | "expired" | "rejected";
};

export default function LoginPage() {
  return (
    <Suspense>
      <MemberAuth />
    </Suspense>
  );
}

function MemberAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Route an authenticated member to the right place:
  // active members go to the portal, everyone else continues
  // their registration on the public website.
  const routeMember = useCallback(() => {
    fetch("/api/member-auth/me")
      .then((res) => res.json())
      .then((data: Me) => {
        if (data.step === "active") {
          router.replace("/portal/dashboard");
          router.refresh();
          return;
        }
        const plan = searchParams.get("plan");
        window.location.href = `${WEBSITE_URL}/register${plan ? `?plan=${plan}` : ""}`;
      })
      .catch(() => {
        window.location.href = WEBSITE_URL + "/register";
      });
  }, [router, searchParams]);

  return <AuthCard onAuthenticated={routeMember} error={searchParams.get("error")} />;
}

function AuthCard({
  onAuthenticated,
  error,
}: {
  onAuthenticated: () => void;
  error: string | null;
}) {
  const [mode, setMode] = useState<"signup" | "login">("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  function fieldError(name: string) {
    return errors[name]?.[0];
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/member-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? { email: [data.message ?? "Login failed."] });
        return;
      }

      onAuthenticated();
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/member-auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? { email: [data.message ?? "Signup failed."] });
        return;
      }

      onAuthenticated();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Dumbbell className="size-5" />
          </div>
          <CardTitle>GMS Membership</CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Log in to your member account"
              : "Create your member account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button variant="outline" asChild>
            <a href="/api/member-auth/google">
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
              {mode === "login" ? "Log in with Google" : "Continue with Google"}
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

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
                {fieldError("email") && (
                  <p className="text-xs text-destructive">{fieldError("email")}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
                {fieldError("password") && (
                  <p className="text-xs text-destructive">{fieldError("password")}</p>
                )}
              </div>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Log in
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="grid gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="first_name">First name</Label>
                  <Input
                    id="first_name"
                    required
                    value={signupForm.first_name}
                    onChange={(e) => setSignupForm({ ...signupForm, first_name: e.target.value })}
                  />
                  {fieldError("first_name") && (
                    <p className="text-xs text-destructive">{fieldError("first_name")}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input
                    id="last_name"
                    value={signupForm.last_name}
                    onChange={(e) => setSignupForm({ ...signupForm, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup_email">Email</Label>
                <Input
                  id="signup_email"
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                />
                {fieldError("email") && (
                  <p className="text-xs text-destructive">{fieldError("email")}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup_password">Password</Label>
                <Input
                  id="signup_password"
                  type="password"
                  required
                  minLength={6}
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                />
                {fieldError("password") && (
                  <p className="text-xs text-destructive">{fieldError("password")}</p>
                )}
              </div>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Create account
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "New here? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setErrors({});
              }}
              className="font-medium text-primary underline"
            >
              {mode === "login" ? "Create an account" : "Log in"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
