"use client";

import Image from "next/image";
import type { ProductConfigField } from "@/lib/catalog";
import { isColorField, resolveColorSwatch } from "@/lib/product-config-colors";
import { useConfiguratorPreview } from "@/components/configurator-preview-context";

type ProductHeroLiveProps = {
  heroImage: string;
  title: string;
  fields: ProductConfigField[];
};

export default function ProductHeroLive({ heroImage, title, fields }: ProductHeroLiveProps) {
  const preview = useConfiguratorPreview();
  const colorFields = fields.filter(isColorField);
  let overlayHex: string | null = null;
  if (preview && colorFields.length > 0) {
    const primary = colorFields[0];
    const raw = (preview.previewValues[primary.label] ?? "").trim();
    if (raw) overlayHex = resolveColorSwatch(raw);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_16px_40px_rgba(20,33,47,0.14)]">
      <Image
        src={heroImage}
        alt={title}
        width={900}
        height={600}
        sizes="(max-width: 1024px) 100vw, 66vw"
        className="h-72 w-full object-cover sm:h-80"
        priority
      />
      {overlayHex ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-[background-color,opacity] duration-300 ease-out"
          style={{
            backgroundColor: overlayHex,
            opacity: 0.28,
            mixBlendMode: "multiply",
          }}
        />
      ) : null}
      {overlayHex ? (
        <p className="pointer-events-none absolute bottom-2 left-2 right-2 rounded-lg bg-black/45 px-2 py-1 text-center text-[11px] font-medium text-white backdrop-blur-[2px] sm:text-xs">
          Náhled odstínu u fotky — orientační; přesný tón potvrdíme u vzorku.
        </p>
      ) : null}
    </div>
  );
}
