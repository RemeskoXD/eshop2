import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function StorePageHero({
  breadcrumbLabel,
  eyebrow,
  title,
  lead,
}: {
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="border-b border-black/[0.06] bg-card">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8 sm:py-12">
        <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm text-black/50">
          <Link href="/" className="transition hover:text-primary">
            Domů
          </Link>
          <ChevronRight className="h-4 w-4 opacity-40" aria-hidden />
          <span className="font-medium text-foreground/80">{breadcrumbLabel}</span>
        </nav>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h1>
        {lead ? <p className="mt-5 max-w-3xl text-base leading-relaxed text-black/75 sm:text-lg">{lead}</p> : null}
      </div>
    </div>
  );
}

export function StorePageBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-4 py-12 sm:px-8 sm:py-14 ${className}`}>{children}</div>
  );
}

export function StoreCardGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

export function StoreInfoCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.08] bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <h2 className="text-lg font-semibold text-primary">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-black/75">{children}</div>
    </div>
  );
}
