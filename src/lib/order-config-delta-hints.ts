import { cache } from "react";
import type { ProductDefinition } from "@/lib/catalog";
import { fallbackCategories, fallbackDepositProduct, getCatalogCategories } from "@/lib/catalog";

const fallbackProductsByName = buildFallbackProductMap();

function buildFallbackProductMap(): Map<string, ProductDefinition> {
  const m = new Map<string, ProductDefinition>();
  for (const cat of fallbackCategories) {
    for (const p of cat.products) {
      m.set(p.name, p);
    }
  }
  m.set(fallbackDepositProduct.name, fallbackDepositProduct);
  return m;
}

function formatOptionDeltaHint(d: number): string {
  if (d === 0) return "v ceně základu (orientační)";
  return `+${d.toLocaleString("cs-CZ")} Kč (orientační)`;
}

export function hintFromProduct(
  product: ProductDefinition | undefined,
  label: string,
  optionValue: string,
): string | null {
  if (!product) return null;
  const field = product.config.find((f) => f.label === label && f.type === "select");
  if (!field?.optionPriceDeltasCzk) return null;
  const d = field.optionPriceDeltasCzk[optionValue];
  if (d === undefined) return null;
  return formatOptionDeltaHint(d);
}

export function hintFromProductMap(
  productsByName: Map<string, ProductDefinition>,
  itemName: string,
  label: string,
  optionValue: string,
): string | null {
  return hintFromProduct(productsByName.get(itemName), label, optionValue);
}

/**
 * Mapa produktů podle přesného názvu (jako v košíku). Preferuje katalog z databáze;
 * záloha ze samostatného fallbacku se doplní jen pokud v katalogu chybí.
 * `cache` — jedno načtení katalogu na HTTP požadavek (admin detail, apod.).
 */
export const loadProductsByNameMap = cache(async (): Promise<Map<string, ProductDefinition>> => {
  const m = new Map<string, ProductDefinition>();
  try {
    const categories = await getCatalogCategories();
    for (const cat of categories) {
      for (const p of cat.products) {
        if (!m.has(p.name)) m.set(p.name, p);
      }
    }
  } catch {
    return new Map(fallbackProductsByName);
  }
  if (!m.has(fallbackDepositProduct.name)) {
    m.set(fallbackDepositProduct.name, fallbackDepositProduct);
  }
  return m;
});

/**
 * Orientační text příplatku — pouze fallback katalog v kódu (pro testy a rychlé použití bez DB).
 */
export function getOptionDeltaHint(itemName: string, label: string, optionValue: string): string | null {
  return hintFromProductMap(fallbackProductsByName, itemName, label, optionValue);
}
