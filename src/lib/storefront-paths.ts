/** Veřejné cesty storefrontu — bez závislosti na DB/Prisma (klient i server). */

export const DEPOSIT_PRODUCT_SLUG = "zaloha-na-zakazku" as const;

export const DEPOSIT_PRODUCT_HREF = `/produkty/${DEPOSIT_PRODUCT_SLUG}` as const;

export function productDetailHref(productSlug: string): string {
  return `/produkty/${productSlug}`;
}

export function categoryDetailHref(categorySlug: string): string {
  return `/kategorie/${categorySlug}`;
}
