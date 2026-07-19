import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Dumbbell,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Users,
} from "lucide-react";

import { publicApi } from "@/lib/api";
import type { MembershipPlan, Trainer } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SectionHeading } from "@/components/site/section-heading";
import { PricingCard } from "@/components/site/pricing-card";
import { TrainerCard } from "@/components/site/trainer-card";

const FEATURES = [
  {
    icon: Dumbbell,
    title: "Modern Equipment",
    description: "Strength, cardio, and functional training gear kept in top condition.",
  },
  {
    icon: Users,
    title: "Expert Trainers",
    description: "Certified coaches who build programs around your actual goals.",
  },
  {
    icon: CalendarCheck,
    title: "Flexible Scheduling",
    description: "Book sessions that fit your life — mornings, evenings, or weekends.",
  },
  {
    icon: HeartPulse,
    title: "Progress You Can See",
    description: "Track sessions, ratings, and milestones as you move forward.",
  },
  {
    icon: ShieldCheck,
    title: "Safe, Clean Spaces",
    description: "Hygienic facilities and equipment maintained to a high standard.",
  },
  {
    icon: Timer,
    title: "No Long Contracts",
    description: "Simple monthly plans — upgrade, pause, or cancel anytime.",
  },
];

const TESTIMONIALS = [
  {
    name: "Tanvir A.",
    role: "Member since 2025",
    quote:
      "The trainers actually pay attention. I went from skipping workouts to looking forward to them every week.",
  },
  {
    name: "Farzana R.",
    role: "Gold Plan member",
    quote:
      "Clean facility, flexible hours, and booking a session takes seconds. Exactly what I needed.",
  },
  {
    name: "Imran K.",
    role: "Platinum Plan member",
    quote:
      "Unlimited sessions changed my routine completely. Best fitness decision I've made.",
  },
];

export default async function HomePage() {
  const [plans, trainers] = await Promise.all([
    publicApi<MembershipPlan[]>("/plans"),
    publicApi<Trainer[]>("/trainers"),
  ]);

  const previewPlans = (plans ?? []).slice(0, 3);
  const previewTrainers = (trainers ?? []).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:py-28">
          <div className="grid gap-6">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Now enrolling for {new Date().toLocaleString("en-US", { month: "long" })}
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Train smarter.
              <br />
              Live <span className="text-primary">stronger.</span>
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              PulseFit brings expert trainers, flexible plans, and a real
              community together — so showing up becomes the easy part.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/register">
                  Join Now <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-2">
              <div>
                <p className="text-2xl font-bold">{trainers?.length ?? "5"}+</p>
                <p className="text-sm text-muted-foreground">Expert trainers</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold">{plans?.length ?? "3"}</p>
                <p className="text-sm text-muted-foreground">Flexible plans</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="flex items-center gap-1 text-2xl font-bold">
                  4.9 <Star className="size-5 fill-yellow-500 text-yellow-500" />
                </p>
                <p className="text-sm text-muted-foreground">Member rating</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-primary/10 blur-2xl" />
            <div className="overflow-hidden rounded-2xl border shadow-xl">
              <Image
                src="https://picsum.photos/seed/pulsefit-hero/900/1000"
                alt="Member training at PulseFit Gym"
                width={900}
                height={1000}
                priority
                className="aspect-[9/10] w-full object-cover"
              />
            </div>
            <Card className="absolute -bottom-6 -left-6 hidden w-56 shadow-lg sm:block">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CalendarCheck className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Session Booked</p>
                  <p className="text-xs text-muted-foreground">Today, 6:00 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container grid gap-12">
          <SectionHeading
            eyebrow="Why PulseFit"
            title="Everything you need to stay consistent"
            description="We remove the friction between you and your workout — good equipment, real coaching, and a schedule that bends to your life."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="grid gap-3 pt-6">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-20">
        <div className="container grid gap-12">
          <SectionHeading
            eyebrow="Membership"
            title="Simple plans, no surprises"
            description="Pick a plan that matches your goals. Switch or cancel anytime."
          />
          {previewPlans.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {previewPlans.map((plan, i) => (
                <PricingCard key={plan.id} plan={plan} highlighted={i === 1} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Plans are being updated — check back shortly.
            </p>
          )}
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/pricing">
                See all plans <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trainers preview */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container grid gap-12">
          <SectionHeading
            eyebrow="Our Team"
            title="Coaches who actually coach"
            description="Certified trainers across strength, yoga, and functional fitness — ready to build a plan around you."
          />
          {previewTrainers.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {previewTrainers.map((trainer) => (
                <TrainerCard key={trainer.id} trainer={trainer} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Trainer profiles are being updated — check back shortly.
            </p>
          )}
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/trainers">
                Meet all trainers <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container grid gap-12">
          <SectionHeading
            eyebrow="Member Stories"
            title="Real people, real progress"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name}>
                <CardContent className="grid gap-4 pt-6">
                  <div className="flex gap-0.5 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="text-xs">
                        {t.name.split(" ").map((p) => p[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-20">
        <div className="container">
          <Card className="overflow-hidden border-none bg-primary text-primary-foreground">
            <CardContent className="grid items-center gap-6 p-10 text-center sm:p-14">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready to start your journey?
              </h2>
              <p className="mx-auto max-w-xl text-primary-foreground/80">
                Join PulseFit today and get matched with a plan and trainer
                that fits your goals — no long-term contracts.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/register">
                    Join Now <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  asChild
                >
                  <Link href="/contact">Talk to Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
