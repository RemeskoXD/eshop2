import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/json-ld";
import { LegalLayout } from "@/components/legal-layout";
import { absoluteUrl } from "@/lib/site";
import { buildWebPageJsonLd } from "@/lib/structured-data/webpage";

const PATH = "/cookies";
const DESCRIPTION = "Jak používáme cookies a podobné technologie na webu QAPI.";

export const metadata: Metadata = {
  title: "Zásady cookies | QAPI",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    title: "Zásady cookies | QAPI",
    description: "Přehled cookies a měření návštěvnosti na qapi.cz.",
    url: PATH,
  },
};

export default function CookiesPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          name: "Zásady cookies | QAPI",
          description: DESCRIPTION,
          path: PATH,
          breadcrumbs: [
            { name: "Domů", path: "/" },
            { name: "Zásady cookies", path: PATH },
          ],
        })}
      />
      <LegalLayout
        title="Zásady používání cookies"
        lead="Stručný přehled pro návštěvníky webu a e-shopu."
      >
        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">1. Co jsou cookies</h2>
        <p>
          Cookies jsou malé soubory ukládané do prohlížeče. Pomáhají webu zapamatovat si základní nastavení
          nebo měřit návštěvnost.
        </p>
        </section>

        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">2. Jaké cookies používáme</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Nezbytné / funkční</strong> — např. uložení souhlasu s cookies, košík (localStorage), základní
            běh e-shopu.
          </li>
          <li>
            <strong>Analytické (volitelné)</strong> — pokud budete měřit návštěvnost nástrojem třetí strany,
            doplňte zde konkrétní název a účel.
          </li>
        </ul>
        </section>

        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">3. Správce a nastavení</h2>
        <p>
          Souhlas můžete kdykoli změnit přes lištu cookies na webu, případně v nastavení prohlížeče smazáním
          cookies.
        </p>
        <p>
          Více o zpracování osobních údajů najdete v dokumentu{" "}
          <Link href="/ochrana-osobnich-udaju" className="font-medium text-primary hover:underline">
            Ochrana osobních údajů
          </Link>
          .
        </p>
        </section>
      </LegalLayout>
    </>
  );
}
