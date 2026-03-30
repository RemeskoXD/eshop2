import { absoluteProductUrl, absoluteUrl } from "@/lib/site";

type ProductForSchema = {
  slug: string;
  name: string;
  description: string;
  image: string;
  basePriceAmount?: number | null;
};

export function buildProductJsonLd(product: ProductForSchema): object {
  const url = absoluteProductUrl(product.slug);
  const imageUrl = product.image.startsWith("http") ? product.image : absoluteUrl(product.image);

  const offers: Record<string, unknown> = {
    "@type": "Offer",
    priceCurrency: "CZK",
    availability: "https://schema.org/MadeToOrder",
    url,
    seller: { "@type": "Organization", name: "QAPI" },
  };

  const amount = product.basePriceAmount;
  if (typeof amount === "number" && Number.isFinite(amount) && amount > 0) {
    offers.price = amount;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [imageUrl],
    sku: product.slug,
    brand: { "@type": "Brand", name: "QAPI" },
    offers,
  };
}
