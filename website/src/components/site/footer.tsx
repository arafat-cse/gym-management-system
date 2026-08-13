import Link from "next/link";
import { Dumbbell, MapPin, Phone } from "lucide-react";

const LINK_COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/pricing", label: "Membership Plans" },
      { href: "/trainers", label: "Our Trainers" },
      { href: "/gallery", label: "Gallery" },
      { href: "/about", label: "About Us" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { href: "/register", label: "Join Now" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container grid gap-10 py-12 md:grid-cols-[2fr_1fr_1fr_1.2fr]">
        <div className="grid gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="size-4" />
            </span>
            <span className="text-lg">PulseFit</span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            A modern fitness club with expert trainers, flexible plans, and a
            community that keeps you moving forward.
          </p>
        </div>

        {LINK_COLUMNS.map((col) => (
          <div key={col.title} className="grid gap-3">
            <h4 className="text-sm font-semibold">{col.title}</h4>
            <ul className="grid gap-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="grid gap-3">
          <h4 className="text-sm font-semibold">Visit Us</h4>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0 translate-y-0.5" />
            <span>House 12, Road 7, Dhanmondi, Dhaka</span>
          </div>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <Phone className="size-4 shrink-0 translate-y-0.5" />
            <span>+880 1700-000000</span>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} PulseFit Gym. All rights reserved.</p>
          <p>Built with care for a stronger community.</p>
        </div>
      </div>
    </footer>
  );
}
