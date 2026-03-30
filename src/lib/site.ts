import { categoryDetailHref, productDetailHref } from "@/lib/storefront-paths";

/** Kanonická veřejná URL webu (bez koncové lomítka). */
export function getSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || "https://qapi.cz").trim().replace(/\/$/, "");
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** Absolutní URL detailu produktu (cesta přes `productDetailHref`, jeden zdroj pro OG / JSON-LD). */
export function absoluteProductUrl(productSlug: string): string {
  return absoluteUrl(productDetailHref(productSlug));
}

/** Absolutní URL stránky kategorie. */
export function absoluteCategoryUrl(categorySlug: string): string {
  return absoluteUrl(categoryDetailHref(categorySlug));
}

/** Etická „kapacita“ / termíny — jen pokud je v .env vyplněné (homepage, konfigurátor). */
export function getCapacityHint(): string | null {
  const t = (process.env.NEXT_PUBLIC_CAPACITY_HINT || "").trim();
  return t.length ? t : null;
}
