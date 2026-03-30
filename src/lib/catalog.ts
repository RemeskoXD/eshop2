import { cache } from "react";
import { optionPriceDeltasForField, optionsListForField } from "@/lib/catalog-field-utils";
import { prisma } from "@/lib/prisma";
import { DEPOSIT_PRODUCT_SLUG } from "@/lib/storefront-paths";

export { DEPOSIT_PRODUCT_SLUG };

export type ProductConfigField = {
  label: string;
  type: "select" | "number";
  options?: string[];
  placeholder?: string;
  /** Volitelné limity pro číselné pole v mm (typické u rozměrů). Z databáze lze doplnit později. */
  minMm?: number;
  maxMm?: number;
  typicalMinMm?: number;
  typicalMaxMm?: number;
  /** U selectu: zobrazí se jako „+ X Kč“ u varianty (hodnota klíče = přesný text option). */
  optionPriceDeltasCzk?: Record<string, number>;
  /**
   * U selectu: výchozí a zvýrazněná varianta (např. střední úroveň upsellu).
   * Musí přesně odpovídat jedné z hodnot v `options`.
   */
  recommendedOption?: string;
};

export type ProductDefinition = {
  slug: string;
  name: string;
  image: string;
  arModelGlbUrl?: string | null;
  arModelUsdzUrl?: string | null;
  description: string;
  basePriceText: string;
  config: ProductConfigField[];
};

export type CategoryDefinition = {
  slug: string;
  title: string;
  description: string;
  products: ProductDefinition[];
};

