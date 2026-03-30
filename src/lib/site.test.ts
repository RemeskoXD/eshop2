import { describe, expect, it } from "vitest";
import { absoluteCategoryUrl, absoluteProductUrl, absoluteUrl, getCapacityHint } from "@/lib/site";

describe("getCapacityHint", () => {
  it("returns null when unset", () => {
    delete process.env.NEXT_PUBLIC_CAPACITY_HINT;
    expect(getCapacityHint()).toBeNull();
  });

  it("returns trimmed text when set", () => {
    process.env.NEXT_PUBLIC_CAPACITY_HINT = "  3 volné termíny  ";
    expect(getCapacityHint()).toBe("3 volné termíny");
  });
});

describe("absoluteProductUrl", () => {
  it("uses storefront product path", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    expect(absoluteProductUrl("garazova-vrata")).toBe("https://example.com/produkty/garazova-vrata");
  });
});

describe("absoluteCategoryUrl", () => {
  it("uses storefront category path", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    expect(absoluteCategoryUrl("vrata")).toBe("https://example.com/kategorie/vrata");
  });
});

describe("absoluteUrl", () => {
  it("joins base URL with a path without leading slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/";
    expect(absoluteUrl("kontakt")).toBe("https://example.com/kontakt");
  });

  it("keeps path with leading slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    expect(absoluteUrl("/produkty/test")).toBe("https://example.com/produkty/test");
  });
});
