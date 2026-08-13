import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/site/section-heading";
import { ContactForm } from "@/components/site/contact-form";
import { BranchContactList } from "@/components/site/branch-contact-list";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with PulseFit Gym — visit us or send a message.",
};
export default function ContactPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-[20%] right-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[10%] left-[-10%] -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <section className="border-b border-border/40 bg-card/25 py-16 sm:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Contact"
            title="We'd love to hear from you"
            description="Questions about membership, trainers, or a specific plan? Reach out and our team will get back to you."
          />
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.2fr] items-start">
          <div className="grid gap-4">
            <BranchContactList />
          </div>

          <Card className="bg-card/40 border-border/60 shadow-xl p-6 md:p-8 backdrop-blur">
            <CardContent className="p-0">
              <h3 className="text-xl font-bold mb-1 text-foreground">Send a Message</h3>
              <p className="text-xs text-muted-foreground mb-6">Fill out the form below and we will get back to you shortly.</p>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
