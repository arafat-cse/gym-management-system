"use client";

export type ToastItem = {
  id: number;
  message: string;
  variant: "success" | "error";
};

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
let listeners: Listener[] = [];
let idCounter = 0;

function emit() {
  listeners.forEach((listener) => listener(toasts));
}

function push(message: string, variant: ToastItem["variant"]) {
  const id = ++idCounter;
  toasts = [...toasts, { id, message, variant }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3500);
}

export const toast = {
  success: (message: string) => push(message, "success"),
  error: (message: string) => push(message, "error"),
};

export function subscribeToasts(listener: Listener) {
  listeners.push(listener);
  listener(toasts);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
