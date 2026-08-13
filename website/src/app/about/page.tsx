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
      <section className="border-b border-border/40 bg-card/25 py-16 sm:py-20">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div className="grid gap-6">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              Our Story
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight text-balance">
              Built for people who want to actually stick with it
            </h1>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              PulseFit started with a simple observation: most people don&apos;t
              quit fitness because they lack motivation — they quit because
              nobody made a plan for them, or the environment made it feel like
              a chore. We built a gym around elite trainers, flexible membership structures, and a
              welcoming environment that makes consistency the default.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Today, PulseFit brings together certified coaches, clean and well-maintained
              equipment, and simple plans — all designed around one
              goal: helping you show up and make progress day after day.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-primary to-primary/30 opacity-20 blur-xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=900&auto=format&fit=crop"
                alt="Members training together at PulseFit"
                width={900}
                height={700}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container grid gap-12">
          <SectionHeading
            eyebrow="What We Stand For"
            title="Our values, in practice"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <Card key={value.title} className="glass-card glow-hover border-border/40">
                <CardContent className="grid gap-3 pt-6">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                    <value.icon className="size-5.5" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 bg-card/25 py-16 sm:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Inside PulseFit"
            title="A space built to keep you moving"
            className="mb-10"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl border border-border/60 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=900&auto=format&fit=crop"
                alt="PulseFit gym floor"
                width={900}
                height={900}
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-border/60 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1637666062717-1c6bcab4a4ed?q=80&w=500&auto=format&fit=crop"
                alt="Free weights area"
                width={500}
                height={440}
                className="aspect-[10/9] w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-border/60 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=500&auto=format&fit=crop"
                alt="Group class studio"
                width={500}
                height={440}
                className="aspect-[10/9] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container flex flex-col items-center gap-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
            Visit Our Gym
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Come see it for yourself</h2>
          <p className="max-w-md text-muted-foreground text-sm sm:text-base leading-relaxed">
            The best way to know if PulseFit is right for you is to visit and meet our certified training staff.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Button size="lg" className="px-8 font-bold uppercase tracking-wider text-xs py-6 shadow-lg shadow-primary/20" asChild>
              <Link href="/register">
                Join Now <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 font-bold uppercase tracking-wider text-xs py-6 border-border hover:bg-secondary" asChild>
              <Link href="/contact">Get Directions</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
