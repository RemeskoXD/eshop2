import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/json-ld";
import ProductDetailLayout from "@/components/product-detail-layout";
import {
  DEPOSIT_PRODUCT_SLUG,
  getCatalogCategories,
  getCrossSellProductsExcludingSlug,
  getProductBySlug,
} from "@/lib/catalog";
import { buildProductPageContent } from "@/lib/product-page-content";
import { absoluteProductUrl, absoluteUrl } from "@/lib/site";
import { buildProductJsonLd } from "@/lib/structured-data/product";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  /** Záloha má dedikovanou route; ostatní slugy řeší SSG/ISR dle nasazení. */
  return [];
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      title: "Produkt nenalezen | QAPI",
      robots: { index: false, follow: false },
    };
  }

  const content = buildProductPageContent(product);
  const title = `${content.title} | QAPI`;
  const description = content.body.slice(0, 155);
  const url = absoluteProductUrl(content.slug);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: absoluteUrl(content.media.heroImage) }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, categories] = await Promise.all([getProductBySlug(slug), getCatalogCategories()]);

  if (!product) notFound();

  const content = buildProductPageContent(product);
  const currentCategory = categories.find((category) => category.products.some((item) => item.slug === content.slug));
  const relatedProducts =
    content.slug === DEPOSIT_PRODUCT_SLUG
      ? getCrossSellProductsExcludingSlug(categories, DEPOSIT_PRODUCT_SLUG, 6)
      : currentCategory
        ? currentCategory.products.filter((item) => item.slug !== content.slug).slice(0, 3)
        : [];

  return (
    <main className="bg-background">
      <JsonLd
        data={buildProductJsonLd({
          slug: content.slug,
          name: content.title,
          description: content.body,
          image: content.media.heroImage,
          basePriceAmount: content.pricing.basePriceAmount,
        })}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Domů",
              item: absoluteUrl("/"),
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Sortiment",
              item: absoluteUrl("/#kategorie"),
            },
            {
              "@type": "ListItem",
              position: 3,
              name: content.title,
              item: absoluteProductUrl(content.slug),
            },
          ],
        }}
      />
      <ProductDetailLayout
        content={content}
        currentCategory={currentCategory ?? null}
        relatedProducts={relatedProducts}
        relatedSectionEyebrow={
          content.slug === DEPOSIT_PRODUCT_SLUG ? "Konkrétní produkty ze sortimentu" : undefined
        }
        relatedSectionLead={
          content.slug === DEPOSIT_PRODUCT_SLUG
            ? "Typové konfigurace napříč vraty a stíněním — stejný postup jako u zálohy, jen s přesnějším výchozím produktem."
            : null
        }
      />
    </main>
  );
}
