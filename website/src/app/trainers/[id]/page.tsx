import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Star } from "lucide-react";
import type { Metadata } from "next";

import { publicApi } from "@/lib/api";
import type { Trainer } from "@/lib/types";
import { Button } from "@/components/ui/button";
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

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const trainer = await publicApi<Trainer>(`/trainers/${params.id}`);
  return { title: trainer ? trainer.user.name : "Trainer" };
}

export default async function TrainerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const trainer = await publicApi<Trainer>(`/trainers/${params.id}`);

  if (!trainer) {
    notFound();
  }

  return (
    <div>
      <section className="border-b bg-muted/30 py-12">
        <div className="container">
          <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
            <Link href="/trainers">
              <ArrowLeft className="size-4" /> Back to trainers
            </Link>
          </Button>

          <div className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-center">
            <Avatar className="size-28 border">
              <AvatarFallback className="bg-primary/10 text-3xl font-semibold text-primary">
                {initials(trainer.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-2">
              <h1 className="text-3xl font-bold">{trainer.user.name}</h1>
              <p className="text-lg text-muted-foreground">
                {trainer.specialization ?? "Personal Trainer"}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-500 text-yellow-500" />
                  {trainer.rating_avg ?? "New"} rating
                </span>
                <span>{trainer.experience_years} years experience</span>
                {trainer.branch && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-4" /> {trainer.branch.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="grid gap-8">
            <div className="grid gap-3">
              <h2 className="text-xl font-semibold">About</h2>
              <p className="text-muted-foreground">
                {trainer.bio ??
                  `${trainer.user.name} is a dedicated trainer at PulseFit, committed to helping members reach their fitness goals.`}
              </p>
            </div>

            {trainer.specializations.length > 0 && (
              <div className="grid gap-3">
                <h2 className="text-xl font-semibold">Certifications & Specialties</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {trainer.specializations.map((spec) => (
                    <Card key={spec.id}>
                      <CardContent className="grid gap-1 pt-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{spec.specialization_name}</p>
                          {spec.certification_level && (
                            <Badge variant="secondary" className="capitalize">
                              {spec.certification_level}
                            </Badge>
                          )}
                        </div>
                        {spec.issuing_authority && (
                          <p className="text-sm text-muted-foreground">
                            {spec.issuing_authority}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Card className="h-fit">
            <CardContent className="grid gap-4 pt-6 text-center">
              <h3 className="font-semibold">Ready to train with {trainer.user.name.split(" ")[0]}?</h3>
              <p className="text-sm text-muted-foreground">
                Join PulseFit and book a session once your membership is active.
              </p>
              <Button asChild>
                <Link href="/register">
                  Join Now <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Ask a Question</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
