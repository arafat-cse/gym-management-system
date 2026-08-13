"use client";

import * as React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { subscribeToasts, type ToastItem } from "@/lib/toast-store";

function Toaster() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  React.useEffect(() => subscribeToasts(setToasts), []);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg",
            t.variant === "error" && "border-destructive/50 text-destructive"
          )}
        >
          {t.variant === "success" ? (
            <CheckCircle2 className="size-4 shrink-0 text-primary" />
          ) : (
            <XCircle className="size-4 shrink-0" />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export { Toaster };
