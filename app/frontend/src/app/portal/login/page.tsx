"use client";

import { Suspense, useEffect, useState } from "react";
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

export default function PortalLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // If the browser restores this page from the back-forward cache after
  // login, reload so the middleware can bounce the user to the portal.
  useEffect(() => {
    function onShow(e: PageTransitionEvent) {
      if (e.persisted) window.location.reload();
    }
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  // Already signed in (e.g. user pressed "back" to this page)? Leave
  // immediately instead of showing the form again.
  useEffect(() => {
    fetch("/api/portal-auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.replace("/portal/dashboard");
          router.refresh();
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/portal-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Login failed.");
        return;
      }

      // replace() keeps the login page out of the history, so "back"
      // from the portal never returns to this form.
      const next = searchParams.get("next") ?? "/portal/dashboard";
      router.replace(next);
      router.refresh();
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
          <CardTitle>GMS Member Portal</CardTitle>
          <CardDescription>Sign in as a member, staff, or trainer</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="mt-2">
              {loading && <Loader2 className="animate-spin" />}
              Sign in
            </Button>
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>
            <Button type="button" variant="outline" asChild>
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
                Sign in with Google
              </a>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
