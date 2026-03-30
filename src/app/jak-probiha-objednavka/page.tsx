import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Package, PenLine, Phone, Truck, Wallet } from "lucide-react";
import JsonLd from "@/components/json-ld";
import { StorePageBody, StorePageHero } from "@/components/store-content-layout";
import { getMeasurementVideoEmbedSrcFromEnv } from "@/lib/measurement-video";
import { getSiteUrl } from "@/lib/site";
import { buildWebPageJsonLd } from "@/lib/structured-data/webpage";

const PAGE_DESCRIPTION =
  "Kroky od konfigurace v e-shopu přes kontakt technika, zálohu a zaměření až po výrobu a montáž vrat a stínění na míru.";

const PAGE_OG_DESCRIPTION =
  "Přehledný proces: objednávka bez platby v košíku, technik do 24 hodin, záloha až po domluvě, pak zaměření a realizace.";

const PAGE_PATH = "/jak-probiha-objednavka";

export const metadata: Metadata = {
  title: "Jak probíhá objednávka | QAPI",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${getSiteUrl()}${PAGE_PATH}` },
  openGraph: {
    title: "Jak probíhá objednávka | QAPI",
    description: PAGE_OG_DESCRIPTION,
    url: PAGE_PATH,
  },
};

const steps: { text: string; icon: typeof Package }[] = [
  { text: "Výběr produktu, konfigurace a odeslání objednávky (bez okamžité platby v košíku)", icon: Package },
  {
    text: "Obvykle do 24 hodin (pracovní dny) vás kontaktuje technik — projdete rozměry a parametry z konfigurace",
    icon: Phone,
  },
  { text: "Zaplacení zálohy podle pokynů v potvrzení objednávky (až po domluvě s technikem)", icon: Wallet },
  { text: "Návštěva technika a přesné zaměření na místě", icon: PenLine },
  { text: "Finální nacenění, potvrzení výroby a harmonogramu", icon: Calculator },
  { text: "Výroba, montáž nebo dodání", icon: Truck },
];

/** Jednoduché technické schéma: čistý montážní otvor, šířka × výška v mm. */
function MeasurementOpeningDiagram() {
  const frame = "#5D5754";
  const ink = "#2B2B2B";
  return (
    <figure className="mx-auto max-w-xl rounded-2xl border border-black/[0.08] bg-card p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6">
      <svg
        viewBox="0 0 360 240"
        className="h-auto w-full"
        aria-labelledby="mereni-title mereni-desc"
        role="img"
      >
        <title id="mereni-title">Schéma měření montážního otvoru</title>
        <desc id="mereni-desc">
          Obdélník znázorňuje čistý otvor. Šířka se měří vodorovně mezi vnitřními hranami, výška svisle v místě
          montáže. Hodnoty zapisujte v milimetrech.
        </desc>
        {/* rámování / stěna */}
        <rect x="28" y="20" width="304" height="160" rx="6" fill="#EFEDE8" stroke={frame} strokeWidth="1.5" />
        {/* otvor */}
        <rect x="88" y="46" width="184" height="108" rx="3" fill="#F8F6F1" stroke={frame} strokeWidth="2" />
        {/* rozměrová linka — šířka */}
        <line x1="88" y1="188" x2="272" y2="188" stroke={ink} strokeWidth="1.2" strokeLinecap="round" />
        <polygon points="88,188 96,184 96,192" fill={ink} />
        <polygon points="272,188 264,184 264,192" fill={ink} />
        <text x="180" y="206" textAnchor="middle" fill={frame} fontSize="12" fontFamily="system-ui, sans-serif">
          Šířka — čistý otvor (mm)
        </text>
        {/* rozměrová linka — výška */}
        <line x1="56" y1="46" x2="56" y2="154" stroke={ink} strokeWidth="1.2" strokeLinecap="round" />
        <polygon points="56,46 52,54 60,54" fill={ink} />
        <polygon points="56,154 52,146 60,146" fill={ink} />
        <text
          x="46"
          y="118"
          textAnchor="middle"
          fill={frame}
          fontSize="12"
          fontFamily="system-ui, sans-serif"
          transform="rotate(-90 46 118)"
        >
          Výška (mm)
        </text>
        {/* poznámka u otvoru */}
        <text x="180" y="106" textAnchor="middle" fill={ink} fontSize="11" fontFamily="system-ui, sans-serif" opacity="0.75">
          měřte vnitřní rozměry
        </text>
      </svg>
      <figcaption className="mt-4 text-sm leading-relaxed text-black/70">
        <strong className="text-foreground">Co zapisovat v konfigurátoru:</strong> typicky{" "}
        <strong>nejmenší užitečný</strong> průchod otvorem (šířka) a <strong>výška v místě montáže</strong>. U atypických
        detailů technik vše ověří na místě
        — orientační hodnoty stačí pro první krok.
      </figcaption>
    </figure>
  );
}

export default function JakProbihaObjednavkaPage() {
  const measurementVideoSrc = getMeasurementVideoEmbedSrcFromEnv();
  const base = getSiteUrl();
  const pageJsonLd = buildWebPageJsonLd({
    name: "Jak probíhá objednávka | QAPI",
    description: PAGE_DESCRIPTION,
    path: PAGE_PATH,
    breadcrumbs: [
      { name: "Domů", path: "/" },
      { name: "Jak probíhá objednávka", path: PAGE_PATH },
    ],
  });
  const processJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ...pageJsonLd["@graph"],
      {
        "@type": "HowTo",
        name: "Jak probíhá objednávka u QAPI",
        description: PAGE_DESCRIPTION,
        inLanguage: "cs-CZ",
        step: steps.map((s, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: s.text,
          text: s.text,
          url: `${base}${PAGE_PATH}#krok-${index + 1}`,
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={processJsonLd} />
      <StorePageHero
        breadcrumbLabel="Jak objednat"
        eyebrow="Objednávkový proces"
        title="Jak probíhá objednávka"
        lead="Stejný příběh jako na pokladně: nejdřív domluva s technikem, záloha až podle pokynů, pak zaměření a teprve výroba."
      />
      <StorePageBody>
        <p className="mb-6 max-w-3xl rounded-2xl border border-green-200/85 bg-green-50/90 px-4 py-3 text-sm leading-relaxed text-black/75">
          <strong className="text-foreground">Důležité:</strong> odesláním objednávky v e-shopu nic neplatíte — platba
          zálohy následuje až po kontrole parametrů a podle údajů v potvrzovacím e-mailu.
        </p>
        <ol className="space-y-4">
          {steps.map(({ text, icon: Icon }, index) => (
            <li
              id={`krok-${index + 1}`}
              key={text}
              className="flex scroll-mt-24 gap-4 rounded-2xl border border-black/[0.08] bg-card p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:items-center sm:gap-5 sm:p-6"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white shadow-sm">
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-strip text-primary ring-1 ring-black/[0.06]">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="text-base font-medium leading-snug text-foreground sm:text-lg">{text}</span>
              </div>
            </li>
          ))}
        </ol>

        <section className="mt-14 max-w-3xl" aria-labelledby="mereni-heading">
          <h2 id="mereni-heading" className="font-heading text-xl font-semibold text-primary sm:text-2xl">
            Jak správně zaměřit (orientační nákres)
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-black/75 sm:text-base">
            U vrat a stínění na míru jde o stejný princip: <strong className="text-foreground">čísla v milimetrech</strong>, měřená
            na <strong className="text-foreground">čistém montážním otvoru</strong> (ne „domnělý“ vnější obrys
            domu). Nejste si jistí úplně přesným bodem měření? Nevadí —{" "}
            <Link href="/kontakt" className="font-semibold text-primary underline-offset-2 hover:underline">
              napište nebo zavolejte
            </Link>
            , technik to při návštěvě doladí.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-black/75 sm:text-base">
            <li>Měřte několikrát (nahoře/dole u šířky) a vezměte menší hodnotu, pokud se liší.</li>
            <li>Uveďte v poznámce i nerovnosti zdi nebo překážky — zjednoduší to montáž.</li>
            <li>Čím přesnější orientační údaj, tím rychlejší první nacenění — finál stejně potvrdíme po zaměření.</li>
          </ul>
          <div className="mt-8">
            <MeasurementOpeningDiagram />
          </div>

          <div className="mt-10">
            <h3 className="font-heading text-lg font-semibold text-primary sm:text-xl">Video z praxe (volitelné)</h3>
            {measurementVideoSrc ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-black/[0.08] bg-black shadow-sm">
                <div className="relative aspect-video w-full">
                  <iframe
                    src={measurementVideoSrc}
                    title="Krátké video: orientační měření montážního otvoru"
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-black/15 bg-strip/60 px-4 py-5 text-sm leading-relaxed text-black/70 sm:px-5">
                <p>
                  Krátké instruktážní video z měření{" "}
                  <strong className="text-foreground">můžeme sem doplnit kdykoli</strong> — stačí v prostředí (např.
                  Coolify) nastavit proměnnou <span className="font-mono text-xs">NEXT_PUBLIC_MEASUREMENT_VIDEO_URL</span>{" "}
                  na odkaz z YouTube nebo Vimeo.
                </p>
                <p className="mt-2">
                  Zatím využijte nákres výše, případně{" "}
                  <Link href="/kontakt" className="font-semibold text-primary underline-offset-2 hover:underline">
                    kontakt
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="mt-10 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/8 to-transparent p-6 sm:flex sm:items-center sm:justify-between sm:p-8">
          <p className="text-sm font-medium text-foreground/90">
            Máte dotaz k některému kroku? Napište nám nebo rovnou začněte konfigurací produktu.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
            <Link
              href="/kontakt"
              className="rounded-xl border border-primary/35 bg-card px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
            >
              Kontakt
            </Link>
            <Link
              href="/#kategorie"
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-foreground"
            >
              Do obchodu
            </Link>
          </div>
        </div>
      </StorePageBody>
    </>
  );
}
