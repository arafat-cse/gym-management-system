import Link from "next/link";
import { Check } from "lucide-react";

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
        "relative flex flex-col",
        highlighted && "border-primary shadow-lg shadow-primary/10 md:scale-105"
      )}
    >
      {highlighted && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
      )}
      <CardHeader className="gap-2 text-center">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold">৳{Number(plan.price).toFixed(0)}</span>
          <span className="text-sm text-muted-foreground">
            / {plan.duration_in_days} days
          </span>
        </div>
        {plan.description && (
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="grid gap-2.5">
          {(plan.features ?? []).map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant={highlighted ? "default" : "outline"}>
          <Link href="/register">Get Started</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
