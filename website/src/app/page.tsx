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
    <div className="relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-[10%] left-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[130px]" />
      <div className="absolute top-[40%] right-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

      {/* Hero */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="container grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 grid gap-6 text-left">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3 text-primary animate-pulse" />
              Now enrolling for {new Date().toLocaleString("en-US", { month: "long" })}
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-balance">
              Train <span className="text-primary text-glow font-black">smarter.</span>
              <br />
              Live <span className="text-primary text-glow font-black">stronger.</span>
            </h1>
            <p className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              PulseFit combines elite personal coaching, state-of-the-art training spaces, and a results-driven community to help you achieve your ultimate fitness goals.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button size="lg" className="px-8 font-bold uppercase tracking-wider text-xs py-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300" asChild>
                <Link href="/register">
                  Get Started Now <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="px-8 font-bold uppercase tracking-wider text-xs py-6 border border-border/80" asChild>
                <Link href="/pricing">Explore Plans</Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-border/40 mt-4">
              <div>
                <p className="text-3xl font-black text-glow">{trainers?.length ?? "5"}+</p>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-0.5">Elite Coaches</p>
              </div>
              <div className="hidden sm:block h-10 w-px bg-border/40" />
              <div>
                <p className="text-3xl font-black text-glow">{plans?.length ?? "3"}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-0.5">Flexible Tiers</p>
              </div>
              <div className="hidden sm:block h-10 w-px bg-border/40" />
              <div>
                <p className="flex items-center gap-1.5 text-3xl font-black text-glow">
                  4.9 <Star className="size-5 fill-primary text-primary" />
                </p>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-0.5">Member Rating</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-primary to-primary/40 opacity-20 blur-2xl -z-10" />
            <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-2xl bg-card">
              <Image
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=900&h=1100"
                alt="Male athlete training at PulseFit Gym"
                width={900}
                height={1100}
                priority
                className="aspect-[4/5] w-full object-cover transition-transform duration-500 hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent" />
            </div>
            
            {/* Floating Badge */}
            <Card className="absolute -bottom-6 -left-6 hidden w-64 shadow-2xl border-primary/20 bg-background/90 backdrop-blur sm:block z-10">
              <CardContent className="flex items-center gap-3.5 p-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <CalendarCheck className="size-5.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Pulse Session</p>
                  <p className="text-sm font-bold text-foreground">Next class: Today, 6:00 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border/40 bg-card/20 py-20 relative">
        <div className="container grid gap-12">
          <SectionHeading
            eyebrow="Why PulseFit"
            title="Everything you need to stay consistent"
            description="We remove the friction between you and your workout — good equipment, real coaching, and a schedule that bends to your life."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="glass-card glow-hover border-border/40">
                <CardContent className="grid gap-3 pt-6">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                    <feature.icon className="size-5.5" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-20 relative">
        <div className="container grid gap-12">
          <SectionHeading
            eyebrow="Membership"
            title="Simple plans, no surprises"
            description="Pick a plan that matches your goals. Switch or cancel anytime."
          />
          {previewPlans.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3 items-center">
              {previewPlans.map((plan, i) => (
                <PricingCard key={plan.id} plan={plan} highlighted={i === 1} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Plans are being updated — check back shortly.
            </p>
          )}
          <div className="flex justify-center mt-4">
            <Button variant="outline" className="border-border hover:bg-secondary font-bold uppercase tracking-wider text-xs px-6 py-5" asChild>
              <Link href="/pricing">
                See all plans <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trainers preview */}
      <section className="border-t border-border/40 bg-card/20 py-20 relative">
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
          <div className="flex justify-center mt-4">
            <Button variant="outline" className="border-border hover:bg-secondary font-bold uppercase tracking-wider text-xs px-6 py-5" asChild>
              <Link href="/trainers">
                Meet all trainers <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative">
        <div className="container grid gap-12">
          <SectionHeading
            eyebrow="Member Stories"
            title="Real people, real progress"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="bg-card/40 backdrop-blur border-border/60 hover:border-primary/30 transition-all duration-300">
                <CardContent className="grid gap-4 pt-6">
                  <div className="flex gap-0.5 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-2">
                    <Avatar className="size-10 border border-primary/20">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                        {t.name.split(" ").map((p) => p[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-foreground">{t.name}</p>
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
      <section className="py-20 relative">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-card to-card/60 border border-border p-8 md:p-14 text-center shadow-2xl">
            {/* Glowing background inside CTA */}
            <div className="absolute bottom-0 right-0 -z-10 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
            <div className="absolute top-0 left-0 -z-10 h-64 w-64 rounded-full bg-primary/5 blur-[80px]" />
            
            <div className="relative z-10 max-w-2xl mx-auto grid gap-6">
              <span className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                Join the PulseFit Tribe
              </span>
              <h2 className="text-3xl font-extrabold sm:text-5xl tracking-tight">
                Ready to start your journey?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Join PulseFit today and get matched with a plan and trainer
                that fits your goals — no long-term contracts.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button size="lg" className="px-8 font-bold uppercase tracking-wider text-xs py-6 shadow-lg shadow-primary/20" asChild>
                  <Link href="/register">
                    Join Now <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 font-bold uppercase tracking-wider text-xs py-6 border-border hover:bg-secondary"
                  asChild
                >
                  <Link href="/contact">Talk to Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
