import type { ProductConfigField } from "@/lib/catalog";

export function isColorField(field: ProductConfigField): boolean {
  const v = `${field.label} ${field.placeholder ?? ""}`.toLowerCase();
  return (
    field.type === "select" &&
    (v.includes("barva") || v.includes("odstín") || v.includes("odstin") || v.includes("color"))
  );
}

export function resolveColorSwatch(value: string): string | null {
  const v = value.toLowerCase();
  if (v.includes("antracit") || v.includes("anthracite") || v.includes("ral 7016")) return "#2F343A";
  if (v.includes("bíl") || v.includes("bil") || v.includes("white")) return "#F5F3EE";
  if (v.includes("čern") || v.includes("cern") || v.includes("black")) return "#101010";
  if (v.includes("hněd") || v.includes("hned") || v.includes("brown")) return "#5A3C2C";
  if (v.includes("šed") || v.includes("sed") || v.includes("grey") || v.includes("gray")) return "#9BA3AE";
  if (v.includes("béž") || v.includes("bez") || v.includes("beige") || v.includes("krém") || v.includes("krem"))
    return "#E8DCC8";
  if (v.includes("stříbr") || v.includes("stribr") || v.includes("silver")) return "#C8CCD0";
  if (v.includes("zlat") || v.includes("gold")) return "#C5A572";
  if (v.includes("modr") || v.includes("blue")) return "#3B5BA8";
  if (v.includes("zelen") || v.includes("green")) return "#3D6B4A";
  if (v.includes("červen") || v.includes("cerven") || v.includes("red")) return "#9B3A3A";
  if (v === "ral" || v.includes("standard")) return "#B8B4AE";
  return null;
}