export const fallbackCategories: CategoryDefinition[] = [
  {
    slug: "vrata",
    title: "Vrata",
    description: "Garážová, průmyslová i speciální vrata na míru.",
    products: [
      {
        slug: "garazova-vrata",
        name: "Garážová vrata",
        image: "/IMAGE/sekvencni_garazova_vrata.webp",
        description: "Sekční a rolovací řešení s možností designu a povrchové úpravy.",
        basePriceText: "Na poptávku",
        config: [
          { label: "Varianta", type: "select", options: ["Sekční", "Rolovací"], recommendedOption: "Sekční" },
          { label: "Design", type: "select", options: ["Hladký", "Kazetový", "Lamela"], recommendedOption: "Hladký" },
          { label: "Druh povrchu", type: "select", options: ["Mat", "Lesk", "Struktura"] },
          {
            label: "Šířka (mm)",
            type: "number",
            placeholder: "např. 2500",
            minMm: 1500,
            maxMm: 8000,
            typicalMinMm: 2000,
            typicalMaxMm: 3500,
          },
          {
            label: "Výška (mm)",
            type: "number",
            placeholder: "např. 2125",
            minMm: 1800,
            maxMm: 3200,
            typicalMinMm: 2000,
            typicalMaxMm: 2800,
          },
        ],
      },
      {
        slug: "prumyslova-vrata",
        name: "Průmyslová vrata",
        image: "/IMAGE/prumyslova-vrata.webp",
        description: "Odolná vrata pro komerční a průmyslové provozy.",
        basePriceText: "Na poptávku",
        config: [
          { label: "Varianta", type: "select", options: ["Sekční", "Rychloběžná"], recommendedOption: "Sekční" },
          {
            label: "Design",
            type: "select",
            options: ["Plný panel", "Prosklený panel"],
            recommendedOption: "Plný panel",
          },
          {
            label: "Šířka (mm)",
            type: "number",
            placeholder: "např. 4000",
            minMm: 2500,
            maxMm: 12000,
            typicalMinMm: 3000,
            typicalMaxMm: 8000,
          },
          {
            label: "Výška (mm)",
            type: "number",
            placeholder: "např. 3500",
            minMm: 2200,
            maxMm: 8000,
            typicalMinMm: 2800,
            typicalMaxMm: 5000,
          },
        ],
      },
    ],
  },
  {
    slug: "venkovni-stineni",
    title: "Venkovní stínění",
    description: "Efektivní ochrana před sluncem, teplem i pohledy zvenčí.",
    products: [
      {
        slug: "venkovni-zaluzie",
        name: "Venkovní žaluzie",
        image: "/IMAGE/venkovni_zaluzie.webp",
        description: "Moderní žaluzie s plynulou regulací světla.",
        basePriceText: "Na poptávku",
        config: [
          { label: "Barva", type: "select", options: ["RAL", "Standard"], recommendedOption: "Standard" },
          {
            label: "Šířka (mm)",
            type: "number",
            placeholder: "např. 1800",
            minMm: 600,
            maxMm: 4500,
            typicalMinMm: 1000,
            typicalMaxMm: 3200,
          },
          {
            label: "Výška (mm)",
            type: "number",
            placeholder: "např. 1500",
            minMm: 600,
            maxMm: 4000,
            typicalMinMm: 1000,
            typicalMaxMm: 2800,
          },
        ],
      },
      {
        slug: "screenove-rolety",
        name: "Screenové rolety",
        image: "/IMAGE/screenove_rolety.webp",
        description: "Designové stínění s vysokou účinností a moderním vzhledem.",
        basePriceText: "Na poptávku",
        config: [
          { label: "Barva", type: "select", options: ["RAL", "Standard"], recommendedOption: "Standard" },
          { label: "Druh povrchu", type: "select", options: ["Hladký", "Textura"], recommendedOption: "Hladký" },
          {
            label: "Šířka (mm)",
            type: "number",
            placeholder: "např. 2200",
            minMm: 800,
            maxMm: 5000,
            typicalMinMm: 1200,
            typicalMaxMm: 3600,
          },
          {
            label: "Výška (mm)",
            type: "number",
            placeholder: "např. 2400",
            minMm: 800,
            maxMm: 4500,
            typicalMinMm: 1200,
            typicalMaxMm: 3200,
          },
        ],
      },
    ],
  },
  {
    slug: "interierove-stineni",
    title: "Interiérové stínění",
    description: "Žaluzie a rolety do interiéru s širokou nabídkou barev a látek.",
    products: [
      {
        slug: "horizontalni-zaluzie",
        name: "Horizontální žaluzie",
        image: "/IMAGE/horizontalnizaluzie.webp",
        description: "Klasické interiérové řešení s jednoduchým ovládáním.",
        basePriceText: "Od 1 290 Kč",
        config: [
          { label: "Barva lamel", type: "select", options: ["Bílá", "Antracit", "Stříbrná"], recommendedOption: "Bílá" },
          { label: "Barva nosníku", type: "select", options: ["Bílá", "Hnědá", "Černá"], recommendedOption: "Bílá" },
          { label: "Strana ovládání", type: "select", options: ["Levá", "Pravá"], recommendedOption: "Pravá" },
          {
            label: "Šířka (mm)",
            type: "number",
            placeholder: "např. 1200",
            minMm: 300,
            maxMm: 3000,
            typicalMinMm: 600,
            typicalMaxMm: 2200,
          },
          {
            label: "Výška (mm)",
            type: "number",
            placeholder: "např. 1400",
            minMm: 300,
            maxMm: 3200,
            typicalMinMm: 600,
            typicalMaxMm: 2500,
          },
        ],
      },
      {
        slug: "latkove-zaluzie-plise",
        name: "Látkové žaluzie plisé",
        image: "/IMAGE/plise_zaluzie.webp",
        description: "Plisé systémy s výběrem látek v cenových skupinách 1 až 5.",
        basePriceText: "Od 1 990 Kč",
        config: [
          { label: "Skupina látky", type: "select", options: ["1", "2", "3", "4", "5"], recommendedOption: "3" },
          {
            label: "Barva profilu",
            type: "select",
            options: ["Bílá", "Krémová", "Hnědá", "Stříbrná", "Antracit", "Černá"],
            recommendedOption: "Bílá",
          },
          {
            label: "Šířka (mm)",
            type: "number",
            placeholder: "např. 1000",
            minMm: 300,
            maxMm: 2800,
            typicalMinMm: 600,
            typicalMaxMm: 2000,
          },
          {
            label: "Výška (mm)",
            type: "number",
            placeholder: "např. 1200",
            minMm: 300,
            maxMm: 3000,
            typicalMinMm: 600,
            typicalMaxMm: 2400,
          },
        ],
      },
    ],
  },
];

/**
 * Pro stránku zálohy: nabídne produkty z celého katalogu (bez duplicit), aby zákazník měl rychlé odkazy
 * na konkrétní typy vrat a stínění, i když záloha v DB není zařazená v kategorii.
 */
