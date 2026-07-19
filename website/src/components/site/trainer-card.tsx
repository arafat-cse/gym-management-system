import Link from "next/link";
import { Star } from "lucide-react";

import type { Trainer } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  return (
    <Link href={`/trainers/${trainer.id}`}>
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
          <Avatar className="size-20 border">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {initials(trainer.user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{trainer.user.name}</h3>
            <p className="text-sm text-muted-foreground">
              {trainer.specialization ?? "Personal Trainer"}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="size-4 fill-yellow-500 text-yellow-500" />
            <span className="font-medium">{trainer.rating_avg ?? "New"}</span>
            <span className="text-muted-foreground">
              · {trainer.experience_years} yrs exp
            </span>
          </div>
          {trainer.specializations.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {trainer.specializations.slice(0, 3).map((spec) => (
                <Badge key={spec.id} variant="secondary" className="font-normal">
                  {spec.specialization_name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
