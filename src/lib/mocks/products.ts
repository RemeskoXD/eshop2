/**
 * Demo produkty pro /demo/product-grid — obrázky používají stejné cesty jako fallback katalog (`public/IMAGE/`).
 * Pokud soubory v projektu chybí, doplňte je jako u referencí v `src/data/references.ts`.
 */
export type QuickViewTab = "description" | "specifications";

export type MockProduct = {
  id: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  shortDescription: string;
  description: string;
  model3dUrl: string;
  arIosUrl?: string;
  specifications: Record<string, string>;
};

export const mockProducts: MockProduct[] = [
  {
    id: "p1",
    slug: "sekcni-garazova-vrata-premium",
    title: "Sekční garážová vrata Premium",
    price: 42990,
    image: "/IMAGE/sekvencni_garazova_vrata.webp",
    shortDescription: "Tichý chod, vysoká izolace, moderní design.",
    description:
      "Prémiová sekční vrata vhodná pro rodinné domy. Nabízí skvělé tepelně-izolační vlastnosti, plynulý chod a širokou nabídku dekorů.",
    model3dUrl: "/models/garage-premium.glb",
    arIosUrl: "/models/garage-premium.usdz",
    specifications: {
      Materiál: "Ocelový sendvičový panel 40 mm",
      Izolace: "PU pěna",
      Ovládání: "Motor + dálkové ovládání",
      Záruka: "5 let",
    },
  },
  {
    id: "p2",
    slug: "venkovni-zaluzie-z90",
    title: "Venkovní žaluzie Z90",
    price: 18990,
    image: "/IMAGE/venkovni_zaluzie.webp",
    shortDescription: "Efektivní stínění s přesnou regulací světla.",
    description:
      "Moderní venkovní žaluzie s lamelou Z90 pro maximální stínicí účinek. Vhodné pro novostavby i rekonstrukce.",
    model3dUrl: "/models/venkovni-zaluzie-z90.glb",
    arIosUrl: "/models/venkovni-zaluzie-z90.usdz",
    specifications: {
      Lamela: "Z 90",
      Ovládání: "Motorické",
      "Odolnost větru": "Až 80 km/h",
      Barvy: "RAL vzorník",
    },
  },
  {
    id: "p3",
    slug: "screen-roleta-slim",
    title: "Screen roleta Slim",
    price: 16490,
    image: "/IMAGE/screenove_rolety.webp",
    shortDescription: "Designové řešení pro fasádu i pergolu.",
    description:
      "Screenové rolety s elegantním boxem, které výrazně omezují přehřívání interiéru a zároveň zachovávají výhled ven.",
    model3dUrl: "/models/screen-roleta-slim.glb",
    arIosUrl: "/models/screen-roleta-slim.usdz",
    specifications: {
      Tkanina: "Serge 3 %",
      Kazeta: "Hliník",
      "Ochrana před UV": "Až 95 %",
      Montáž: "Fasáda / ostění",
    },
  },
  {
    id: "p4",
    slug: "interierova-zaluzi-lux",
    title: "Interiérové žaluzie Lux",
    price: 3490,
    image: "/IMAGE/horizontalnizaluzie.webp",
    shortDescription: "Čistý vzhled a jednoduchá údržba.",
    description:
      "Klasické interiérové žaluzie s moderním vzhledem, vhodné pro obývací pokoje, ložnice i kanceláře.",
    model3dUrl: "/models/interier-zaluzi-lux.glb",
    specifications: {
      "Šířka lamely": "25 mm",
      Ovládání: "Řetízek",
      "Barvy nosníku": "Bílá / antracit / černá",
      Dodání: "7–14 dnů",
    },
  },
  {
    id: "p5",
    slug: "prumyslova-vrata-proline",
    title: "Průmyslová vrata ProLine",
    price: 79990,
    image: "/IMAGE/prumyslova-vrata.webp",
    shortDescription: "Odolné řešení pro haly a provozy.",
    description:
      "Průmyslová sekční vrata navržená pro vysokou frekvenci provozu s důrazem na bezpečnost a spolehlivost.",
    model3dUrl: "/models/prumyslova-proline.glb",
    arIosUrl: "/models/prumyslova-proline.usdz",
    specifications: {
      "Provozní cykly": "100 000+",
      Bezpečnost: "Fotobuňky + bezpečnostní lišta",
      "Max. šířka": "8000 mm",
      Servis: "Servisní podpora (24/7)",
    },
  },
  {
    id: "p6",
    slug: "plise-den-a-noc",
    title: "Plisé Den a Noc",
    price: 5290,
    image: "/IMAGE/plise_zaluzie.webp",
    shortDescription: "Flexibilní stínění pro moderní interiéry.",
    description:
      "Elegantní plisé systém den a noc umožňuje přesné nastavení intenzity světla a soukromí během celého dne.",
    model3dUrl: "/models/plise-den-noc.glb",
    specifications: {
      Systém: "Shora dolů / zdola nahoru",
      Látky: "Skupiny 1–5",
      Ovládání: "Madlo / šňůra",
      "Bezpečné pro děti": "Ano",
    },
  },
  {
    id: "p7",
    slug: "zaloha-na-zamereni",
    title: "Záloha na zaměření technikem",
    price: 5000,
    image: "/IMAGE/prodej_a_mont_____bez_logo.webp",
    shortDescription: "Rezervace termínu technika po celé ČR.",
    description:
      "Rezervační záloha na návštěvu technika. V případě technické nerealizovatelnosti je částka vrácena v plné výši.",
    model3dUrl: "/models/deposit-service.glb",
    specifications: {
      Služba: "Zaměření + konzultace",
      Oblast: "Celá ČR",
      "Vrácení zálohy": "100 % při technické nerealizovatelnosti",
      "V ceně": "Doporučení vhodného řešení",
    },
  },
  {
    id: "p8",
    slug: "pergolova-roleta-shadow",
    title: "Pergolová roleta Shadow",
    price: 21990,
    image: "/IMAGE/screenove_rolety.webp",
    shortDescription: "Komfort a soukromí pro terasy a pergoly.",
    description:
      "Boční screen rolety pro pergoly s odolnou tkaninou a motorickým ovládáním. Ideální pro zvýšení komfortu i soukromí.",
    model3dUrl: "/models/pergola-shadow.glb",
    arIosUrl: "/models/pergola-shadow.usdz",
    specifications: {
      "Třída odolnosti větru": "3",
      Motor: "Kompatibilní se Somfy",
      "Propustnost tkaniny": "3 % / 5 %",
      "Max. výška": "3000 mm",
    },
  },
];
