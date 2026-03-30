import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export default function Chip({ active, className, type = "button", ...props }: ChipProps) {
  return (
    <button
      type={type}
      className={cn(
        "ui-motion rounded-full border px-3 py-1 text-xs font-semibold",
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border-subtle bg-card text-foreground/70 hover:border-primary/25",
        className,
      )}
      {...props}
    />
  );
}
