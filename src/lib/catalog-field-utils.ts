/** Řádky z tabulky ProductConfigOption (výběr pro mapování konfigurátoru). */
export type CatalogOptionRow = {
  fieldId: string;
  value: string;
  sortOrder: number;
  priceDeltaCzk: number | null;
};

export function optionsListForField(fieldId: string, optionRows: CatalogOptionRow[]): string[] {
  return optionRows
    .filter((o) => o.fieldId === fieldId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((o) => o.value);
}

export function optionPriceDeltasForField(
  fieldId: string,
  optionRows: CatalogOptionRow[],
): Record<string, number> | undefined {
  const deltas: Record<string, number> = {};
  for (const o of optionRows) {
    if (o.fieldId !== fieldId) continue;
    if (o.priceDeltaCzk != null) deltas[o.value] = o.priceDeltaCzk;
  }
  return Object.keys(deltas).length ? deltas : undefined;
}