export function getCrossSellProductsExcludingSlug(
  categories: CategoryDefinition[],
  excludeSlug: string,
  limit = 6,
): Array<{ slug: string; name: string }> {
  const seen = new Set<string>();
  const out: Array<{ slug: string; name: string }> = [];
  for (const cat of categories) {
    for (const p of cat.products) {
      if (p.slug === excludeSlug) continue;
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      out.push({ slug: p.slug, name: p.name });
      if (out.length >= limit) return out;
    }
  }
  return out;
}

export const fallbackDepositProduct: ProductDefinition = {
  slug: DEPOSIT_PRODUCT_SLUG,
  name: "Záloha na zakázku - vrata / venkovní stínění na míru",
  image: "/IMAGE/prodej_a_mont_____bez_logo.webp",
  description:
    "Záloha slouží k rezervaci termínu technika. V případě, že zakázku nebude možné technicky realizovat, je záloha vrácena v plné výši.",
  basePriceText: "5 000 - 10 000 Kč",
  config: [
    { label: "Barva", type: "select", options: ["RAL", "Standard"] },
    { label: "Varianta", type: "select", options: ["Vrata", "Venkovní stínění"] },
    { label: "Design", type: "select", options: ["Hladký", "Kazetový", "Lamela"] },
    { label: "Druh povrchu", type: "select", options: ["Mat", "Lesk", "Struktura"] },
    {
      label: "Ovládání a doplňky",
      type: "select",
      options: [
        "Základní (manuál / lokální spínač)",
        "Střední (dálkové ovládání, časovač)",
        "Prémiové (Smart Home / motor s aplikací)",
      ],
      recommendedOption: "Střední (dálkové ovládání, časovač)",
      optionPriceDeltasCzk: {
        "Základní (manuál / lokální spínač)": 0,
        "Střední (dálkové ovládání, časovač)": 3500,
        "Prémiové (Smart Home / motor s aplikací)": 8900,
      },
    },
    {
      label: "Šířka (mm)",
      type: "number",
      placeholder: "např. 2500",
      minMm: 1500,
      maxMm: 8000,
      typicalMinMm: 2000,
      typicalMaxMm: 3500,
    },
    {
      label: "Výška (mm)",
      type: "number",
      placeholder: "např. 2100",
      minMm: 1800,
      maxMm: 3200,
      typicalMinMm: 2000,
      typicalMaxMm: 2800,
    },
  ],
};

type CategoryRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  sortOrder: number;
};

type ProductRow = {
  id: string;
  categoryId: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  arModelGlbUrl: string | null;
  arModelUsdzUrl: string | null;
  basePriceText: string;
  sortOrder: number;
};

type FieldRow = {
  id: string;
  productId: string;
  label: string;
  fieldType: "select" | "number";
  placeholder: string | null;
  sortOrder: number;
  recommendedOption: string | null;
};

type OptionRow = {
  fieldId: string;
  value: string;
  sortOrder: number;
  priceDeltaCzk: number | null;
};

type ProductDetail = ProductDefinition & {
  basePriceAmount?: number | null;
};

function mapFieldRowToConfig(field: FieldRow, optionRows: OptionRow[]): ProductConfigField {
  return {
    label: field.label,
    type: field.fieldType,
    options: field.fieldType === "select" ? optionsListForField(field.id, optionRows) : undefined,
    placeholder: field.placeholder ?? undefined,
    recommendedOption: field.recommendedOption ?? undefined,
    optionPriceDeltasCzk: field.fieldType === "select" ? optionPriceDeltasForField(field.id, optionRows) : undefined,
  };
}

