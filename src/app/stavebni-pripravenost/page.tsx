import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, DraftingCompass, HardHat, Phone, Ruler, Wrench } from "lucide-react";
import JsonLd from "@/components/json-ld";
import LeadMagnetForm from "@/components/lead-magnet-form";
import { StorePageBody, StorePageHero } from "@/components/store-content-layout";
import { absoluteUrl } from "@/lib/site";
import { buildWebPageJsonLd } from "@/lib/structured-data/webpage";

const PATH = "/stavebni-pripravenost";
const DESCRIPTION =
  "Technický průvodce stavební připraveností pro vrata a stínění: rozměry, nejčastější chyby, časová osa realizace a servisní postup.";

export const metadata: Metadata = {
  title: "Stavební připravenost | QAPI",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    title: "Stavební připravenost | QAPI",
    description: DESCRIPTION,
    url: PATH,
  },
};

export default function StavebniPripravenostPage() {
  const pageJsonLd = buildWebPageJsonLd({
    name: "Stavební připravenost | QAPI",
    description: DESCRIPTION,
    path: PATH,
    breadcrumbs: [
      { name: "Domů", path: "/" },
      { name: "Stavební připravenost", path: PATH },
    ],
  });

  return (
    <>
      <JsonLd data={pageJsonLd} />
      <StorePageHero
        breadcrumbLabel="Stavební připravenost"
        eyebrow="Technický průvodce"
        title="Stavební připravenost a průběh realizace"
        lead="Jasný přehled kroků, rozměrů a častých chyb před objednávkou vrat nebo stínění. Cíl: méně nejistoty a rychlejší rozhodnutí."
      />
      <StorePageBody className="space-y-10">
        <section className="rounded-2xl border border-black/[0.08] bg-card p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Jak to celé funguje</p>
          <ol className="mt-3 space-y-3 text-sm text-black/75">
            <li>1) Konfigurace a odeslání objednávky na webu (bez okamžité platby tlačítkem).</li>
            <li>2) Ověření rozměrů a parametrů s technikem (obvykle do 24 hodin v pracovní dny).</li>
            <li>3) Potvrzení nabídky a zadání do výroby (typicky v řádu týdnů podle produktu).</li>
            <li>4) Doručení a montáž, případně podklady pro montáž svépomocí.</li>
          </ol>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-black/[0.08] bg-card p-5 shadow-sm">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Ruler className="h-4 w-4" strokeWidth={1.8} />
              Venkovní stínění
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/75">
              <li>Počítejte s místem pro kastlík, vodicí lišty a napájení.</li>
              <li>Uveďte šířku a výšku čistého montážního otvoru v mm.</li>
              <li>Nerovnosti ostění nebo zateplení napište do poznámky.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-black/[0.08] bg-card p-5 shadow-sm">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <HardHat className="h-4 w-4" strokeWidth={1.8} />
              Garážová vrata
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/75">
              <li>Zkontrolujte nadpraží, boční prostor a dostupnost napájení.</li>
              <li>Uveďte orientační rozměr otvoru (šířka/výška), finál potvrdí technik.</li>
              <li>Myslete na prostor pro pohon a bezpečné nouzové ovládání.</li>
            </ul>
          </article>
        </section>

        <section className="rounded-2xl border border-black/[0.08] bg-card p-5 shadow-sm sm:p-6">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <DraftingCompass className="h-4 w-4" strokeWidth={1.8} />
            5 nejčastějších chyb před objednávkou
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/75">
            <li>Měření od omítky místo od čistého montážního otvoru.</li>
            <li>Chybějící informace o zateplení, parapetu nebo překážkách.</li>
            <li>Podcenění požadavků na napájení a ovládání.</li>
            <li>Volba varianty bez kontroly reálného uživatelského scénáře.</li>
            <li>Odeslání bez konzultace, i když jsou rozměry hraniční.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-[#fffdf6] p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Checklist zdarma do e-mailu</p>
          <p className="mt-2 text-sm leading-relaxed text-black/75">
            Než objednáte, pošleme vám stručný checklist „5 chyb při zaměřování“, který můžete rovnou sdílet i se
            stavbou nebo projektantem.
          </p>
          <div className="mt-4">
            <LeadMagnetForm source="stavebni-pripravenost" />
          </div>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/8 to-transparent p-6 sm:p-8">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <Wrench className="h-4 w-4" strokeWidth={1.8} />
            Servis a reklamace bez nejistoty
          </p>
          <p className="mt-2 text-sm leading-relaxed text-black/75">
            Když se po montáži objeví problém, řešíme ho přes servisní proces a průběžnou komunikaci se zákazníkem.
            Cílem je rychlé posouzení a termín nápravy bez přehazování odpovědnosti.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/kontakt?konzultace=1"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-foreground"
            >
              <Phone className="h-4 w-4" />
              Konzultace zdarma
            </Link>
            <Link
              href="/#kategorie"
              className="inline-flex items-center gap-2 rounded-xl border border-black/[0.12] bg-card px-4 py-2.5 text-sm font-semibold text-foreground/90 transition hover:border-primary/30"
            >
              <CheckCircle2 className="h-4 w-4" />
              Přejít do konfigurátoru
            </Link>
          </div>
        </section>
      </StorePageBody>
    </>
  );
}
