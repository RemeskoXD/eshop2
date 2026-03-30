import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QAPI e-shop — vrata a stínění",
    short_name: "QAPI",
    description: "Zakázková vrata a stínění na míru. Konfigurace online, montáž po celé ČR.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#c9a227",
    lang: "cs",
    orientation: "portrait-primary",
    categories: ["shopping", "business"],
    icons: [
      {
        src: "/icons/app-icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/app-icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
