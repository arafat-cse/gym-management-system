"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import type { MembershipPlan, PaymentNumber } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentForm({
  registrationId,
  plans,
  paymentNumbers,
  defaultPlanId,
}: {
  registrationId: number;
  plans: MembershipPlan[];
  paymentNumbers: PaymentNumber[];
  defaultPlanId?: number;
}) {
  const router = useRouter();
  const [planId, setPlanId] = useState<string>(
    defaultPlanId ? String(defaultPlanId) : plans[0] ? String(plans[0].id) : ""
  );
  const [method, setMethod] = useState<"bkash" | "nagad">(paymentNumbers[0]?.method ?? "bkash");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const selectedPlan = plans.find((p) => String(p.id) === planId);
  const numbersForMethod = paymentNumbers.filter((n) => n.method === method);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const formData = new FormData();
      formData.append("membership_plan_id", planId);
      formData.append("method", method);
      formData.append("sender_number", senderNumber);
      formData.append("transaction_id", transactionId);
      formData.append("amount", selectedPlan?.price ?? "0");
      if (screenshot) formData.append("screenshot", screenshot);

      const res = await fetch(`/api/registrations/${registrationId}/payments`, {
        method: "POST",
        body: formData,
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
    <Card className="bg-card/40 border-border/60 shadow-2xl p-4 sm:p-8 backdrop-blur rounded-3xl">
      <CardHeader className="p-0 pb-6">
        <CardTitle className="text-2xl font-bold">Complete Your Payment</CardTitle>
        <CardDescription>
          Choose a plan, send the amount via bKash/Nagad, then submit your transaction ID below.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label className="text-xs font-semibold text-muted-foreground">Select Plan</Label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger className="bg-background/50 border-border/60">
                <SelectValue placeholder="Choose a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={String(plan.id)}>
                    {plan.name} — ৳{Number(plan.price).toFixed(0)} / {plan.duration_in_days} days
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError("membership_plan_id") && (
              <p className="text-xs text-destructive">{fieldError("membership_plan_id")}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label className="text-xs font-semibold text-muted-foreground">Payment Method</Label>
            <Select
              value={method}
              onValueChange={(v) => setMethod(v as "bkash" | "nagad")}
            >
              <SelectTrigger className="bg-background/50 border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bkash">bKash</SelectItem>
                <SelectItem value="nagad">Nagad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {numbersForMethod.length > 0 ? (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
              <p className="font-semibold text-foreground mb-1">Send ৳{selectedPlan ? Number(selectedPlan.price).toFixed(0) : "—"} to:</p>
              {numbersForMethod.map((n) => (
                <p key={n.id} className="text-muted-foreground">
                  <span className="font-mono font-bold text-foreground">{n.number}</span>
                  {n.label ? ` (${n.label})` : ""}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-destructive">
              No {method} number is configured right now — please contact us directly.
            </p>
          )}

          <div className="grid gap-2">
            <Label htmlFor="sender_number" className="text-xs font-semibold text-muted-foreground">
              Your {method === "bkash" ? "bKash" : "Nagad"} Number (sent from)
            </Label>
            <Input
              id="sender_number"
              required
              value={senderNumber}
              className="bg-background/50 border-border/60"
              onChange={(e) => setSenderNumber(e.target.value)}
            />
            {fieldError("sender_number") && (
              <p className="text-xs text-destructive">{fieldError("sender_number")}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="transaction_id" className="text-xs font-semibold text-muted-foreground">
              Transaction ID
            </Label>
            <Input
              id="transaction_id"
              required
              value={transactionId}
              className="bg-background/50 border-border/60"
              onChange={(e) => setTransactionId(e.target.value)}
            />
            {fieldError("transaction_id") && (
              <p className="text-xs text-destructive">{fieldError("transaction_id")}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="screenshot" className="text-xs font-semibold text-muted-foreground">
              Payment Screenshot (optional)
            </Label>
            <Input
              id="screenshot"
              type="file"
              accept="image/*"
              className="bg-background/50 border-border/60"
              onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
            />
            {fieldError("screenshot") && (
              <p className="text-xs text-destructive">{fieldError("screenshot")}</p>
            )}
          </div>

          <Button type="submit" size="lg" disabled={submitting || numbersForMethod.length === 0} className="mt-4 font-bold uppercase tracking-wider text-xs py-6">
            {submitting && <Loader2 className="animate-spin mr-2 size-4" />}
            Submit Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
