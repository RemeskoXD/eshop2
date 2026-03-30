/**
 * CSV vhodné pro Excel (CZ): oddělovač `;`, UTF-8 s BOM.
 */
function escapeCell(val: unknown): string {
  const s = val === null || val === undefined ? "" : String(val);
  if (/[;\r\n"]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCsvWithColumns<T extends Record<string, unknown>>(
  columns: Array<{ key: keyof T & string; header: string }>,
  rows: T[],
): string {
  const headerLine = columns.map((c) => escapeCell(c.header)).join(";");
  const dataLines = rows.map((row) => columns.map((c) => escapeCell(row[c.key])).join(";"));
  return `\uFEFF${[headerLine, ...dataLines].join("\r\n")}`;
}
