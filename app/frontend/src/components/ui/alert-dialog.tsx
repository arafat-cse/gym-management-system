"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type AlertDialogContextValue = {
  close: () => void;
};

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null);

function AlertDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <AlertDialogContext.Provider value={{ close: () => onOpenChange(false) }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" />
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
    </AlertDialogContext.Provider>,
    document.body
  );
}

function AlertDialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("mx-auto grid w-full gap-4 rounded-lg border bg-background p-6 shadow-lg", className)}>
      {children}
    </div>
  );
}

function AlertDialogHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("grid gap-1.5", className)}>{children}</div>;
}

function AlertDialogFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}>{children}</div>;
}

function AlertDialogTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={cn("text-lg font-semibold leading-none", className)}>{children}</h2>;
}

function AlertDialogDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

function AlertDialogCancel({
  className,
  disabled,
  children,
}: {
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(AlertDialogContext);
  if (!ctx) throw new Error("AlertDialogCancel must be used within <AlertDialog>.");

  return (
    <Button type="button" variant="outline" disabled={disabled} onClick={ctx.close} className={className}>
      {children}
    </Button>
  );
}

function AlertDialogAction({
  className,
  disabled,
  onClick,
  children,
}: {
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) {
  return (
    <Button type="button" disabled={disabled} onClick={onClick} className={className}>
      {children}
    </Button>
  );
}

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
};
