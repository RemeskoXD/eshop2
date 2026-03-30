import type { ReferenceItem } from "@/data/references";
import { absoluteUrl } from "@/lib/site";
import { buildWebPageJsonLd } from "@/lib/structured-data/webpage";

function referenceImageRef(src: string) {
  return src.startsWith("http") ? src : absoluteUrl(src);
}

/** JSON-LD pro /reference: drobečky a při neprázdných datech ItemList realizací. */
export function buildReferencePageJsonLd(items: ReferenceItem[], pagePath: string) {
  const pageUrl = absoluteUrl(pagePath);
  const description =
    "Vybrané realizace vrat a stínění od QAPI — ukázky z praxe s orientační lokalitou.";

  const graph: object[] = [
    ...buildWebPageJsonLd({
      name: "Reference | QAPI",
      description,
      path: pagePath,
      breadcrumbs: [
        { name: "Domů", path: "/" },
        { name: "Reference", path: pagePath },
      ],
    })["@graph"],
  ];

  if (items.length > 0) {
    graph.push({
      "@type": "ItemList",
      name: "Reference realizací QAPI",
      description,
      url: pageUrl,
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => {
        const descParts = [item.subtitle, item.location, item.quote].filter(Boolean);
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            "@id": `${pageUrl}#${item.id}`,
            name: item.title,
            description: descParts.join(" — "),
            image: referenceImageRef(item.image),
          },
        };
      }),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
