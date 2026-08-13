import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3", center && "justify-items-center text-center", className)}>
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-wide text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="max-w-xl text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
