import { describe, expect, it } from "vitest";
import {
  categoryDetailHref,
  DEPOSIT_PRODUCT_HREF,
  DEPOSIT_PRODUCT_SLUG,
  productDetailHref,
} from "@/lib/storefront-paths";

describe("storefront-paths", () => {
  it("keeps deposit slug and href in sync", () => {
    expect(DEPOSIT_PRODUCT_HREF).toBe(`/produkty/${DEPOSIT_PRODUCT_SLUG}`);
  });

  it("productDetailHref builds path", () => {
    expect(productDetailHref("foo")).toBe("/produkty/foo");
  });

  it("categoryDetailHref builds path", () => {
    expect(categoryDetailHref("vrata")).toBe("/kategorie/vrata");
  });
});
