import type { Metadata } from "next";

import { publicApi } from "@/lib/api";
import type { MembershipPlan, PaymentNumber } from "@/lib/types";
import { PaymentForm } from "@/components/site/payment-form";

export const metadata: Metadata = {
  title: "Complete Payment",
};

export default async function RegisterPaymentPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { plan?: string };
}) {
  const [plans, paymentNumbers] = await Promise.all([
    publicApi<MembershipPlan[]>("/plans", 0),
    publicApi<PaymentNumber[]>("/payment-numbers", 0),
  ]);

  const registrationId = Number(params.id);
  const defaultPlanId = searchParams.plan ? Number(searchParams.plan) : undefined;

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-center py-16 sm:py-24">
      <div className="absolute top-[20%] left-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[20%] right-[-10%] -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="container grid gap-12 lg:grid-cols-12 items-center">
        <div className="lg:col-span-5 grid gap-6 text-left">
          <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
            One Step Left
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Pick a plan &amp; pay
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            We don&apos;t use a payment gateway yet — send the plan amount directly via
            bKash or Nagad, then tell us the transaction ID so our team can verify and
            activate your membership.
          </p>
          <div className="h-px bg-border/40 w-full my-2" />
          <ul className="grid gap-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">✓</span>
              <span>Registration already submitted</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">✓</span>
              <span>Send money, then submit the transaction ID</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">✓</span>
              <span>Our team verifies and activates your membership</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7">
          {plans && plans.length > 0 ? (
            <PaymentForm
              registrationId={registrationId}
              plans={plans}
              paymentNumbers={paymentNumbers ?? []}
              defaultPlanId={defaultPlanId}
            />
          ) : (
            <p className="text-center text-muted-foreground">
              Plans aren&apos;t available right now — please contact us directly to complete your membership.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
