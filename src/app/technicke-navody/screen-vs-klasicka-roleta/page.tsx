import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/json-ld";
import { StorePageBody, StorePageHero } from "@/components/store-content-layout";
import { absoluteUrl } from "@/lib/site";
import { buildWebPageJsonLd } from "@/lib/structured-data/webpage";

const PATH = "/technicke-navody/screen-vs-klasicka-roleta";
const DESCRIPTION =
  "Praktické srovnání screenové a klasické rolety: průhled ven, tepelný komfort, údržba a vhodné použití.";

export const metadata: Metadata = {
  title: "Screen vs klasická roleta | QAPI",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    title: "Screen vs klasická roleta | QAPI",
    description: DESCRIPTION,
    url: PATH,
  },
};

export default function ScreenVsRoletaPage() {
  const jsonLd = buildWebPageJsonLd({
    name: "Screen vs klasická roleta | QAPI",
    description: DESCRIPTION,
    path: PATH,
    breadcrumbs: [
      { name: "Domů", path: "/" },
      { name: "Technické návody", path: "/technicke-navody" },
      { name: "Screen vs klasická roleta", path: PATH },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <StorePageHero
        breadcrumbLabel="Technické návody"
        eyebrow="Srovnání variant"
        title="Screenová roleta vs klasická roleta"
        lead="Krátké srovnání, které pomůže zákazníkovi vybrat správnou variantu podle světla, soukromí a provozu."
      />
      <StorePageBody className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-black/[0.08] bg-card p-5 text-sm leading-relaxed text-black/75 shadow-sm">
            <p className="font-semibold text-foreground">Screenová roleta</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Udrží výhled ven při omezení přehřívání interiéru.</li>
              <li>Vhodná pro moderní fasády a velké prosklení.</li>
              <li>Dobrá volba tam, kde je důležitý denní komfort i design.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-black/[0.08] bg-card p-5 text-sm leading-relaxed text-black/75 shadow-sm">
            <p className="font-semibold text-foreground">Klasická roleta</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Silné zatemnění a jednoduché ovládání.</li>
              <li>Vhodná do ložnic nebo místností s požadavkem na tmu.</li>
              <li>Často výhodnější varianta při základním zadání.</li>
            </ul>
          </article>
        </section>
        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm shadow-sm">
          <p className="font-semibold text-foreground">Jak se rozhodnout rychle?</p>
          <p className="mt-1 text-black/70">
            Pokud řešíte hlavně letní přehřívání a zachování denního světla, začněte screenem. Pokud potřebujete
            především zatemnění, porovnejte klasickou roletu.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/kategorie/venkovni-stineni" className="rounded-xl bg-accent px-4 py-2.5 font-semibold text-white hover:bg-foreground">
              Porovnat v konfigurátoru
            </Link>
            <Link href="/kontakt?konzultace=1" className="rounded-xl border border-black/[0.12] bg-white px-4 py-2.5 font-semibold text-foreground/85 hover:border-primary/30">
              Projít výběr s technikem
            </Link>
          </div>
        </section>
      </StorePageBody>
    </>
  );
}
