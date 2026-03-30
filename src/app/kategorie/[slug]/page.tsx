import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, LayoutGrid } from "lucide-react";
import CatalogInlineGrid from "@/components/catalog-inline-grid";
import JsonLd from "@/components/json-ld";
import { fallbackCategories, getCategoryBySlug } from "@/lib/catalog";
import { absoluteCategoryUrl, absoluteProductUrl, absoluteUrl } from "@/lib/site";
import { categoryDetailHref, DEPOSIT_PRODUCT_HREF } from "@/lib/storefront-paths";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return fallbackCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return {
      title: "Kategorie nenalezena | QAPI",
      robots: { index: false, follow: false },
    };
  }

  const title = `${category.title} | QAPI`;
  const description = `${category.description} Vyberte vhodný produkt, porovnejte varianty a využijte rychlý náhled.`;
  const url = absoluteUrl(`/kategorie/${category.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: category.title,
          description: category.description,
          url: absoluteCategoryUrl(category.slug),
          mainEntity: {
            "@type": "ItemList",
            itemListElement: category.products.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteProductUrl(item.slug),
              name: item.name,
            })),
          },
        }}
      />
      <div className="border-b border-black/[0.06] bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
          <nav className="flex flex-wrap items-center gap-1 text-sm text-black/55">
            <Link href="/" className="transition hover:text-primary">
              Domů
            </Link>
            <ChevronRight className="h-4 w-4 opacity-50" />
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <LayoutGrid className="h-4 w-4 text-primary" strokeWidth={1.75} />
              {category.title}
            </span>
          </nav>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Kategorie</p>
          <h1 className="font-heading mt-2 text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
            {category.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-black/70 sm:text-lg">{category.description}</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
        <div className="mb-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/8 to-transparent p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Nevíte co vybrat?</p>
          <p className="mt-1 text-sm text-foreground/85">
            Zkuste rychlé volby podle vašeho cíle. Pomůžou vám najít vhodný produkt během pár sekund.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              {
                label: "Chci nejrychlejší orientaci",
                href: categoryDetailHref(category.slug),
              },
              {
                label: "Chci řešení s 3D/AR",
                href: `${categoryDetailHref(category.slug)}?with3d=1`,
              },
              {
                label: "Chci nejdostupnější variantu",
                href: `${categoryDetailHref(category.slug)}?sort=price-asc`,
              },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="ui-motion rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm hover:border-primary/30 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { label: "Doporučené", href: categoryDetailHref(category.slug) },
            { label: "Jen s 3D/AR", href: `${categoryDetailHref(category.slug)}?with3d=1` },
            { label: "Nejlevnější", href: `${categoryDetailHref(category.slug)}?sort=price-asc` },
            { label: "A-Z", href: `${categoryDetailHref(category.slug)}?sort=name-asc` },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="ui-motion rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm hover:border-primary/30 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <p className="mb-5 text-sm text-black/60">
          V seznamu můžete využít <strong>rychlý náhled</strong> přímo u řádku produktu (bez vyskakovacího okna).
        </p>
        <CatalogInlineGrid products={category.products} syncWithUrl />

        <div className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-6 sm:flex sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-foreground/90">
            Potřebujete nejdřív rezervovat technika? Použijte produkt zálohy.
          </p>
          <Link
            href={DEPOSIT_PRODUCT_HREF}
            className="mt-4 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-foreground sm:mt-0"
          >
            Záloha na zakázku
          </Link>
        </div>
      </div>
    </main>
  );
}
