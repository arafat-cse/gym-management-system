import Link from "next/link";
import { Star, Award } from "lucide-react";

import type { Trainer } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTrainerImage } from "@/lib/trainer-images";

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  const imageUrl = getTrainerImage(trainer.user.name);

  return (
    <Link href={`/trainers/${trainer.id}`} className="group block">
      <Card className="h-full overflow-hidden border-border bg-card transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={trainer.user.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary text-4xl font-bold text-primary">
              {trainer.user.name.split(" ").map((p) => p[0]).join("")}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          
          {trainer.experience_years > 0 && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-primary/95 text-primary-foreground font-semibold">
                {trainer.experience_years || 4} Years Exp
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="grid gap-2 p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                {trainer.user.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                {trainer.specialization ?? "Fitness Coach"}
              </p>
            </div>
            <div className="flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-xs font-semibold text-primary">
              <Star className="size-3.5 fill-primary text-primary" />
              <span>{trainer.rating_avg && Number(trainer.rating_avg) > 0 ? Number(trainer.rating_avg).toFixed(1) : "4.9"}</span>
            </div>
          </div>

          {trainer.specializations.length > 0 ? (
            <div className="flex flex-wrap gap-1 pt-1">
              {trainer.specializations.slice(0, 2).map((spec) => (
                <Badge key={spec.id} variant="outline" className="border-border text-xs text-muted-foreground bg-muted/40 font-normal">
                  {spec.specialization_name}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
              <Award className="size-3 text-primary" />
              <span>Certified Trainer</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
