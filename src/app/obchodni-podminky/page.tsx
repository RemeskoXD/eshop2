import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { LegalLayout } from "@/components/legal-layout";
import { absoluteUrl } from "@/lib/site";
import { buildWebPageJsonLd } from "@/lib/structured-data/webpage";

const PATH = "/obchodni-podminky";
const DESCRIPTION = "Obchodní podmínky pro nákup zboží a služeb na míru v e-shopu QAPI.";

export const metadata: Metadata = {
  title: "Obchodní podmínky | QAPI",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    title: "Obchodní podmínky | QAPI",
    description: "VOP pro zakázková vrata a stínění včetně záloh a zaměření.",
    url: PATH,
  },
};

export default function ObchodniPodminkyPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          name: "Obchodní podmínky | QAPI",
          description: DESCRIPTION,
          path: PATH,
          breadcrumbs: [
            { name: "Domů", path: "/" },
            { name: "Obchodní podmínky", path: PATH },
          ],
        })}
      />
      <LegalLayout
        title="Obchodní podmínky"
        lead="Poslední aktualizace: březen 2026. Verze pro zakázková řešení (vrata, stínění) včetně záloh."
      >
        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">1. Základní ustanovení</h2>
        <p>
          Tyto obchodní podmínky upravují vztah mezi společností QAPI (dále jen „prodávající“) a zákazníkem
          (dále jen „kupující“) při objednávání zboží a služeb prostřednictvím e-shopu na doméně qapi.cz.
        </p>
        <p>
          E-shop primárně nabízí <strong>zakázková řešení na míru</strong>. U takových produktů je konečná
          cena a technická realizace potvrzena po zaměření a odsouhlasení nabídky.
        </p>
        </section>

        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">2. Objednávka a uzavření smlouvy</h2>
        <p>
          Objednávka vzniká odesláním objednávkového formuláře. Prodávající potvrdí přijetí objednávky
          (např. e-mailem) a následně domluví další kroky (záloha, zaměření, finální nabídka).
        </p>
        <p>
          Uvedené ceny v konfigurátoru mají <strong>orientační charakter</strong>, pokud není výslovně uvedeno
          jinak. Závazná je až nabídka po technickém posouzení.
        </p>
        </section>

        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">3. Záloha a rezervace termínu</h2>
        <p>
          U produktů typu „záloha na zakázku“ slouží úhrada k <strong>rezervaci kapacity technika</strong> a
          zahájení přípravy. Pokud nebude zakázka z objektivních důvodů realizovatelná, záloha je vrácena v plné
          výši, pokud se strany nedohodnou jinak.
        </p>
        </section>

        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">4. Platební podmínky</h2>
        <p>
          Standardní forma úhrady je <strong>bankovní převod</strong> na účet prodávajícího. Platební údaje
          obdržíte v potvrzení objednávky nebo v následné komunikaci.
        </p>
        </section>

        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">5. Dodání a montáž</h2>
        <p>
          Termíny dodání a montáže jsou dohodnuty individuálně. U zakázkové výroby se mohou odchylky řídit
          dostupností materiálu a výrobním plánem — o případných změnách vás budeme informovat.
        </p>
        </section>

        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">6. Reklamace a záruka</h2>
        <p>
          Reklamace se řídí platnými právními předpisy ČR. Záruční doba a podmínky budou uvedeny v dodacím
          listu / záručním listu u konkrétního produktu.
        </p>
        </section>

        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">7. Odstoupení od smlouvy (zboží na míru)</h2>
        <p>
          U zboží vyrobeného <strong>na míru podle požadavků zákazníka</strong> může být odstoupení od smlouvy
          omezeno (dle občanského zákoníku). Přesné vymezení vám doplní právník podle vašeho procesu
          (zaměření, výroba, závazná objednávka výroby).
        </p>
        </section>

        <section className="space-y-3">
        <h2 className="text-lg font-semibold text-black">8. Závěrečná ustanovení</h2>
        <p>
          Spory lze řešit smírně, případně u příslušných soudů České republiky. Tyto podmínky mohou být
          aktualizovány; aktuální verze je vždy zveřejněna na webu.
        </p>
        </section>
      </LegalLayout>
    </>
  );
}
