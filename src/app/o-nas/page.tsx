import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target, Users } from "lucide-react";
import JsonLd from "@/components/json-ld";
import { StoreInfoCard, StorePageBody, StorePageHero } from "@/components/store-content-layout";
import { absoluteUrl } from "@/lib/site";
import { buildWebPageJsonLd } from "@/lib/structured-data/webpage";

const ONAS_PATH = "/o-nas";
const DESCRIPTION =
  "QAPI — specializace na zakázková vrata a stínění, přehledný nákupní proces, technik na místě a férová komunikace.";

export const metadata: Metadata = {
  title: "O nás | QAPI",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(ONAS_PATH) },
  openGraph: {
    title: "O nás | QAPI",
    description: "Vrata a stínění na míru s důrazem na kvalitu, montáž a lidský přístup.",
    url: ONAS_PATH,
  },
};

export default function ONasPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          name: "O nás | QAPI",
          description: DESCRIPTION,
          path: ONAS_PATH,
          breadcrumbs: [
            { name: "Domů", path: "/" },
            { name: "O nás", path: ONAS_PATH },
          ],
        })}
      />
      <StorePageHero
        breadcrumbLabel="O nás"
        eyebrow="QAPI"
        title="O nás"
        lead="Specializujeme se na vrata a stínění na míru — kvalitní provedení, profesionální montáž a individuální přístup. Stránku můžete doplnit o váš příběh, tým a certifikace."
      />
      <StorePageBody>
        <div className="grid gap-8 lg:grid-cols-2">
          <StoreInfoCard title="Naše zaměření">
            <p>
              Pomáháme zákazníkům orientovat se v nabídce vrat a stínění bez zbytečného žargonu. Od online konfigurace
              přes zálohu až po zaměření technikem a finální realizaci.
            </p>
          </StoreInfoCard>
          <StoreInfoCard title="Proč QAPI">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <Target className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
                <span>Přehledný e-shop a jasný postup objednávky.</span>
              </li>
              <li className="flex gap-3">
                <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
                <span>Lidská komunikace a technik přímo u vás.</span>
              </li>
            </ul>
          </StoreInfoCard>
        </div>
        <div className="mt-10 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 to-transparent p-8 sm:p-10">
          <p className="font-heading text-xl font-semibold text-primary">Chcete začít?</p>
          <p className="mt-2 max-w-xl text-sm text-black/70">
            Prohlédněte si sortiment nebo si rezervujte termín technika u produktu zálohy.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/#kategorie"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-foreground"
            >
              Sortiment
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center rounded-xl border-2 border-primary/35 bg-card px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </StorePageBody>
    </>
  );
}
