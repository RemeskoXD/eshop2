import { describe, expect, it, vi } from "vitest";
import { buildBreadcrumbList } from "@/lib/structured-data/breadcrumb";

describe("buildBreadcrumbList", () => {
  it("staví položky s absolutními URL podle NEXT_PUBLIC_SITE_URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
    const list = buildBreadcrumbList([
      { name: "Domů", path: "/" },
      { name: "Kontakt", path: "/kontakt" },
    ]);
    expect(list).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Domů", item: "https://example.test/" },
        { "@type": "ListItem", position: 2, name: "Kontakt", item: "https://example.test/kontakt" },
      ],
    });
    vi.unstubAllEnvs();
  });
});
