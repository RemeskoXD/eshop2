import type { ProductConfigField } from "@/lib/catalog";

type ProductSource = {
  slug: string;
  name: string;
  description: string;
  image: string;
  arModelGlbUrl?: string | null;
  arModelUsdzUrl?: string | null;
  basePriceText: string;
  basePriceAmount?: number | null;
  config: ProductConfigField[];
};

export type ProductPageContent = {
  slug: string;
  title: string;
  body: string;
  media: {
    heroImage: string;
  };
  arAssets: {
    glbUrl?: string | null;
    usdzUrl?: string | null;
  };
  pricing: {
    basePriceText: string;
    basePriceAmount: number;
    isEstimate: boolean;
  };
  specs: Array<{ label: string; value: string }>;
  faq: Array<{ q: string; a: string }>;
  sections: {
    whyThisProductTitle: string;
    whyThisProductBody: string;
    processTitle: string;
    processSteps: string[];
  };
  configuratorFields: ProductConfigField[];
};

export function buildProductPageContent(product: ProductSource): ProductPageContent {
  return {
    slug: product.slug,
    title: product.name,
    body: product.description,
    media: {
      heroImage: product.image,
    },
    arAssets: {
      glbUrl: product.arModelGlbUrl,
      usdzUrl: product.arModelUsdzUrl,
    },
    pricing: {
      basePriceText: product.basePriceText,
      basePriceAmount: product.basePriceAmount ?? 5000,
      isEstimate: true,
    },
    specs: [
      { label: "Cena", value: product.basePriceText },
      { label: "Sklad", value: "Na zakázku" },
      { label: "DPH", value: "Účtujeme" },
      { label: "Doprava", value: "Individuálně" },
    ],
    faq: [
      {
        q: "Kdy dostanu finální cenu?",
        a: "Po zaměření technikem a potvrzení konkrétních parametrů realizace.",
      },
      {
        q: "Co když realizace nebude technicky možná?",
        a: "V takovém případě vracíme zálohu v plné výši.",
      },
    ],
    sections: {
      whyThisProductTitle: "Bezpečný krok před výrobou",
      whyThisProductBody:
        "Záloha vám drží termín technika. Pokud realizace nebude technicky možná, vracíme zálohu v plné výši.",
      processTitle: "Co se děje po odeslání konfigurace",
      processSteps: [
        "Zkontrolujeme parametry a spojíme se s vámi.",
        "Domluvíme zaměření a technické ověření.",
        "Potvrdíme finální cenu a termín realizace.",
      ],
    },
    configuratorFields: product.config,
  };
}
