/**
 * Normalizace pro fulltext-like vyhledávání bez závislosti na knihovnách.
 * - odstraní diakritiku (často zdroj "nenalezeno" v CZ)
 * - převede na lower-case
 */
export function normalizeForSearch(input: string): string {
  const s = (input ?? "").toString().normalize("NFD");
  return s.replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function tokenizeForSearch(input: string): string[] {
  const norm = normalizeForSearch(input);
  return norm.split(/\s+/).filter(Boolean);
}

/**
 * Levenshteinova vzdálenost (iterativně, bez rekurze).
 * Používá se jen na malý katalog, takže performance bude v pohodě.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;

  const aLen = a.length;
  const bLen = b.length;

  const prev = new Array<number>(bLen + 1);
  const next = new Array<number>(bLen + 1);

  for (let j = 0; j <= bLen; j += 1) prev[j] = j;

  for (let i = 1; i <= aLen; i += 1) {
    next[0] = i;
    const aChar = a.charAt(i - 1);
    for (let j = 1; j <= bLen; j += 1) {
      const cost = aChar === b.charAt(j - 1) ? 0 : 1;
      next[j] = Math.min(prev[j] + 1, next[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= bLen; j += 1) prev[j] = next[j];
  }

  return prev[bLen];
}

export type SearchMatch<T> = {
  item: T;
  distance: number;
};

export function findBestTokenMatch<T>(
  queryNormalized: string,
  items: T[],
  getItemTokens: (item: T) => string[],
): SearchMatch<T> | null {
  if (!queryNormalized) return null;

  const threshold = Math.max(2, Math.floor(queryNormalized.length * 0.4));

  let best: SearchMatch<T> | null = null;

  for (const item of items) {
    const tokens = getItemTokens(item);
    let bestDistForItem = Infinity;
    for (const t of tokens) {
      if (!t) continue;
      const dist = levenshteinDistance(t, queryNormalized);
      if (dist < bestDistForItem) bestDistForItem = dist;
      if (bestDistForItem <= threshold) break;
    }

    if (bestDistForItem === Infinity) continue;
    if (!best || bestDistForItem < best.distance) {
      best = { item, distance: bestDistForItem };
    }
  }

  if (best && best.distance <= threshold) return best;
  return null;
}

