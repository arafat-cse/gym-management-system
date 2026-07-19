"use client";

import { Suspense, useEffect, useState } from "react";
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

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  gender: "male" | "female" | "other" | "";
  date_of_birth: string;
  branch_id: string;
};

const EMPTY_FORM: FormState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  gender: "",
  date_of_birth: "",
  branch_id: "",
};

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/branches")
      .then((res) => res.json())
      .then((data) => setBranches(Array.isArray(data) ? data : []))
      .catch(() => setBranches([]));
  }, []);

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
          password: form.password,
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
              <CardDescription>Tell us a bit about yourself to get started.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first_name" className="text-xs font-semibold text-muted-foreground">First name</Label>
                    <Input
                      id="first_name"
                      required
                      value={form.first_name}
                      className="bg-background border-border/60 focus:border-primary/50"
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })}
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
                      value={form.last_name}
                      className="bg-background border-border/60 focus:border-primary/50"
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })}
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
                    value={form.email}
                    className="bg-background border-border/60 focus:border-primary/50"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  {fieldError("email") && (
                    <p className="text-xs text-destructive">{fieldError("email")}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={form.password}
                    className="bg-background border-border/60 focus:border-primary/50"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  {fieldError("password") && (
                    <p className="text-xs text-destructive">{fieldError("password")}</p>
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
                  Submit Registration
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
