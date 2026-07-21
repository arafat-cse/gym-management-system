"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Dumbbell, Menu } from "lucide-react";
import type { Branch } from "@/lib/types";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/trainers", label: "Trainers" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    fetch("/api/branches")
      .then((res) => res.json())
      .then((data) => setBranches(Array.isArray(data) ? data : []))
      .catch(() => setBranches([]));
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Dumbbell className="size-4" />
          </span>
          <span className="text-lg">PulseFit</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          
          <div className="relative group">
            <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Branches <ChevronDown className="size-4" />
            </button>
            <div className="absolute left-0 top-full hidden w-48 pt-2 group-hover:block">
              <div className="rounded-md border bg-background p-2 shadow-lg">
                {branches.length > 0 ? (
                  branches.map(branch => (
                    <Link
                      key={branch.id}
                      href={`/contact`}
                      className="block rounded-sm px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      {branch.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">Loading...</div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/pricing">View Plans</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Join Now</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetTitle className="flex items-center gap-2 text-left">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Dumbbell className="size-4" />
              </span>
              PulseFit
            </SheetTitle>
            <nav className="mt-8 grid gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-base font-medium transition-colors hover:bg-muted",
                    pathname === link.href ? "bg-muted text-foreground" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="px-3 py-2.5 text-base font-medium text-foreground">Branches</div>
              <div className="pl-6 grid gap-1 mb-2">
                {branches.length > 0 ? (
                  branches.map(branch => (
                    <Link
                      key={branch.id}
                      href={`/contact`}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {branch.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">Loading...</div>
                )}
              </div>
            </nav>
            <div className="mt-6 grid gap-2">
              <Button variant="outline" asChild onClick={() => setOpen(false)}>
                <Link href="/pricing">View Plans</Link>
              </Button>
              <Button asChild onClick={() => setOpen(false)}>
                <Link href="/register">Join Now</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
