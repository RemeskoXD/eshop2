import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  elevated?: boolean;
};

export default function Card({ elevated, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        elevated ? "ui-surface-strong" : "ui-surface",
        "ui-motion ui-hover-lift rounded-2xl",
        className,
      )}
      {...props}
    />
  );
}
