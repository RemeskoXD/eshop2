import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  BadgeCheck,
  CheckCircle2,
  Headphones,
  MoveRight,
  Sparkles,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import CatalogInlineGrid from "@/components/catalog-inline-grid";
import JsonLd from "@/components/json-ld";
import ReviewsProof from "@/components/reviews-proof";
import SectionHeader from "@/components/ui/section-header";
import { getCatalogCategories } from "@/lib/catalog";
import { SHOP_CATEGORY_LINKS } from "@/lib/shop-nav";
import { absoluteUrl, getCapacityHint } from "@/lib/site";
import { buildWebPageJsonLd } from "@/lib/structured-data/webpage";
import { categoryDetailHref, DEPOSIT_PRODUCT_HREF } from "@/lib/storefront-paths";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    url: "/",
  },
};

const HOME_DESCRIPTION =
  "Zakázková vrata a stínění na míru. Přehledná konfigurace, orientační ceny, 3D/AR náhled a zaměření technikem.";

export default async function Home() {
  const categories = await getCatalogCategories();
  const capacityHint = getCapacityHint();

  return (
    <main className="text-foreground">
      <JsonLd
        data={buildWebPageJsonLd({
          name: "QAPI e-shop | Vrata a stínění na míru",
          description: HOME_DESCRIPTION,
          path: "/",
        })}
      />
      <section className="relative overflow-hidden bg-gradient-to-b from-card via-surface-soft/40 to-background">
        <div className="pointer-events-none absolute -right-36 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-20">
          <div className="order-2 flex flex-col justify-center lg:order-1">
            <p className="ui-eyebrow mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              Premium řešení na míru
            </p>
            <h1 className="ui-display">
              Zakázková vrata a stínění na míru. Rychlý výběr, jistý výsledek.
            </h1>
            <p className="ui-body-lg mt-6 max-w-xl">
              Vyberete kategorii, uvidíte orientační ceny a možnosti 3D/AR. Finální řešení i cenu potvrdíme po zaměření
              technikem — bez skrytých poplatků.
            </p>
            <div className="mt-6 grid max-w-xl gap-2 text-sm text-foreground/85">
              {[
                { icon: BadgeCheck, title: "Zaměření technikem", sub: "potvrdí kompatibilitu, termín i finální cenu." },
                { icon: Award, title: "Orientační ceny hned", sub: "finální nacenění po zaměření na místě." },
                { icon: Sparkles, title: "3D/AR náhled", sub: "u vybraných produktů si je uvidíte přímo doma." },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-start gap-3 rounded-xl border border-black/[0.06] bg-card px-3 py-2.5">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.9} />
                  </span>
                  <div className="leading-snug">
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="mt-0.5 text-xs text-foreground/65">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a
                href="#kategorie"
                className="ui-motion inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-center text-sm font-semibold text-white shadow-md hover:bg-foreground"
              >
                Vybrat kategorii
                <MoveRight className="h-4 w-4" />
              </a>
              <Link
                href={DEPOSIT_PRODUCT_HREF}
                className="ui-motion inline-flex items-center justify-center rounded-xl border-2 border-primary/40 bg-card px-6 py-3.5 text-center text-sm font-semibold text-primary hover:bg-primary/5"
              >
                Rezervovat zaměření
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <Link href="/jak-probiha-objednavka" className="ui-motion font-semibold text-primary hover:underline">
                Jak probíhá objednávka
              </Link>
              <span className="hidden text-foreground/30 sm:inline" aria-hidden>
                ·
              </span>
              <Link href="/kontakt" className="ui-motion font-semibold text-primary hover:underline">
                Potřebujete poradit? Konzultace se specialistou
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium">
              {SHOP_CATEGORY_LINKS.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="ui-motion rounded-full border border-black/[0.1] bg-white px-3 py-1.5 text-foreground/85 hover:border-primary/30 hover:text-primary"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="ui-surface-strong relative overflow-hidden rounded-2xl">
              <Image
                src="/IMAGE/baner_top_3_telefon_do_2mb.webp"
                alt="Ukázka stínění a vrat QAPI"
                width={960}
                height={720}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="aspect-[4/3] w-full object-cover sm:aspect-auto sm:min-h-[22rem]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-[#0f1f2d]/70 p-3 text-white backdrop-blur-sm sm:p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">QAPI standard</p>
                <p className="mt-1 text-sm font-semibold sm:text-base">Transparentní postup od poptávky po montáž</p>
                <p className="mt-1 text-xs text-white/80 sm:text-sm">Nejprve zaměření, poté finální potvrzení řešení a termínu.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-6 pt-2 sm:px-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-primary/25 bg-gradient-to-r from-[#fffdf8] to-[#f8f4e8] p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="min-w-0 flex-1 space-y-2">
            <p className="ui-body font-medium">
              Plánujeme termíny zaměření — rezervujte s předstihem a mějte jistotu data návštěvy technika. Kapacity
              montáží koordinujeme podle vytížení týmů; konkrétní termín vám nabídneme po kontaktu (bez umělých
              slevových odpočtů).
            </p>
            {capacityHint ? (
              <p className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary">
                {capacityHint}
              </p>
            ) : null}
          </div>
          <Link
            href={DEPOSIT_PRODUCT_HREF}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-foreground"
          >
            Rezervovat termín
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-8">
        <div className="grid gap-6 rounded-2xl border border-secondary/15 bg-gradient-to-r from-[#121d2a] via-[#16283a] to-[#1b2f44] p-6 text-white shadow-[0_14px_44px_rgba(15,26,38,0.24)] sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
              <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.9} />
              Oficiální partner Shadeon
            </p>
            <h2 className="font-heading mt-3 text-2xl font-semibold sm:text-3xl">
              Oficiální partner prémiových systémů stínění
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">
              Navrhujeme řešení inspirovaná moderním standardem Shadeon: čistý design, přesná technika, komfortní
              ovládání a profesionální realizace od zaměření po montáž.
            </p>
            <div className="mt-5 grid gap-2.5 text-sm text-white/85 sm:grid-cols-2">
              {[
                "Doporučení vhodného řešení po zaměření",
                "Esteticky čisté a dlouhodobě funkční provedení",
                "Profesionální montážní postupy",
                "Jasná komunikace termínů i rozsahu",
              ].map((item) => (
                <p key={item} className="rounded-lg border border-white/12 bg-white/[0.05] px-3 py-2">
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:justify-center lg:pl-4">
            <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Důvěryhodné partnerství</p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Partnerství se Shadeon je pro zákazníka jistota moderního standardu řešení, servisovatelnosti a
                dlouhodobé kvality.
              </p>
            </div>
            <a
              href="https://shadeon.eu/"
              target="_blank"
              rel="noreferrer"
              className="ui-motion inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-white/95"
            >
              Více o Shadeon
            </a>
            <Link
              href="/kontakt"
              className="ui-motion inline-flex items-center justify-center rounded-xl border border-white/35 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Domluvit konzultaci
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-8">
        <SectionHeader
          eyebrow="Orientace v sortimentu"
          title="Vyberte směr během pár sekund"
          description="Pro malý katalog je nejrychlejší orientace přes 3 hlavní cesty. Vyberte oblast a hned uvidíte relevantní produkty."
        />
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Vrata",
              description: "Sekční a zakázková řešení pro domy i komerční objekty.",
              link: SHOP_CATEGORY_LINKS[0],
            },
            {
              title: "Venkovní stínění",
              description: "Rolety, žaluzie a pergolové systémy pro tepelný komfort.",
              link: SHOP_CATEGORY_LINKS[1],
            },
            {
              title: "Interiérové stínění",
              description: "Designové a funkční stínění pro moderní interiéry.",
              link: SHOP_CATEGORY_LINKS[2],
            },
          ].map((item) => (
            <Link
              key={item.link.href}
              href={item.link.href}
              className="ui-surface ui-motion ui-hover-lift group rounded-2xl p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Hlavní cesta</p>
                <h3 className="font-heading mt-2 text-2xl font-semibold text-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/65">{item.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:gap-3">
                Otevřít kategorii
                <MoveRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-8">
        <div className="grid gap-6 rounded-2xl border border-black/[0.06] bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:grid-cols-3 sm:p-8">
          {[
            {
              icon: Award,
              title: "12+ let",
              sub: "zkušeností v oboru",
            },
            {
              icon: Wrench,
              title: "1000+ realizací",
              sub: "po celé České republice",
            },
            {
              icon: Headphones,
              title: "Individuální přístup",
              sub: "zaměření a nacenění od technika",
            },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <Icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-heading text-xl font-semibold text-primary">{title}</p>
                <p className="mt-1 text-sm text-black/65">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-8">
        <ReviewsProof />
      </section>

      <section id="kategorie" className="border-t border-black/[0.06] bg-strip py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
          <SectionHeader
            title="Sortiment podle kategorií"
            description="Začněte výběrem hlavní oblasti. U každé kategorie hned uvidíte relevantní produkty i rychlý vstup do detailu."
          />
          <div className="mt-7 flex flex-wrap gap-2">
            {categories.map((group) => (
              <a
                key={`jump-${group.slug}`}
                href={`#kat-${group.slug}`}
                className="ui-motion rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm hover:border-primary/30 hover:text-primary"
              >
                {group.title}
              </a>
            ))}
          </div>
          <div className="mt-12 space-y-14">
            {categories.map((group) => (
              <div
                id={`kat-${group.slug}`}
                key={group.slug}
                className="scroll-mt-36 rounded-2xl border border-black/[0.06] bg-white/70 p-4 shadow-[0_8px_24px_rgba(20,33,47,0.05)] sm:p-6"
              >
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/80">Kategorie</p>
                    <h3 className="font-heading mt-1 text-2xl font-semibold text-primary sm:text-3xl">{group.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm text-black/65">{group.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {group.products.length} produktů
                    </span>
                    <Link
                      href={categoryDetailHref(group.slug)}
                      className="ui-motion inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2"
                    >
                      Celá kategorie
                      <MoveRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <CatalogInlineGrid products={group.products} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="produkt-zaloha" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8">
        <div className="overflow-hidden rounded-2xl border border-primary/30 bg-card shadow-[0_12px_48px_rgba(0,0,0,0.06)]">
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Top produkt</p>
              <h2 className="font-heading mt-2 text-2xl font-semibold sm:text-3xl">
                Záloha na zakázku — vrata / venkovní stínění
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-black/75">
                Rezervace termínu technika. Pokud realizace nebude technicky možná, zálohu vracíme v plné výši.
              </p>
              <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Cena", "5 000 – 10 000 Kč"],
                  ["Sklad", "Na zakázku"],
                  ["DPH", "Účtujeme"],
                  ["Doprava", "Řešíme individuálně"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-black/[0.06] bg-muted/50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-black/45">{k}</p>
                    <p className="mt-1 font-semibold text-foreground">{v}</p>
                  </div>
                ))}
              </div>
              <Link
                href={DEPOSIT_PRODUCT_HREF}
                className="mt-8 inline-flex rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-foreground"
              >
                Otevřít konfigurátor zálohy
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#141414] text-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Ověřená jistota</p>
              <h2 className="font-heading mt-2 text-3xl font-semibold sm:text-4xl">Realizace, které dávají jistotu</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                Od prvního kontaktu po finální montáž držíme transparentní proces. Díky tomu zákazník ví, co se děje
                v každém kroku a jaký bude další postup.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["1000+", "realizací po ČR"],
                  ["12+ let", "praxe v oboru"],
                  ["4.9 / 5", "spokojenost klientů"],
                ].map(([value, label]) => (
                  <div key={value} className="rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3">
                    <p className="font-heading text-2xl font-semibold text-white">{value}</p>
                    <p className="text-xs font-medium text-white/70">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Link
                  href="/reference"
                  className="ui-motion inline-flex items-center gap-2 text-sm font-semibold text-white hover:gap-3"
                >
                  Prohlédnout reference
                  <MoveRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Proces ve 4 krocích</p>
              <div className="mt-4 space-y-3">
                {[
                  {
                    icon: Headphones,
                    title: "1) Konzultace",
                    sub: "Upřesníme potřebu a vhodný typ řešení.",
                  },
                  {
                    icon: Wrench,
                    title: "2) Zaměření",
                    sub: "Technik ověří rozměry a technické možnosti.",
                  },
                  {
                    icon: CheckCircle2,
                    title: "3) Potvrzení nabídky",
                    sub: "Dostanete finální cenu i harmonogram realizace.",
                  },
                  {
                    icon: Truck,
                    title: "4) Montáž a servis",
                    sub: "Dodání, instalace a následná podpora.",
                  },
                ].map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                      <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/75">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8">
        <h2 className="font-heading text-3xl font-semibold sm:text-4xl">Co říkají zákazníci</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              who: "Jana, Brno",
              text: "Oceňuji jasné kroky objednávky. Věděla jsem přesně, co bude následovat.",
            },
            {
              who: "Petr, Praha",
              text: "Technik poradil nejlepší řešení a finální montáž proběhla bez problémů.",
            },
            {
              who: "Lucie, Olomouc",
              text: "Skvělá komunikace, férové nacenění a kvalitní provedení.",
            },
          ].map(({ who, text }) => (
            <article
              key={who}
              className="flex flex-col rounded-2xl border border-black/[0.06] bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
            >
              <div className="flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary/25" strokeWidth={1.5} />
                ))}
              </div>
              <p className="mt-4 text-sm font-medium text-black/50">{who}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-black/80">&quot;{text}&quot;</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-8">
        <h2 className="font-heading text-3xl font-semibold sm:text-4xl">Časté dotazy</h2>
        <div className="mt-8 space-y-3">
          {[
            {
              q: "Kdy platím finální cenu?",
              a: "Nejprve rezervujete termín technika. Po zaměření a ověření možností dostanete finální nacenění.",
            },
            {
              q: "Co když zakázka nepůjde technicky realizovat?",
              a: "V případě technické nerealizovatelnosti vracíme zálohu v plné výši.",
            },
            {
              q: "Jak dlouho trvá celý proces?",
              a: "Záleží na typu produktu a kapacitě výroby. Přesný harmonogram potvrzujeme po zaměření.",
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl border border-black/[0.06] bg-card px-5 py-4 shadow-sm open:shadow-md"
            >
              <summary className="cursor-pointer list-none font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                {q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-black/70">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-8">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-8 text-white shadow-xl sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Další krok bez nejistoty</p>
          <h2 className="font-heading mt-3 text-2xl font-semibold sm:text-4xl">
            Nejprve konzultace. Poté přesný návrh i finální cena.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-white/90">
            Začněte jednou jasnou akcí. Projdeme s vámi zadání, doporučíme řešení a navážeme zaměřením technika.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-white/85">
            {["1) Konzultace", "2) Zaměření", "3) Potvrzení nabídky", "4) Montáž"].map((step) => (
              <span key={step} className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5">
                {step}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/kontakt"
              className="ui-motion inline-flex justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-white/95"
            >
              Začít konzultací
            </Link>
            <Link
              href={DEPOSIT_PRODUCT_HREF}
              className="ui-motion inline-flex justify-center rounded-xl border-2 border-white/80 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Rezervace termínu technika
            </Link>
          </div>
          <p className="mt-3 text-xs text-white/75">Pokud realizace nebude technicky možná, zálohu vracíme v plné výši.</p>
        </div>
      </section>
    </main>
  );
}
