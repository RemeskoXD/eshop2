import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import ProductDetailLayout from "@/components/product-detail-layout";
import {
  DEPOSIT_PRODUCT_SLUG,
  fallbackDepositProduct,
  getCatalogCategories,
  getCrossSellProductsExcludingSlug,
  getProductBySlug,
} from "@/lib/catalog";
import { buildProductPageContent } from "@/lib/product-page-content";
import { absoluteProductUrl, absoluteUrl } from "@/lib/site";
import { buildProductJsonLd } from "@/lib/structured-data/product";

export async function generateMetadata(): Promise<Metadata> {
  const product =
    (await getProductBySlug(fallbackDepositProduct.slug)) ?? {
      ...fallbackDepositProduct,
      basePriceAmount: 5000,
    };
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

export default async function DepositProductPage() {
  const [product, categories] = await Promise.all([
    getProductBySlug(fallbackDepositProduct.slug),
    getCatalogCategories(),
  ]);
  const resolved = product ?? { ...fallbackDepositProduct, basePriceAmount: 5000 };

  const content = buildProductPageContent(resolved);
  const currentCategory = categories.find((category) => category.products.some((item) => item.slug === content.slug));
  const relatedProducts = getCrossSellProductsExcludingSlug(categories, DEPOSIT_PRODUCT_SLUG, 6);

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
        relatedSectionEyebrow="Konkrétní produkty ze sortimentu"
        relatedSectionLead="Typové konfigurace napříč vraty a stíněním — stejný postup jako u zálohy, jen s přesnějším výchozím produktem."
      />
    </main>
  );
}
