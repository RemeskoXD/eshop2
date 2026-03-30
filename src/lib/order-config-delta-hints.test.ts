import { describe, expect, it } from "vitest";
import { fallbackDepositProduct } from "@/lib/catalog";
import { getOptionDeltaHint, hintFromProduct, hintFromProductMap } from "@/lib/order-config-delta-hints";

describe("hintFromProduct", () => {
  it("vrací null bez definice produktu", () => {
    expect(hintFromProduct(undefined, "Barva", "RAL")).toBeNull();
  });

  it("mapuje přes hintFromProductMap", () => {
    const m = new Map([[fallbackDepositProduct.name, fallbackDepositProduct]]);
    expect(hintFromProductMap(m, fallbackDepositProduct.name, "Ovládání a doplňky", "Základní (manuál / lokální spínač)")).toBe(
      "v ceně základu (orientační)",
    );
  });
});

describe("getOptionDeltaHint", () => {
  it("vrací hint pro zálohu a Ovládání a doplňky", () => {
    const name = fallbackDepositProduct.name;
    expect(
      getOptionDeltaHint(name, "Ovládání a doplňky", "Základní (manuál / lokální spínač)"),
    ).toBe("v ceně základu (orientační)");
    const mid = getOptionDeltaHint(name, "Ovládání a doplňky", "Střední (dálkové ovládání, časovač)");
    expect(mid).toContain("orientační");
    expect(mid?.replace(/\s/g, "")).toMatch(/3500/);
  });

  it("bez produktu v fallbacku vrací null", () => {
    expect(getOptionDeltaHint("Neznámý produkt XY", "Barva", "RAL")).toBeNull();
  });
});
