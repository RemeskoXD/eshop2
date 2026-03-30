import { absoluteUrl } from "@/lib/site";

export type BreadcrumbItem = { name: string; path: string };

/** Schema.org BreadcrumbList — cesty musí být vzhledem ke kořenu webu (např. `/kontakt`). */
export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
