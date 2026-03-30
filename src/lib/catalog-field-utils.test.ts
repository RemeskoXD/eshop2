import { describe, expect, it } from "vitest";
import { optionPriceDeltasForField, optionsListForField } from "@/lib/catalog-field-utils";

const sample: Parameters<typeof optionsListForField>[1] = [
  { fieldId: "b", value: "second", sortOrder: 20, priceDeltaCzk: null },
  { fieldId: "a", value: "first-a", sortOrder: 10, priceDeltaCzk: null },
  { fieldId: "a", value: "second-a", sortOrder: 20, priceDeltaCzk: 100 },
  { fieldId: "a", value: "third-a", sortOrder: 5, priceDeltaCzk: null },
];

describe("optionsListForField", () => {
  it("filtruje podle fieldId a řadí podle sortOrder", () => {
    expect(optionsListForField("a", sample)).toEqual(["third-a", "first-a", "second-a"]);
    expect(optionsListForField("b", sample)).toEqual(["second"]);
  });
});

describe("optionPriceDeltasForField", () => {
  it("vrací záznamy s nenull priceDeltaCzk včetně nuly", () => {
    const rows = [
      { fieldId: "f", value: "Základ", sortOrder: 10, priceDeltaCzk: 0 },
      { fieldId: "f", value: "Střed", sortOrder: 20, priceDeltaCzk: 3500 },
      { fieldId: "f", value: "Extra", sortOrder: 30, priceDeltaCzk: null },
    ];
    expect(optionPriceDeltasForField("f", rows)).toEqual({ Základ: 0, Střed: 3500 });
  });

  it("vrací undefined když nejsou žádné delty", () => {
    expect(optionPriceDeltasForField("x", [{ fieldId: "x", value: "a", sortOrder: 1, priceDeltaCzk: null }])).toBeUndefined();
  });
});
