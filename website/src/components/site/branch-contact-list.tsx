"use client";

import { useEffect, useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Branch } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DEFAULT_CONTACT_ITEMS = [
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

export function BranchContactList() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeBranchId, setActiveBranchId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/branches")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBranches(data);
          if (data.length > 0) {
            setActiveBranchId(data[0].id);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4 text-sm text-muted-foreground">Loading branch details...</div>;
  }

  // Fallback to default if no branches
  if (branches.length === 0) {
    return (
      <div className="grid gap-4">
        {DEFAULT_CONTACT_ITEMS.map((item) => (
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
    );
  }

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  // Helper to format hours
  const formatHours = (hours: any) => {
    if (!hours) return [];
    return Object.entries(hours).map(([day, details]: [string, any]) => {
      const dayName = day.charAt(0).toUpperCase() + day.slice(1);
      if (details.is_closed) return `${dayName}: Closed`;
      return `${dayName}: ${details.open} - ${details.close}`;
    });
  };

  const getContactItems = (branch: Branch) => {
    return [
      {
        icon: MapPin,
        title: "Visit Us",
        lines: [branch.address || "Address not available"],
      },
      {
        icon: Phone,
        title: "Call Us",
        lines: branch.contact_details?.phones?.length 
          ? branch.contact_details.phones 
          : (branch.phone ? [branch.phone] : ["Phone not available"]),
      },
      {
        icon: Mail,
        title: "Email Us",
        lines: branch.contact_details?.emails?.length 
          ? branch.contact_details.emails 
          : ["Email not available"],
      },
      {
        icon: Clock,
        title: "Hours",
        lines: branch.operating_hours 
          ? formatHours(branch.operating_hours) 
          : ["Hours not available"],
      },
    ];
  };

  const items = getContactItems(activeBranch);

  return (
    <div className="space-y-6">
      {branches.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {branches.map((branch) => (
            <Button
              key={branch.id}
              variant={activeBranchId === branch.id ? "default" : "outline"}
              onClick={() => setActiveBranchId(branch.id)}
              className="rounded-full h-8 px-4 text-xs"
            >
              {branch.name}
            </Button>
          ))}
        </div>
      )}
      <div className="grid gap-4">
        {items.map((item) => (
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
    </div>
  );
}
