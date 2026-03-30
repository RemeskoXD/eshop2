import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/json-ld";
import { StorePageBody, StorePageHero } from "@/components/store-content-layout";
import { absoluteUrl } from "@/lib/site";
import { buildWebPageJsonLd } from "@/lib/structured-data/webpage";

const PATH = "/technicke-navody/kastlik-pro-zaluzie";
const DESCRIPTION =
  "Kolik místa nechat pro kastlík venkovních žaluzií a na co myslet při stavební připravenosti fasády.";

export const metadata: Metadata = {
  title: "Kastlík pro žaluzie: stavební minimum | QAPI",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    title: "Kastlík pro žaluzie: stavební minimum | QAPI",
    description: DESCRIPTION,
    url: PATH,
  },
};

export default function KastlikProZaluziePage() {
  const jsonLd = buildWebPageJsonLd({
    name: "Kastlík pro žaluzie: stavební minimum | QAPI",
    description: DESCRIPTION,
    path: PATH,
    breadcrumbs: [
      { name: "Domů", path: "/" },
      { name: "Technické návody", path: "/technicke-navody" },
      { name: "Kastlík pro žaluzie", path: PATH },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <StorePageHero
        breadcrumbLabel="Technické návody"
        eyebrow="Stavební připravenost"
        title="Jak velký kastlík nechat pro venkovní žaluzie"
        lead="Základní orientační pravidla před objednávkou. Přesné řešení vždy potvrzujeme podle konkrétního systému a zaměření."
      />
      <StorePageBody className="space-y-8">
        <section className="rounded-2xl border border-black/[0.08] bg-card p-5 text-sm leading-relaxed text-black/75 shadow-sm">
          <p>
            Pro bezproblémovou montáž je klíčové počítat s místem na kastlík, vodicí lišty a přívod napájení. U novostaveb
            doporučujeme řešit tento detail už ve fázi projektu fasády.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Nechte rezervu nejen na kastlík, ale i servisní přístup.</li>
            <li>Počítejte s napájením motoru (ideálně připravený vývod).</li>
            <li>U zateplení ověřte tloušťku a návaznost detailu na ostění.</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm shadow-sm">
          <p className="font-semibold text-foreground">Nejste si jistí? Pošlete fotku otvoru a hrubé rozměry.</p>
          <p className="mt-1 text-black/70">
            Technik ověří vhodnou variantu ještě před výrobou, aby nevznikly vícenáklady na stavbě.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/kategorie/venkovni-stineni" className="rounded-xl bg-accent px-4 py-2.5 font-semibold text-white hover:bg-foreground">
              Konfigurovat stínění
            </Link>
            <Link href="/kontakt?konzultace=1" className="rounded-xl border border-black/[0.12] bg-white px-4 py-2.5 font-semibold text-foreground/85 hover:border-primary/30">
              Konzultace zdarma
            </Link>
          </div>
        </section>
      </StorePageBody>
    </>
  );
}
