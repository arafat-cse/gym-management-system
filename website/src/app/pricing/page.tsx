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
    <div className="relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-[10%] left-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute top-[60%] right-[-10%] -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <section className="border-b border-border/40 bg-card/25 py-16 sm:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Membership Plans"
            title="Pricing that fits your goals"
            description="Every plan gives you full gym floor access. Upgrade for classes, sauna access, and trainer sessions."
          />
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container">
          {list.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-3 items-center">
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

      <section className="border-t border-border/40 bg-card/10 py-16 sm:py-24">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.4fr] items-start">
          <SectionHeading
            center={false}
            eyebrow="FAQ"
            title="Common questions"
            description="Still unsure? Reach out and we'll help you pick the right plan."
          />
          <Accordion type="single" collapsible className="w-full bg-card/40 backdrop-blur rounded-2xl border border-border/60 p-6 md:p-8">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q} className="border-border/60">
                <AccordionTrigger className="text-left font-semibold text-base hover:text-primary transition-colors py-4">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm pb-4">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="border-t border-border/40 py-16 sm:py-24">
        <div className="container flex flex-col items-center gap-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
            Get Consulted
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Not sure which plan fits?</h2>
          <p className="max-w-md text-muted-foreground text-sm sm:text-base leading-relaxed">
            Register your interest and our expert coaching staff will reach out to help you choose the right path.
          </p>
          <Button size="lg" className="px-8 font-bold uppercase tracking-wider text-xs py-6 shadow-lg shadow-primary/20 mt-2" asChild>
            <Link href="/register">
              Get Started <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
