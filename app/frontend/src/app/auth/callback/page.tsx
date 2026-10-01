"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dumbbell, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WEBSITE_URL = "http://localhost:3001";

export default function GoogleCallbackPage() {
  return (
    <Suspense>
      <GoogleCallback />
    </Suspense>
  );
}

function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const started = useRef(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error"),
  );

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setError("Missing sign-in token.");
      return;
    }

    async function continueFlow() {
      const res = await fetch("/api/member-auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        setError("Could not start your session. Please try again.");
        return;
      }

      // Route by membership status: active → portal, otherwise the
      // website continues the registration/payment flow.
      const me = await fetch("/api/member-auth/me").then((r) => r.json());

      if (me.step === "active") {
        router.replace("/portal/dashboard");
        router.refresh();
        return;
      }

      window.location.replace(`${WEBSITE_URL}/register`);
    }

    continueFlow();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Dumbbell className="size-5" />
          </div>
          <CardTitle>Google Sign-in</CardTitle>
          <CardDescription>
            {error ? "Something went wrong." : "Completing sign in, please wait..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {error ? (
            <>
              <p className="text-center text-sm text-destructive">{error}</p>
              <a href="/login" className="text-sm font-medium underline">
                Back to login
              </a>
            </>
          ) : (
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
