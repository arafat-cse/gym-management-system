import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

import type { MembershipPlan } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PricingCard({
  plan,
  highlighted = false,
}: {
  plan: MembershipPlan;
  highlighted?: boolean;
}) {
  return (
    <Card
      className={cn(
        "relative flex flex-col overflow-hidden transition-all duration-300",
        highlighted
          ? "border-primary bg-card/90 shadow-2xl shadow-primary/10 md:scale-105 z-10"
          : "border-border/60 bg-card/40 backdrop-blur hover:border-primary/40 hover:bg-card/60"
      )}
    >
      {highlighted && (
        <div className="absolute top-0 right-0 left-0 bg-primary py-1.5 text-center text-[11px] font-bold uppercase tracking-wider text-primary-foreground flex items-center justify-center gap-1">
          <Sparkles className="size-3 fill-current" />
          Most Popular Option
        </div>
      )}
      <CardHeader className={cn("gap-1.5 text-center", highlighted ? "pt-10" : "pt-6")}>
        <h3 className="text-xl font-bold uppercase tracking-wider text-foreground">{plan.name}</h3>
        <div className="flex items-baseline justify-center gap-1 my-2">
          <span className="text-sm font-semibold text-muted-foreground">৳</span>
          <span className="text-5xl font-black tracking-tight text-glow">{Number(plan.price).toFixed(0)}</span>
          <span className="text-sm font-medium text-muted-foreground">
            / {plan.duration_in_days} days
          </span>
        </div>
        {plan.description && (
          <p className="text-xs text-muted-foreground max-w-[200px] mx-auto leading-relaxed">{plan.description}</p>
        )}
      </CardHeader>
      <CardContent className="flex-1 px-6 py-4">
        <div className="h-px bg-border/40 w-full mb-5" />
        <ul className="grid gap-3">
          {(plan.features ?? []).map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="size-3.5" />
              </span>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-6">
        <Button
          asChild
          className="w-full font-bold uppercase tracking-wider text-xs py-5"
          variant={highlighted ? "default" : "secondary"}
        >
          <Link href="/register">Get Started Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