/** Jedno načtení katalogu z DB na React request (homepage, produkty, admin nápovědy…). */
export const getCatalogCategories = cache(async function getCatalogCategories(): Promise<CategoryDefinition[]> {
  try {
    const categoryRows = await prisma.$queryRaw<CategoryRow[]>`
      SELECT "id", "slug", "title", "description", "sortOrder"
      FROM "Category"
      WHERE "isActive" = TRUE
      ORDER BY "sortOrder" ASC;
    `;

    if (!categoryRows.length) return fallbackCategories;

    const productRows = await prisma.$queryRaw<ProductRow[]>`
      SELECT "id", "categoryId", "slug", "name", "description", "image", "arModelGlbUrl", "arModelUsdzUrl", "basePriceText", "sortOrder"
      FROM "Product"
      WHERE "isActive" = TRUE
      ORDER BY "sortOrder" ASC;
    `;

    const fieldRows = await prisma.$queryRaw<FieldRow[]>`
      SELECT "id", "productId", "label", "fieldType", "placeholder", "sortOrder", "recommendedOption"
      FROM "ProductConfigField"
      ORDER BY "productId" ASC, "sortOrder" ASC;
    `;

    const optionRows = await prisma.$queryRaw<OptionRow[]>`
      SELECT "fieldId", "value", "sortOrder", "priceDeltaCzk"
      FROM "ProductConfigOption"
      ORDER BY "fieldId" ASC, "sortOrder" ASC;
    `;

    const fieldsByProduct = new Map<string, ProductConfigField[]>();
    for (const field of fieldRows) {
      const list = fieldsByProduct.get(field.productId) ?? [];
      list.push(mapFieldRowToConfig(field, optionRows));
      fieldsByProduct.set(field.productId, list);
    }

    const productsByCategory = new Map<string, ProductDefinition[]>();
    for (const product of productRows) {
      const list = productsByCategory.get(product.categoryId) ?? [];
      list.push({
        slug: product.slug,
        name: product.name,
        image: product.image,
        arModelGlbUrl: product.arModelGlbUrl,
        arModelUsdzUrl: product.arModelUsdzUrl,
        description: product.description,
        basePriceText: product.basePriceText,
        config: fieldsByProduct.get(product.id) ?? [],
      });
      productsByCategory.set(product.categoryId, list);
    }

    return categoryRows.map((category) => ({
      slug: category.slug,
      title: category.title,
      description: category.description,
      products: productsByCategory.get(category.id) ?? [],
    }));
  } catch {
    return fallbackCategories;
  }
});

export async function getCategoryBySlug(slug: string): Promise<CategoryDefinition | null> {
  const categories = await getCatalogCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  try {
    const productRows = await prisma.$queryRaw<
      Array<{
        id: string;
        slug: string;
        name: string;
        image: string;
        arModelGlbUrl: string | null;
        arModelUsdzUrl: string | null;
        description: string;
        basePriceText: string;
        basePriceAmount: number | null;
      }>
    >`
      SELECT "id", "slug", "name", "image", "arModelGlbUrl", "arModelUsdzUrl", "description", "basePriceText", "basePriceAmount"
      FROM "Product"
      WHERE "slug" = ${slug}
      LIMIT 1;
    `;

    const row = productRows[0];
    if (!row) {
      if (slug === DEPOSIT_PRODUCT_SLUG) return { ...fallbackDepositProduct, basePriceAmount: 5000 };
      return null;
    }

    const fieldRows = await prisma.$queryRaw<FieldRow[]>`
      SELECT "id", "productId", "label", "fieldType", "placeholder", "sortOrder", "recommendedOption"
      FROM "ProductConfigField"
      WHERE "productId" = ${row.id}
      ORDER BY "sortOrder" ASC;
    `;

    const optionRows = await prisma.$queryRaw<OptionRow[]>`
      SELECT "fieldId", "value", "sortOrder", "priceDeltaCzk"
      FROM "ProductConfigOption"
      WHERE "fieldId" IN (SELECT "id" FROM "ProductConfigField" WHERE "productId" = ${row.id})
      ORDER BY "fieldId" ASC, "sortOrder" ASC;
    `;

    const config: ProductConfigField[] = fieldRows.map((field) => mapFieldRowToConfig(field, optionRows));

    return {
      slug: row.slug,
      name: row.name,
      image: row.image,
      arModelGlbUrl: row.arModelGlbUrl,
      arModelUsdzUrl: row.arModelUsdzUrl,
      description: row.description,
      basePriceText: row.basePriceText,
      basePriceAmount: row.basePriceAmount,
      config,
    };
  } catch {
    if (slug === DEPOSIT_PRODUCT_SLUG) return { ...fallbackDepositProduct, basePriceAmount: 5000 };
    return null;
  }
}
