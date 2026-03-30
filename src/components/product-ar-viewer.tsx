"use client";

import React, { useRef } from "react";
import ModelViewerFrame, { type ModelViewerFrameHandle } from "@/components/model-viewer-frame";
import { trackEvent } from "@/lib/analytics";

type ProductArViewerProps = {
  productSlug: string;
  productName: string;
  glbUrl?: string | null;
  usdzUrl?: string | null;
};

export default function ProductArViewer({
  productSlug,
  productName,
  glbUrl,
  usdzUrl,
}: ProductArViewerProps) {
  const viewerRef = useRef<ModelViewerFrameHandle>(null);
  const fallbackGlb = `/models/${productSlug}.glb`;
  const fallbackUsdz = `/models/${productSlug}.usdz`;
  const resolvedGlb = glbUrl || fallbackGlb;
  const resolvedUsdz = usdzUrl || fallbackUsdz;
  const hasConfiguredModel = Boolean(glbUrl || usdzUrl);

  function handleTryAr() {
    trackEvent("product_try_ar_click", { productSlug });
    viewerRef.current?.activateAR();
  }

  return (
    <section className="ui-surface-strong mt-6 overflow-hidden rounded-2xl p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">3D / rozšířená realita</p>
      <h2 className="mt-1 text-lg font-semibold text-primary">Náhled ve 3D a AR u vás doma</h2>
      <p className="mt-2 text-sm text-black/70">
        Otočte model prstem nebo myší. Tlačítkem „Vyzkoušet v AR“ ho promítnete přes kameru do skutečného prostoru
        (vhodné venkovní světlo, držte telefon v dostatečné vzdálenosti od stěny či garáže).
      </p>

      {hasConfiguredModel ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-gradient-to-b from-[#f8fbff] to-white shadow-[0_10px_30px_rgba(20,33,47,0.12)]">
          <ModelViewerFrame
            ref={viewerRef}
            src={resolvedGlb}
            iosSrc={resolvedUsdz}
            alt={productName}
            height={360}
            analytics={{ context: "product-page", slug: productSlug }}
            onArStatus={(status) => trackEvent("product_ar_status", { productSlug, status })}
          />
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-black/20 bg-muted p-4 text-sm text-black/70">
          3D model zatím nepřiřazujeme — pokračujte konfigurací, technik vše doladí při zaměření. Jakmile nahrajete
          <code className="mx-1 rounded bg-black/5 px-1">.glb</code> a případně
          <code className="mx-1 rounded bg-black/5 px-1">.usdz</code>
          v administraci, sekce se sama aktivuje.
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleTryAr}
          disabled={!hasConfiguredModel}
          className="ui-motion rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          Vyzkoušet v AR
        </button>
        <span className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-black/60">
          iOS (Quick Look) · Android (Scene Viewer)
        </span>
      </div>
      <p className="mt-2 text-xs text-black/60">
        Pro plynulé AR jsou nezbytné soubory <strong className="font-semibold">.glb</strong> (web / Android) a pro iPhone
        ideálně <strong className="font-semibold">.usdz</strong>.
      </p>
    </section>
  );
}
