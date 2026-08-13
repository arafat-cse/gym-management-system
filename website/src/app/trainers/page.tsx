import type { Metadata } from "next";

import { publicApi } from "@/lib/api";
import type { Trainer } from "@/lib/types";
import { SectionHeading } from "@/components/site/section-heading";
import { TrainerCard } from "@/components/site/trainer-card";

export const metadata: Metadata = {
  title: "Trainers",
  description: "Meet the certified trainers at PulseFit Gym.",
};

export default async function TrainersPage() {
  const trainers = await publicApi<Trainer[]>("/trainers");
  const list = trainers ?? [];

  return (
    <div>
      <section className="border-b bg-muted/30 py-16 sm:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Our Team"
            title="Meet your trainers"
            description="Certified coaches across strength, yoga, and functional fitness — each one focused on getting you real results."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container">
          {list.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((trainer) => (
                <TrainerCard key={trainer.id} trainer={trainer} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Trainer profiles are being updated — check back shortly.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
