"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

type SheetContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheetContext() {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error("Sheet components must be used within <Sheet>.");
  return ctx;
}

function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <SheetContext.Provider value={{ open, setOpen: onOpenChange }}>{children}</SheetContext.Provider>
  );
}

function SheetTrigger({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactElement<{ onClick?: () => void }>;
}) {
  const { setOpen } = useSheetContext();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: () => setOpen(true) });
  }

  return <button onClick={() => setOpen(true)}>{children}</button>;
}

function SheetContent({
  side = "right",
  className,
  children,
}: {
  side?: "left" | "right";
  className?: string;
  children: React.ReactNode;
}) {
  const { open, setOpen } = useSheetContext();

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex w-3/4 flex-col gap-4 bg-background p-6 shadow-lg sm:max-w-sm",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-base font-semibold", className)} {...props} />;
}

export { Sheet, SheetTrigger, SheetContent, SheetTitle };
