import { describe, expect, it } from "vitest";
import { DEPOSIT_PRODUCT_SLUG, fallbackCategories, getCrossSellProductsExcludingSlug } from "@/lib/catalog";

describe("getCrossSellProductsExcludingSlug", () => {
  it("omits excluded slug and deduplicates across categories", () => {
    const list = getCrossSellProductsExcludingSlug(fallbackCategories, DEPOSIT_PRODUCT_SLUG, 10);
    expect(list.every((p) => p.slug !== DEPOSIT_PRODUCT_SLUG)).toBe(true);
    const slugs = list.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("respects limit", () => {
    const list = getCrossSellProductsExcludingSlug(fallbackCategories, "garazova-vrata", 2);
    expect(list.length).toBeLessThanOrEqual(2);
    expect(list.every((p) => p.slug !== "garazova-vrata")).toBe(true);
  });
});
