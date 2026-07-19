import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/site/section-heading";
import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with PulseFit Gym — visit us or send a message.",
};

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["House 12, Road 7, Dhanmondi", "Dhaka 1209, Bangladesh"],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+880 1700-000000", "+880 2-9999999"],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["hello@pulsefit.example", "support@pulsefit.example"],
  },
  {
    icon: Clock,
    title: "Hours",
    lines: ["Sat – Thu: 6:00 AM – 10:00 PM", "Friday: 3:00 PM – 9:00 PM"],
  },
];
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
            {CONTACT_ITEMS.map((item) => (
              <Card key={item.title} className="bg-card/40 border-border/60 hover:border-primary/30 transition-all duration-300">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                    <item.icon className="size-5.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground mb-1">{item.title}</h3>
                    {item.lines.map((line) => (
                      <p key={line} className="text-sm text-muted-foreground leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
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
