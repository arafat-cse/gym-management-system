import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { SiteNavbar } from "@/components/site/navbar";
import { SiteFooter } from "@/components/site/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const SITE_DESCRIPTION =
  "PulseFit Gym is a modern fitness club with expert trainers, flexible membership plans, and a community that keeps you moving forward.";

export const metadata: Metadata = {
  title: {
    default: "PulseFit Gym — Train Smarter, Live Stronger",
    template: "%s — PulseFit Gym",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "PulseFit Gym — Train Smarter, Live Stronger",
    description: SITE_DESCRIPTION,
    type: "website",
    images: ["https://picsum.photos/seed/pulsefit-og/1200/630"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseFit Gym — Train Smarter, Live Stronger",
    description: SITE_DESCRIPTION,
    images: ["https://picsum.photos/seed/pulsefit-og/1200/630"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "font-sans antialiased"
        )}
      >
        <div className="flex min-h-screen flex-col">
          <SiteNavbar />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
