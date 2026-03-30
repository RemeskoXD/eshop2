import Link from "next/link";
import { FileWarning } from "lucide-react";
import type { ReactNode } from "react";
import { StorePageBody, StorePageHero } from "@/components/store-content-layout";

export function LegalLayout({
  title,
  lead,
  breadcrumbLabel,
  children,
}: {
  title: string;
  lead?: string;
  /** Text v drobečkové navigaci (výchozí = title) */
  breadcrumbLabel?: string;
  children: ReactNode;
}) {
  return (
    <>
      <StorePageHero
        breadcrumbLabel={breadcrumbLabel ?? title}
        eyebrow="Právní informace"
        title={title}
        lead={lead}
      />
      <StorePageBody className="max-w-3xl">
        <article className="prose-legal space-y-8 text-sm leading-relaxed text-black/80">
          {children}
        </article>
        <div className="mt-12 flex gap-3 rounded-2xl border border-amber-200/80 bg-[#fffdf6] p-5 text-xs leading-relaxed text-black/75">
          <FileWarning className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" strokeWidth={1.75} />
          <p>
            <strong>Upozornění:</strong> Texty slouží jako podklad pro právníka. Před ostrým provozem je nutné je
            zkontrolovat a přizpůsobit vaší firmě a typu zakázek.
          </p>
        </div>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          ← Zpět na úvod
        </Link>
      </StorePageBody>
    </>
  );
}
