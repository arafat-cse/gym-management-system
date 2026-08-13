import * as React from "react";

import { cn } from "@/lib/utils";

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
};

// Data-carrier components below — never rendered directly, their props are
// read via React.Children traversal by <Select> instead.
/* eslint-disable @typescript-eslint/no-unused-vars */
function SelectItem(_props: SelectItemProps) {
  return null;
}

function SelectContent(_props: { children: React.ReactNode }) {
  return null;
}

function SelectTrigger(_props: { className?: string; children?: React.ReactNode }) {
  return null;
}

function SelectValue(_props: { placeholder?: string }) {
  return null;
}
/* eslint-enable @typescript-eslint/no-unused-vars */

type SelectProps = {
  value?: string;
  // Method-shorthand signature (not an arrow-function property) so callers can
  // narrow the parameter to a literal union, e.g. `onValueChange={(v: "a"|"b") => ...}`
  // — TS checks method params bivariantly but arrow-property params contravariantly.
  onValueChange?(value: string): void;
  className?: string;
  children: React.ReactNode;
};

function Select({ value, onValueChange, className, children }: SelectProps) {
  const options: { value: string; label: React.ReactNode; disabled?: boolean }[] = [];
  let placeholder: string | undefined;
  let triggerClassName: string | undefined;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === SelectContent) {
      const contentProps = child.props as { children: React.ReactNode };
      React.Children.forEach(contentProps.children, (item) => {
        if (React.isValidElement(item) && item.type === SelectItem) {
          const itemProps = item.props as SelectItemProps;
          options.push({ value: itemProps.value, label: itemProps.children, disabled: itemProps.disabled });
        }
      });
    }

    if (child.type === SelectTrigger) {
      const triggerProps = child.props as { className?: string; children?: React.ReactNode };
      triggerClassName = triggerProps.className;
      React.Children.forEach(triggerProps.children, (grandchild) => {
        if (React.isValidElement(grandchild) && grandchild.type === SelectValue) {
          placeholder = (grandchild.props as { placeholder?: string }).placeholder;
        }
      });
    }
  });

  return (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={cn(
        "flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        triggerClassName,
        className
      )}
    >
      {placeholder && (
        <option value="" disabled hidden={!!value}>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
