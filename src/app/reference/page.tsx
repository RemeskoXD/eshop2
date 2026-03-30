import type { Metadata } from "next";
import Link from "next/link";
import { Camera, ImageIcon } from "lucide-react";
import JsonLd from "@/components/json-ld";
import ReferenceCard from "@/components/reference-card";
import { StorePageBody, StorePageHero } from "@/components/store-content-layout";
import { references } from "@/data/references";
import { absoluteUrl } from "@/lib/site";
import { buildReferencePageJsonLd } from "@/lib/structured-data/references-page";

const REFERENCE_PATH = "/reference";

export const metadata: Metadata = {
  title: "Reference | QAPI",
  description: "Ukázky realizací vrat a stínění — reference z praxe.",
  alternates: { canonical: absoluteUrl(REFERENCE_PATH) },
  openGraph: {
    title: "Reference | QAPI",
    description: "Vybrané realizace vrat a venkovního či interiérového stínění.",
    url: REFERENCE_PATH,
  },
};

export default function ReferencePage() {
  const hasItems = references.length > 0;

  return (
    <>
      <JsonLd data={buildReferencePageJsonLd(references, REFERENCE_PATH)} />
      <StorePageHero
        breadcrumbLabel="Reference"
        eyebrow="Ukázky realizací"
        title="Reference"
        lead="Vybrané realizace vrat a stínění. U vybraných projektů můžete v datech přidat i snímek „před“ (imageBefore) a krátký příběh (quote) — kombinace Před/Po výrazně zvyšuje důvěru proti samotným studiovým fotkám."
      />
      <StorePageBody>
        {hasItems ? (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {references.map((item) => (
                <ReferenceCard key={item.id} item={item} />
              ))}
            </div>
            <p className="mt-10 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-dashed border-black/[0.1] bg-strip/80 px-4 py-3 text-center text-xs text-black/55">
              <Camera className="h-4 w-4 text-primary" strokeWidth={1.75} />
              Chcete být v referencích? Ozvěte se po realizaci — rádi doplníme váš projekt (se souhlasem).
            </p>
          </>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-black/[0.12] bg-strip px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-black/35 shadow-sm ring-1 ring-black/[0.06]">
              <ImageIcon className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <p className="mt-4 font-medium text-foreground/90">Zatím žádné reference v datech</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-black/60">
              Přidejte položky do <code className="rounded bg-black/5 px-1">src/data/references.ts</code> a obrázky do{" "}
              <code className="rounded bg-black/5 px-1">public/IMAGE/</code>.
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/kontakt"
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-foreground"
          >
            Poptat realizaci
          </Link>
          <Link
            href="/#kategorie"
            className="rounded-xl border border-black/[0.1] bg-card px-5 py-2.5 text-sm font-semibold text-foreground/90 transition hover:border-primary/30"
          >
            Prohlédnout produkty
          </Link>
        </div>
      </StorePageBody>
    </>
  );
}
