import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Registration Received",
};

export default function RegisterSuccessPage() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="size-8" />
      </div>
      <h1 className="text-3xl font-bold">Payment submitted!</h1>
      <p className="max-w-md text-muted-foreground">
        Thanks for applying to PulseFit. Our team will verify your bKash/Nagad
        transaction and activate your membership within 1 business day.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/pricing">Browse Plans</Link>
        </Button>
      </div>
    </div>
  );
}
