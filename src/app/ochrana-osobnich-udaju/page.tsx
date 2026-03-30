import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/json-ld";
import { LegalLayout } from "@/components/legal-layout";
import { absoluteUrl } from "@/lib/site";
import { buildWebPageJsonLd } from "@/lib/structured-data/webpage";

const PATH = "/ochrana-osobnich-udaju";
const DESCRIPTION = "Informace o zpracování osobních údajů v e-shopu QAPI.";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů (GDPR) | QAPI",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    title: "Ochrana osobních údajů | QAPI",
    description: "Zásady ochrany osobních údajů pro zákazníky e-shopu.",
    url: PATH,
  },
};

export default function OchranaOsobnichUdajuPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          name: "Ochrana osobních údajů (GDPR) | QAPI",
          description: DESCRIPTION,
          path: PATH,
          breadcrumbs: [
            { name: "Domů", path: "/" },
            { name: "Ochrana osobních údajů", path: PATH },
          ],
        })}
      />
      <LegalLayout
        title="Ochrana osobních údajů"
        lead="Informace pro zákazníky dle nařízení GDPR a souvisejících předpisů."
      >
        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">1. Správce údajů</h2>
        <p>
          Správcem osobních údajů je společnost QAPI (doplňte IČ, sídlo a kontaktní údaje dle skutečnosti).
        </p>
        </section>

        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">2. Jaké údaje zpracováváme</h2>
        <p>Typicky jméno, kontaktní e-mail a telefon, fakturační a případně dodací adresa, údaje o objednávce.</p>
        </section>

        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">3. Účel a právní základ</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Plnění smlouvy</strong> — vyřízení objednávky, komunikace ohledně zaměření, výroby a montáže.
          </li>
          <li>
            <strong>Oprávněný zájem</strong> — základní analytika provozu webu, bezpečnost a prevence zneužití.
          </li>
          <li>
            <strong>Souhlas</strong> — pokud ho vyžadujeme (např. marketing), lze ho kdykoli odvolat.
          </li>
        </ul>
        </section>

        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">4. Doba uchovávání</h2>
        <p>
          Údaje uchováváme po dobu nezbytnou pro vyřízení zakázky a následně po dobu stanovenou zákonem
          (účetnictví, daně) nebo pro ochranu právních nároků.
        </p>
        </section>

        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">5. Příjemci a zpracovatelé</h2>
        <p>
          Údaje mohou zpracovávat provozovatel hostingu, poskytovatel e-mailové infrastruktury nebo nástrojů
          pro interní provoz — vždy v rozsahu nezbytném pro daný účel.
        </p>
        </section>

        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">6. Vaše práva</h2>
        <p>
          Máte právo na přístup, opravu, výmaz, omezení zpracování, přenositelnost a vznést námitku. Právo
          podat stížnost u Úřadu pro ochranu osobních údajů.
        </p>
        </section>

        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">7. Kontakt</h2>
        <p>
          Pro uplatnění práv pište na{" "}
          <Link className="font-medium text-primary hover:underline" href="mailto:objednavky@qapi.cz">
            objednavky@qapi.cz
          </Link>
          .
        </p>
        </section>
      </LegalLayout>
    </>
  );
}
