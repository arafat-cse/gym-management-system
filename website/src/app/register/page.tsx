"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

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
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? {});
        return;
      }

      router.push("/register/success");
    } finally {
      setSubmitting(false);
    }
  }

  function fieldError(name: string) {
    return errors[name]?.[0];
  }

  return (
    <div className="container grid gap-10 py-16 sm:py-20 lg:grid-cols-2">
      <div className="grid content-center gap-4">
        <span className="text-sm font-semibold uppercase tracking-wide text-primary">
          Join PulseFit
        </span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Start your membership today
        </h1>
        <p className="max-w-md text-muted-foreground">
          Fill out the form and our team will review your registration and
          confirm your membership shortly. No payment required to apply.
        </p>
        <ul className="grid gap-2 text-sm text-muted-foreground">
          <li>✓ No long-term contract</li>
          <li>✓ Reviewed by our team within 1 business day</li>
          <li>✓ Choose your plan after approval</li>
        </ul>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registration Form</CardTitle>
          <CardDescription>Tell us a bit about yourself.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  required
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                />
                {fieldError("first_name") && (
                  <p className="text-xs text-destructive">{fieldError("first_name")}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  required
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                />
                {fieldError("last_name") && (
                  <p className="text-xs text-destructive">{fieldError("last_name")}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {fieldError("password") && (
                <p className="text-xs text-destructive">{fieldError("password")}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Gender</Label>
                <Select
                  value={form.gender || "none"}
                  onValueChange={(v) =>
                    setForm({ ...form, gender: v === "none" ? "" : (v as FormState["gender"]) })
                  }
                >
                  <SelectTrigger>
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
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <Button type="submit" size="lg" disabled={submitting} className="mt-2">
              {submitting && <Loader2 className="animate-spin" />}
              Submit Registration
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
