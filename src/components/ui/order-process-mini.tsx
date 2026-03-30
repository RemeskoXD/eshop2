import Link from "next/link";
import React from "react";
import { CheckCircle2 } from "lucide-react";

type OrderProcessMiniProps = {
  className?: string;
  title?: string;
};

const steps = [
  "Ověříme parametry a ozveme se, pokud něco nesedí.",
  "Domluvíme zaměření a technické ověření na místě.",
  "Potvrdíme finální cenu a termín realizace.",
  "Zajistíme výrobu, montáž a následnou podporu.",
] as const;

export default function OrderProcessMini({ className = "", title = "Jak probíhá objednávka" }: OrderProcessMiniProps) {
  return (
    <div className={`rounded-xl border border-black/[0.08] bg-card p-4 ${className}`}>
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <CheckCircle2 className="h-4 w-4 text-primary" strokeWidth={1.8} />
        {title}
      </p>
      <ol className="mt-2 space-y-1.5 text-xs leading-relaxed text-black/70">
        {steps.map((s, i) => (
          <li key={s}>
            {i + 1}) {s}
          </li>
        ))}
      </ol>
      <Link href="/jak-probiha-objednavka" className="ui-motion mt-2 inline-flex text-xs font-semibold text-primary hover:underline">
        Detailní postup a zaměření
      </Link>
    </div>
  );
}

