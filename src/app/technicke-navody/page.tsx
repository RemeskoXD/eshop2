import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText, ChevronRight } from "lucide-react";
import JsonLd from "@/components/json-ld";
import { StorePageBody, StorePageHero } from "@/components/store-content-layout";
import { absoluteUrl } from "@/lib/site";
import { buildWebPageJsonLd } from "@/lib/structured-data/webpage";

const PATH = "/technicke-navody";
const DESCRIPTION =
  "Technické návody k vratům a stínění: stavební připravenost, srovnání variant a praktické postupy před objednávkou.";

export const metadata: Metadata = {
  title: "Technické návody | QAPI",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    title: "Technické návody | QAPI",
    description: DESCRIPTION,
    url: PATH,
  },
};

const guides = [
  {
    href: "/technicke-navody/kastlik-pro-zaluzie",
    title: "Jak velký kastlík nechat pro venkovní žaluzie",
    lead: "Praktické minimum pro stavební připravenost, aby montáž neblokoval detail ve fasádě.",
  },
  {
    href: "/technicke-navody/screen-vs-klasicka-roleta",
    title: "Screenová vs klasická roleta",
    lead: "Rozdíly v průhledu, stínění, odolnosti a vhodném použití pro různé typy objektů.",
  },
  {
    href: "/technicke-navody/nouzove-otevreni-vrat-pri-vypadku-proudu",
    title: "Co dělat při výpadku proudu u vrat",
    lead: "Návod k nouzovému otevření, co mít připravené a kdy volat servis.",
  },
];

export default function TechnickeNavodyPage() {
  const jsonLd = buildWebPageJsonLd({
    name: "Technické návody | QAPI",
    description: DESCRIPTION,
    path: PATH,
    breadcrumbs: [
      { name: "Domů", path: "/" },
      { name: "Technické návody", path: PATH },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <StorePageHero
        breadcrumbLabel="Technické návody"
        eyebrow="Edukace a praxe"
        title="Technické návody před objednávkou"
        lead="Přehled klíčových témat, které zákazník řeší před finálním rozhodnutím. Každý návod končí jasným CTA do konfigurátoru."
      />
      <StorePageBody className="space-y-8">
        <section className="rounded-2xl border border-black/[0.08] bg-card p-5 shadow-sm sm:p-6">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <BookOpenText className="h-4 w-4" />
            Doporučené čtení
          </p>
          <div className="mt-3 grid gap-3">
            {guides.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="rounded-xl border border-black/[0.08] bg-white px-4 py-3 transition hover:border-primary/30"
              >
                <p className="font-semibold text-foreground">{g.title}</p>
                <p className="mt-1 text-sm text-black/65">{g.lead}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Otevřít návod <ChevronRight className="h-4 w-4" />
                </p>
              </Link>
            ))}
          </div>
        </section>
      </StorePageBody>
    </>
  );
}
