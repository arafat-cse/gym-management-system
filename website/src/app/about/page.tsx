import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Target, Trophy, Users2 } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story, mission, and values behind PulseFit Gym.",
};

const VALUES = [
  {
    icon: Target,
    title: "Real Results",
    description: "Every program is built around measurable, personal progress — not generic routines.",
  },
  {
    icon: Users2,
    title: "Community First",
    description: "We're a place people show up for each other, not just a set of machines.",
  },
  {
    icon: HeartHandshake,
    title: "Honest Coaching",
    description: "Our trainers tell you what you need to hear, not just what's easy.",
  },
  {
    icon: Trophy,
    title: "Consistency Over Intensity",
    description: "Sustainable habits beat burnout — we coach for the long run.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b bg-muted/30 py-16 sm:py-20">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <div className="grid gap-4">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              Our Story
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built for people who want to actually stick with it
            </h1>
            <p className="text-muted-foreground">
              PulseFit started with a simple observation: most people don&apos;t
              quit fitness because they lack motivation — they quit because
              nobody made a plan for them, or the environment made it feel like
              a chore. We built a gym around trainers, flexible plans, and a
              community that makes consistency the default, not the struggle.
            </p>
            <p className="text-muted-foreground">
              Today, PulseFit brings together certified coaches, well-kept
              equipment, and simple membership plans — all designed around one
              goal: helping you keep showing up.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border shadow-xl">
            <Image
              src="https://picsum.photos/seed/pulsefit-about/900/700"
              alt="Members training together at PulseFit"
              width={900}
              height={700}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container grid gap-12">
          <SectionHeading
            eyebrow="What We Stand For"
            title="Our values, in practice"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <Card key={value.title}>
                <CardContent className="grid gap-3 pt-6">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <value.icon className="size-5" />
                  </div>
                  <h3 className="font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-16 sm:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Inside PulseFit"
            title="A space built to keep you moving"
            className="mb-10"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl border">
              <Image
                src="https://picsum.photos/seed/pulsefit-floor/900/900"
                alt="PulseFit gym floor"
                width={900}
                height={900}
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border">
              <Image
                src="https://picsum.photos/seed/pulsefit-weights/500/440"
                alt="Free weights area"
                width={500}
                height={440}
                className="aspect-[10/9] w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border">
              <Image
                src="https://picsum.photos/seed/pulsefit-studio/500/440"
                alt="Group class studio"
                width={500}
                height={440}
                className="aspect-[10/9] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Come see it for yourself</h2>
          <p className="max-w-md text-muted-foreground">
            The best way to know if PulseFit is right for you is to visit and meet the team.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/register">
                Join Now <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Get Directions</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
