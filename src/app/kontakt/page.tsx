import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Globe, Mail, Phone, SwatchBook } from "lucide-react";
import JsonLd from "@/components/json-ld";
import { StoreCardGrid, StoreInfoCard, StorePageBody, StorePageHero } from "@/components/store-content-layout";
import { getPublicContactInfo } from "@/lib/contact";
import { absoluteUrl } from "@/lib/site";
import { buildWebPageJsonLd } from "@/lib/structured-data/webpage";
import { DEPOSIT_PRODUCT_HREF } from "@/lib/storefront-paths";

const KONTAKT_PATH = "/kontakt";
const DESCRIPTION =
  "Objednávky, technické dotazy a domluva termínu u QAPI — e-mail, telefon a provozovna. Vrata a stínění na míru.";

export const metadata: Metadata = {
  title: "Kontakt | QAPI",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(KONTAKT_PATH) },
  openGraph: {
    title: "Kontakt | QAPI",
    description: "Spojte se s námi — objednávky, dotazy k produktům a rezervace technika.",
    url: KONTAKT_PATH,
  },
};

type KontaktPageProps = {
  searchParams: Promise<{ vzornik?: string; konzultace?: string; produkt?: string }>;
};

export default async function KontaktPage({ searchParams }: KontaktPageProps) {
  const { vzornik, konzultace, produkt: produktRaw } = await searchParams;
  const showVzornik = vzornik === "1";
  const showConsultation = konzultace === "1";
  const produktName = produktRaw ? decodeURIComponent(produktRaw.trim()) : "";
  const contact = getPublicContactInfo();
  const vzornikSubject = produktName
    ? `Poptávka vzorníku – ${produktName}`
    : "Poptávka vzorníku – QAPI";
  const vzornikBody = [
    "Dobrý den,",
    "",
    "mám zájem o zaslání vzorků lamel / vzorníku.",
    produktName ? `Produkt z webu: ${produktName}` : "",
    "",
    "Kontakt:",
    "Jméno: ",
    "Telefon / e-mail: ",
    "Doručovací adresa: ",
    "",
    "Děkuji",
  ]
    .filter(Boolean)
    .join("\n");
  const vzornikMailto = `mailto:${contact.email}?subject=${encodeURIComponent(vzornikSubject)}&body=${encodeURIComponent(vzornikBody)}`;
  const consultationSubject = produktName
    ? `Konzultace zdarma – ${produktName}`
    : "Konzultace zdarma – QAPI";
  const consultationBody = [
    "Dobrý den,",
    "",
    "mám zájem o nezávaznou telefonickou konzultaci k výběru řešení.",
    produktName ? `Produkt: ${produktName}` : "",
    "",
    "Preferovaný čas hovoru:",
    "Telefon:",
    "",
    "Děkuji",
  ]
    .filter(Boolean)
    .join("\n");
  const consultationMailto = `mailto:${contact.email}?subject=${encodeURIComponent(consultationSubject)}&body=${encodeURIComponent(consultationBody)}`;

  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          name: "Kontakt | QAPI",
          description: DESCRIPTION,
          path: KONTAKT_PATH,
          breadcrumbs: [
            { name: "Domů", path: "/" },
            { name: "Kontakt", path: KONTAKT_PATH },
          ],
        })}
      />
      <StorePageHero
        breadcrumbLabel="Kontakt"
        eyebrow="Kontakt"
        title="Spojte se s námi"
        lead="Objednávky, technické dotazy i domluva termínu — ozvěte se e-mailem nebo telefonem. Údaje níže upravte podle reálné provozovny."
      />
      <StorePageBody>
        {showVzornik ? (
          <div className="mx-auto mb-10 max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br from-[#fffdf8] to-[#f8f4e8] p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <SwatchBook className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-lg font-semibold text-primary">Vzorník zdarma</p>
                <p className="mt-2 text-sm leading-relaxed text-black/75">
                  Pošlete nám e-mail s doručovací adresou — domluvíme vzorky lamel (katalog / RAL dle typu produktu).
                  {produktName ? (
                    <>
                      {" "}
                      Odkazovali jste se na produkt <strong className="text-foreground">{produktName}</strong>.
                    </>
                  ) : null}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={vzornikMailto}
                    className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-foreground"
                  >
                    Otevřít e-mail s šablonou
                  </a>
                  <a
                    href={contact.phoneHref}
                    className="inline-flex items-center justify-center rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary/30 hover:text-primary"
                  >
                    Raději zavolat
                  </a>
                </div>
                <p className="mt-3 text-xs text-black/55">Nebo napište na {contact.email} a do předmětu uveďte „Vzorník“.</p>
              </div>
            </div>
          </div>
        ) : null}
        {showConsultation ? (
          <div className="mx-auto mb-10 max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br from-[#fffdf8] to-[#f8f4e8] p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-lg font-semibold text-primary">Konzultace zdarma</p>
                <p className="mt-2 text-sm leading-relaxed text-black/75">
                  Potřebujete se rozhodnout mezi variantami? Ozvěte se, projdeme rozměry, ovládání i montážní podmínky.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={contact.phoneHref}
                    className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-foreground"
                  >
                    Zavolat technikovi
                  </a>
                  <a
                    href={consultationMailto}
                    className="inline-flex items-center justify-center rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary/30 hover:text-primary"
                  >
                    Poslat poptávku e-mailem
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <StoreCardGrid>
          <StoreInfoCard title="Objednávky">
            <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 font-medium text-primary hover:underline">
              <Mail className="h-4 w-4" strokeWidth={1.75} />
              {contact.email}
            </a>
          </StoreInfoCard>
          <StoreInfoCard title="Telefon">
            <a href={contact.phoneHref} className="inline-flex items-center gap-2 font-medium text-primary hover:underline">
              <Phone className="h-4 w-4" strokeWidth={1.75} />
              {contact.phoneRaw}
            </a>
          </StoreInfoCard>
          <StoreInfoCard title="Fakturační údaje (vzor)">
            <div className="flex gap-3">
              <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
              <div>
                QAPI s.r.o.
                <br />
                IČO: 12345678
                <br />
                DIČ: CZ12345678
              </div>
            </div>
            <p className="mt-3 text-xs text-black/55">Před ostrým provozem nahraďte údaje skutečnými údaji firmy.</p>
          </StoreInfoCard>
          <StoreInfoCard title="Působnost">
            <div className="flex gap-3">
              <Globe className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
              <span>Montáž a realizace po celé České republice.</span>
            </div>
          </StoreInfoCard>
        </StoreCardGrid>
        <p className="mt-10 text-center text-sm text-black/60">
          Rychlá cesta k objednávce:{" "}
          <Link href={DEPOSIT_PRODUCT_HREF} className="font-semibold text-primary hover:underline">
            záloha na zakázku
          </Link>{" "}
          nebo{" "}
          <Link href="/#kategorie" className="font-semibold text-primary hover:underline">
            výběr v sortimentu
          </Link>
          .
        </p>
      </StorePageBody>
    </>
  );
}
