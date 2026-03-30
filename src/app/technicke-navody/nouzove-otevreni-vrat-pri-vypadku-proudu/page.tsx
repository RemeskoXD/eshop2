import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/json-ld";
import { StorePageBody, StorePageHero } from "@/components/store-content-layout";
import { absoluteUrl } from "@/lib/site";
import { buildWebPageJsonLd } from "@/lib/structured-data/webpage";

const PATH = "/technicke-navody/nouzove-otevreni-vrat-pri-vypadku-proudu";
const DESCRIPTION =
  "Co dělat při výpadku proudu u garážových vrat: nouzové otevření, bezpečný postup a kdy volat servis.";

export const metadata: Metadata = {
  title: "Nouzové otevření vrat při výpadku proudu | QAPI",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    title: "Nouzové otevření vrat při výpadku proudu | QAPI",
    description: DESCRIPTION,
    url: PATH,
  },
};

export default function NouzoveOtevreniVratPage() {
  const jsonLd = buildWebPageJsonLd({
    name: "Nouzové otevření vrat při výpadku proudu | QAPI",
    description: DESCRIPTION,
    path: PATH,
    breadcrumbs: [
      { name: "Domů", path: "/" },
      { name: "Technické návody", path: "/technicke-navody" },
      { name: "Nouzové otevření vrat", path: PATH },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <StorePageHero
        breadcrumbLabel="Technické návody"
        eyebrow="Servis a bezpečnost"
        title="Co dělat při výpadku proudu u vrat"
        lead="Základní bezpečný postup pro nouzové otevření a prevence situací, kdy se k vozidlu nebo do objektu nedostanete."
      />
      <StorePageBody className="space-y-8">
        <section className="rounded-2xl border border-black/[0.08] bg-card p-5 text-sm leading-relaxed text-black/75 shadow-sm">
          <p className="font-semibold text-foreground">Doporučený postup</p>
          <ol className="mt-2 list-decimal space-y-2 pl-5">
            <li>Zkontrolujte, zda nejde o lokální jistič nebo vypnutý okruh.</li>
            <li>Použijte nouzové odjištění pohonu podle návodu výrobce.</li>
            <li>Vrata otevřete ručně plynulým tahem bez násilí.</li>
            <li>Po obnovení napájení zkontrolujte správné zavření a dorazy.</li>
          </ol>
          <p className="mt-3">
            Pokud vrata drhnou, nerovnoměrně se zvedají nebo slyšíte neobvyklý zvuk, nepokračujte silou a kontaktujte servis.
          </p>
        </section>
        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm shadow-sm">
          <p className="font-semibold text-foreground">Prevence do budoucna</p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-black/70">
            <li>Mějte přístup k nouzovému odjištění i zvenku (pokud je to relevantní pro dispozici).</li>
            <li>Pravidelně kontrolujte stav mechanických částí při servisní prohlídce.</li>
            <li>Při výběru řešení zvažte i scénáře výpadku napájení.</li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/kategorie/vrata" className="rounded-xl bg-accent px-4 py-2.5 font-semibold text-white hover:bg-foreground">
              Vybrat vrata v konfigurátoru
            </Link>
            <Link href="/kontakt?konzultace=1" className="rounded-xl border border-black/[0.12] bg-white px-4 py-2.5 font-semibold text-foreground/85 hover:border-primary/30">
              Konzultace a servis
            </Link>
          </div>
        </section>
      </StorePageBody>
    </>
  );
}
