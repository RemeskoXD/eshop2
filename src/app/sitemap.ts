import type { MetadataRoute } from "next";
import { fallbackCategories } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/site";
import { SHOP_CATEGORY_LINKS } from "@/lib/shop-nav";
import { DEPOSIT_PRODUCT_HREF, productDetailHref } from "@/lib/storefront-paths";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const staticPaths = [
    "",
    "/kontakt",
    "/o-nas",
    "/reference",
    "/stavebni-pripravenost",
    "/technicke-navody",
    "/technicke-navody/kastlik-pro-zaluzie",
    "/technicke-navody/screen-vs-klasicka-roleta",
    "/technicke-navody/nouzove-otevreni-vrat-pri-vypadku-proudu",
    "/jak-probiha-objednavka",
    "/obchodni-podminky",
    "/ochrana-osobnich-udaju",
    "/cookies",
    DEPOSIT_PRODUCT_HREF,
    ...SHOP_CATEGORY_LINKS.map((c) => c.href),
  ];

  const productPaths = fallbackCategories.flatMap((cat) => cat.products.map((p) => productDetailHref(p.slug)));

  const unique = Array.from(new Set([...staticPaths, ...productPaths]));

  return unique.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith("/produkty/") || path.startsWith("/kategorie/") ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path.startsWith("/kategorie/") || path === DEPOSIT_PRODUCT_HREF
          ? 0.85
          : path === "/jak-probiha-objednavka"
            ? 0.78
            : path === "/stavebni-pripravenost"
              ? 0.76
            : path.startsWith("/technicke-navody/")
              ? 0.73
            : path === "/technicke-navody"
              ? 0.75
            : path === "/reference"
              ? 0.74
              : path.startsWith("/produkty/")
                ? 0.75
                : 0.65,
  }));
}
