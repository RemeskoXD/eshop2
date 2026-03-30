import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "primary" | "accent";
};

export default function Badge({ tone = "default", className, ...props }: BadgeProps) {
  const tones = {
    default: "border-black/[0.1] bg-card text-foreground/75",
    primary: "border-primary/30 bg-primary/10 text-primary",
    accent: "border-accent/35 bg-accent/15 text-secondary",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
