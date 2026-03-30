import { absoluteUrl } from "@/lib/site";
import { buildBreadcrumbList, type BreadcrumbItem } from "@/lib/structured-data/breadcrumb";

type BuildWebPageJsonLdInput = {
  name: string;
  description: string;
  path: string;
  breadcrumbs?: BreadcrumbItem[];
};

export type WebPageJsonLdGraph = {
  "@context": "https://schema.org";
  "@graph": object[];
};

/** Obecné WebPage JSON-LD; volitelně doplní BreadcrumbList do @graph. */
export function buildWebPageJsonLd({
  name,
  description,
  path,
  breadcrumbs = [],
}: BuildWebPageJsonLdInput): WebPageJsonLdGraph {
  const graph: object[] = [];
  if (breadcrumbs.length) {
    graph.push(buildBreadcrumbList(breadcrumbs));
  }

  graph.push({
    "@type": "WebPage",
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: "cs-CZ",
    isPartOf: { "@type": "WebSite", "@id": `${absoluteUrl("/")}#website` },
  });

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
