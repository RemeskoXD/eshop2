import Link from "next/link";
import { Camera, ChevronRight, Headphones, Lock, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import { ConfiguratorPreviewProvider } from "@/components/configurator-preview-context";
import ProductConfigurator from "@/components/product-configurator";
import ProductArViewer from "@/components/product-ar-viewer";
import ProductHeroLive from "@/components/product-hero-live";
import ProductViewTracker from "@/components/product-view-tracker";
import type { ProductPageContent } from "@/lib/product-page-content";
import { categoryDetailHref, productDetailHref } from "@/lib/storefront-paths";

type ProductDetailLayoutProps = {
  content: ProductPageContent;
  currentCategory: { slug: string; title: string } | null;
  relatedProducts: Array<{ slug: string; name: string }>;
  /** Výchozí: „Pokračovat ve výběru“ — u zálohy např. širší nabídka napříč kategoriemi */
  relatedSectionEyebrow?: string;
  relatedSectionLead?: string | null;
};

export default function ProductDetailLayout({
  content,
  currentCategory,
  relatedProducts,
  relatedSectionEyebrow = "Pokračovat ve výběru",
  relatedSectionLead = null,
}: ProductDetailLayoutProps) {
  return (
    <>
      <div className="border-b border-black/[0.06] bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
          <nav className="flex flex-wrap items-center gap-1 text-sm text-black/50">
            <Link href="/" className="hover:text-primary">
              Domů
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0 opacity-40" aria-hidden />
            <Link href="/#kategorie" className="hover:text-primary">
              Sortiment
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0 opacity-40" aria-hidden />
            <span className="line-clamp-1 font-medium text-foreground/85">{content.title}</span>
          </nav>
        </div>
      </div>
      <ConfiguratorPreviewProvider>
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          <ProductViewTracker productId={content.slug} productName={content.title} />
          <article className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Produkt</p>
            <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.5rem]">
              {content.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-black/75 sm:text-lg">{content.body}</p>
            <div className="mt-6 rounded-2xl border border-primary/25 bg-gradient-to-br from-[#fffdf8] to-[#f8f4e8] p-5 text-sm shadow-sm">
              <p className="font-semibold text-foreground">{content.sections.whyThisProductTitle}</p>
              <p className="mt-2 leading-relaxed text-black/75">{content.sections.whyThisProductBody}</p>
            </div>
            <div className="rounded-2xl border border-black/[0.08] bg-white p-4 text-sm shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Cenová transparentnost</p>
              <p className="mt-2 leading-relaxed text-black/75">
                <strong>Orientační cena</strong> slouží pro rychlou představu. <strong>Finální cena</strong> vzniká až po
                zaměření technikem, kdy ověříme rozměry, montážní podmínky a konkrétní variantu produktu.
              </p>
            </div>
            <section className="rounded-2xl border border-black/[0.06] bg-card p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Specifikace</p>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                {content.specs.map((item) => (
                  <div key={item.label}>
                    <dt className="text-black/50">{item.label}</dt>
                    <dd className="font-semibold text-foreground">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <ProductHeroLive heroImage={content.media.heroImage} title={content.title} fields={content.configuratorFields} />
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Lock, text: "Důvěrné zpracování údajů" },
                { icon: Headphones, text: "Podpora po telefonu" },
                { icon: ShieldCheck, text: "Transparentní proces" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-start gap-2.5 rounded-xl border border-black/[0.06] bg-card px-3 py-3 text-xs font-medium leading-snug text-black/75"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
                  {text}
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-black/8 bg-card p-4 sm:p-5">
              <ProductArViewer
                productSlug={content.slug}
                productName={content.title}
                glbUrl={content.arAssets.glbUrl}
                usdzUrl={content.arAssets.usdzUrl}
              />
            </div>
            <section className="ui-surface mt-6 rounded-2xl p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Proč zvážit tuto variantu</p>
              <h2 className="font-heading mt-2 text-2xl font-semibold text-primary sm:text-3xl">
                Uvidíte řešení dřív, než začne realizace
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-black/70 sm:text-base">
                3D/AR náhled pomáhá rychleji rozhodnout správnou variantu, sladit vzhled s prostorem a předejít nejasnostem
                před zaměřením technika.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: Camera,
                    title: "Reálný kontext",
                    text: "Zobrazíte produkt přímo v prostoru přes kameru mobilu.",
                  },
                  {
                    icon: Sparkles,
                    title: "Jistější výběr",
                    text: "Snáz porovnáte varianty a vyberete vhodné řešení.",
                  },
                  {
                    icon: Smartphone,
                    title: "Mobilní použití",
                    text: "Funguje na iOS i Android telefonech s podporou AR.",
                  },
                ].map(({ icon: Icon, title, text }) => (
                  <article key={title} className="rounded-xl border border-black/10 bg-white p-4">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                    </span>
                    <h3 className="mt-2 text-sm font-semibold text-primary">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-black/65">{text}</p>
                  </article>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm font-semibold text-foreground">Postup po objednávce</p>
                <ol className="mt-2 space-y-1.5 text-xs leading-relaxed text-black/70 sm:text-sm">
                  {content.sections.processSteps.map((step, i) => (
                    <li key={step}>
                      {i + 1}) {step}
                    </li>
                  ))}
                </ol>
              </div>
            </section>
            <section className="rounded-2xl border border-black/[0.08] bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Časté dotazy</p>
              <div className="mt-3 space-y-2">
                {content.faq.map((item) => (
                  <details
                    key={item.q}
                    className="rounded-xl border border-black/10 bg-card px-4 py-3 text-sm open:shadow-sm"
                  >
                    <summary className="cursor-pointer list-none font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                      {item.q}
                    </summary>
                    <p className="mt-2 leading-relaxed text-black/70">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-black/[0.08] bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{relatedSectionEyebrow}</p>
              {relatedSectionLead ? (
                <p className="mt-2 text-sm leading-relaxed text-black/65">{relatedSectionLead}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/#kategorie"
                  className="ui-motion rounded-full border border-black/10 bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground/80 hover:border-primary/30 hover:text-primary"
                >
                  Všechny kategorie
                </Link>
                {currentCategory ? (
                  <Link
                    href={categoryDetailHref(currentCategory.slug)}
                    className="ui-motion rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15"
                  >
                    Zpět do {currentCategory.title}
                  </Link>
                ) : null}
              </div>
              {relatedProducts.length > 0 ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {relatedProducts.map((item) => (
                    <Link
                      key={item.slug}
                      href={productDetailHref(item.slug)}
                      className="ui-motion rounded-xl border border-black/10 bg-card px-3 py-2.5 text-sm font-medium text-foreground/80 hover:border-primary/30 hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </section>
          </article>

          <div className="space-y-4">
            <div className="rounded-2xl border border-black/8 bg-gradient-to-br from-[#f7fafc] to-white p-4 text-sm text-black/70">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Shrnutí před objednávkou</p>
              <p className="mt-2">Vyplňte konfiguraci vpravo. Finální cenu potvrzujeme po zaměření technikem.</p>
            </div>
            <ProductConfigurator
              productId={content.slug}
              productName={content.title}
              unitPrice={content.pricing.basePriceAmount}
              fields={content.configuratorFields}
            />
          </div>
        </div>
      </ConfiguratorPreviewProvider>
    </>
  );
}
