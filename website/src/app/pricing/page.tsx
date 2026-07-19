import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import { publicApi } from "@/lib/api";
import type { MembershipPlan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/site/section-heading";
import { PricingCard } from "@/components/site/pricing-card";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, flexible membership plans for every fitness goal.",
};

const FAQS = [
  {
    q: "Can I switch plans later?",
    a: "Yes. You can upgrade or downgrade anytime — just visit the front desk or contact us and we'll adjust your membership.",
  },
  {
    q: "Is there a joining fee?",
    a: "No hidden joining fees. The price you see is the price you pay for your billing period.",
  },
  {
    q: "Can I pause my membership?",
    a: "Memberships can be paused for travel or medical reasons — reach out to our team to arrange it.",
  },
  {
    q: "Do plans include trainer sessions?",
    a: "Higher-tier plans include trainer sessions each month. You can also book extra sessions at any time.",
  },
];

export default async function PricingPage() {
  const plans = await publicApi<MembershipPlan[]>("/plans");
  const list = plans ?? [];
  const highlightIndex = list.length >= 2 ? 1 : 0;

  return (
    <div>
      <section className="border-b bg-muted/30 py-16 sm:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Membership Plans"
            title="Pricing that fits your goals"
            description="Every plan gives you full gym floor access. Upgrade for classes, sauna access, and trainer sessions."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container">
          {list.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {list.map((plan, i) => (
                <PricingCard key={plan.id} plan={plan} highlighted={i === highlightIndex} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Plans are being updated — check back shortly, or{" "}
              <Link href="/contact" className="text-primary underline">
                contact us
              </Link>{" "}
              for current pricing.
            </p>
          )}
        </div>
      </section>

      <section className="border-t py-16 sm:py-20">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading
            center={false}
            eyebrow="FAQ"
            title="Common questions"
            description="Still unsure? Reach out and we'll help you pick the right plan."
          />
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="border-t py-16 sm:py-20">
        <div className="container flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Not sure which plan fits?</h2>
          <p className="max-w-md text-muted-foreground">
            Register your interest and our team will help you choose the right plan.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">
              Get Started <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
