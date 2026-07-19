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
    <div>
      <section className="border-b bg-muted/30 py-16 sm:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Contact"
            title="We'd love to hear from you"
            description="Questions about membership, trainers, or a specific plan? Reach out and our team will get back to you."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="grid gap-4">
            {CONTACT_ITEMS.map((item) => (
              <Card key={item.title}>
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.lines.map((line) => (
                      <p key={line} className="text-sm text-muted-foreground">
                        {line}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6">
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
