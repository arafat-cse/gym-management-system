"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type AccordionContextValue = {
  openValue: string | null;
  toggle: (value: string) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);
const AccordionItemContext = React.createContext<string>("");

function useAccordionContext() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion components must be used within <Accordion>.");
  return ctx;
}

function Accordion({
  collapsible = true,
  className,
  children,
}: {
  type?: "single";
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [openValue, setOpenValue] = React.useState<string | null>(null);

  const toggle = (value: string) => {
    setOpenValue((prev) => (prev === value ? (collapsible ? null : prev) : value));
  };

  return (
    <AccordionContext.Provider value={{ openValue, toggle }}>
      <div className={cn("flex w-full flex-col", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={cn("border-b", className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
  const { openValue, toggle } = useAccordionContext();
  const value = React.useContext(AccordionItemContext);
  const isOpen = openValue === value;

  return (
    <button
      type="button"
      onClick={() => toggle(value)}
      className={cn(
        "flex w-full flex-1 items-center justify-between py-4 text-left text-sm font-medium transition-all hover:underline",
        className
      )}
    >
      {children}
      <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
    </button>
  );
}

function AccordionContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const { openValue } = useAccordionContext();
  const value = React.useContext(AccordionItemContext);
  if (openValue !== value) return null;

  return <div className={cn("pb-4 text-sm", className)}>{children}</div>;
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
