import { describe, expect, it, vi } from "vitest";
import { buildWebPageJsonLd } from "@/lib/structured-data/webpage";

describe("buildWebPageJsonLd", () => {
  it("builds WebPage graph including optional breadcrumbs", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
    const data = buildWebPageJsonLd({
      name: "Kontakt | QAPI",
      description: "Kontaktni informace.",
      path: "/kontakt",
      breadcrumbs: [
        { name: "Domu", path: "/" },
        { name: "Kontakt", path: "/kontakt" },
      ],
    });

    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { position: 1, item: "https://example.test/" },
            { position: 2, item: "https://example.test/kontakt" },
          ],
        },
        {
          "@type": "WebPage",
          name: "Kontakt | QAPI",
          url: "https://example.test/kontakt",
          isPartOf: { "@type": "WebSite", "@id": "https://example.test/#website" },
        },
      ],
    });
    vi.unstubAllEnvs();
  });
});
