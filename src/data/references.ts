/**
 * Reference realizací — upravte podle skutečných projektů.
 * Obrázky: vložte do public/IMAGE/ nebo změňte cesty / použijte externí URL (pak doplňte next.config → images.remotePatterns).
 */
export type ReferenceItem = {
  id: string;
  title: string;
  /** Krátký podnadpis (typ produktu) */
  subtitle: string;
  /** Město / region (bez přesné adresy, pokud nechcete) */
  location: string;
  /** Fotografie po realizaci (hlavní) — cesta z /public nebo absolutní URL */
  image: string;
  /** Volitelně foto „před“ — zobrazí se vedle hlavního snímku s popisky Před / Po */
  imageBefore?: string;
  /** Krátký příběh / citace zákazníka (důvěra, ne prodejní řeč) */
  quote?: string;
  /** Volitelné štítky do badge */
  tags?: string[];
};

export const references: ReferenceItem[] = [
  {
    id: "ref-1",
    title: "Rodinný dům — garáž",
    subtitle: "Sekční garážová vrata",
    location: "Jihomoravský kraj",
    image: "/IMAGE/sekvencni_garazova_vrata.webp",
    quote: "Chtěli jsme sjednotit vzhled s plotem — montáž byla rychlá, odstín sedí.",
    tags: ["Vrata"],
  },
  {
    id: "ref-2",
    title: "Venkovní stínění terasy",
    subtitle: "Screenové rolety",
    location: "Praha-západ",
    image: "/IMAGE/screenove_rolety.webp",
    tags: ["Venkovní stínění"],
  },
  {
    id: "ref-3",
    title: "Obývací pokoj",
    subtitle: "Horizontální žaluzie",
    location: "Olomouc",
    image: "/IMAGE/horizontalnizaluzie.webp",
    tags: ["Interiér"],
  },
  {
    id: "ref-4",
    title: "Průmyslový areál",
    subtitle: "Průmyslová vrata",
    location: "Zlínský kraj",
    image: "/IMAGE/prumyslova-vrata.webp",
    tags: ["Vrata", "Komerční"],
  },
  {
    id: "ref-5",
    title: "Rodinný dům",
    subtitle: "Venkovní žaluzie",
    location: "Vysočina",
    image: "/IMAGE/venkovni_zaluzie.webp",
    tags: ["Venkovní stínění"],
  },
  {
    id: "ref-6",
    title: "Ložnice",
    subtitle: "Látkové žaluzie plisé",
    location: "Brno",
    image: "/IMAGE/plise_zaluzie.webp",
    tags: ["Interiér"],
  },
];
