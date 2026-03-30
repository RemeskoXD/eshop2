"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import ModelViewerFrame from "@/components/model-viewer-frame";
import OrderProcessMini from "@/components/ui/order-process-mini";
import { trackEvent } from "@/lib/analytics";
import type { MockProduct, QuickViewTab } from "@/lib/mocks/products";

type QuickViewPanelProps = {
  product: MockProduct;
  onAddToCart: (product: MockProduct) => void;
};

export default function QuickViewPanel({ product, onAddToCart }: QuickViewPanelProps) {
  const [activeTab, setActiveTab] = useState<QuickViewTab>("description");
  const [tabLoading, setTabLoading] = useState(false);
  const tabTimer = useRef<number | null>(null);
  const modelWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => () => {
    if (tabTimer.current) window.clearTimeout(tabTimer.current);
  }, []);

  function switchTab(next: QuickViewTab) {
    if (next === activeTab) return;
    if (tabTimer.current) window.clearTimeout(tabTimer.current);
    setTabLoading(true);
    setActiveTab(next);
    tabTimer.current = window.setTimeout(() => setTabLoading(false), 140);
    trackEvent("demo_quick_view_tab_change", { slug: product.slug, tab: next });
  }

  function handleTryArClick() {
    trackEvent("demo_quick_view_try_ar_click", { slug: product.slug });
    modelWrapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-primary/25 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="border-b border-black/10 bg-gradient-to-b from-[#f6f9fd] to-[#f2f5f8] p-4 lg:border-b-0 lg:border-r">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.11em] text-primary">3D/AR náhled</p>
            <span className="rounded-full border border-black/10 bg-white px-2 py-0.5 text-[11px] font-semibold text-black/55">
              Tažením otočíte model
            </span>
          </div>
          <div
            ref={modelWrapRef}
            className="overflow-hidden rounded-xl border border-black/10 bg-gradient-to-b from-[#f8fbff] to-white shadow-[0_12px_32px_rgba(20,33,47,0.14)]"
          >
            <ModelViewerFrame
              src={product.model3dUrl}
              iosSrc={product.arIosUrl}
              alt={product.title}
              height={320}
              analytics={{ context: "demo-quick-view", slug: product.slug }}
              onArStatus={(status) => trackEvent("demo_quick_view_ar_status", { slug: product.slug, status })}
            />
          </div>
          <p className="mt-3 text-xs text-black/55">
            Tip: tažením otáčíte model. AR spustíte tlačítkem přímo v 3D okně (iOS/Android).
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleTryArClick}
              className="ui-motion rounded-xl border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15"
            >
              Vyzkoušet v AR
            </button>
            <span className="rounded-full border border-black/10 bg-white px-2 py-0.5 text-[11px] font-semibold text-black/55">
              iPhone/iPad
            </span>
            <span className="rounded-full border border-black/10 bg-white px-2 py-0.5 text-[11px] font-semibold text-black/55">
              Android
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <h3 className="font-heading text-2xl font-semibold text-primary">{product.title}</h3>
          <p className="mt-2 text-sm text-black/60">
            Cena od <strong className="text-primary">{product.price.toLocaleString("cs-CZ")} Kč</strong>
          </p>
          <p className="mt-1 text-xs text-foreground/60">Orientační cena · finální po zaměření technikem</p>
          <OrderProcessMini className="mt-4" />

          <div role="tablist" aria-label={`Detail produktu ${product.title}`} className="mt-5 inline-flex rounded-xl border border-black/10 bg-strip p-1">
            <button
              type="button"
              onClick={() => switchTab("description")}
              role="tab"
              id={`demo-tab-desc-${product.slug}`}
              aria-selected={activeTab === "description"}
              aria-controls={`demo-panel-${product.slug}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                activeTab === "description" ? "bg-white text-primary shadow-sm" : "text-black/65"
              }`}
            >
              Popis
            </button>
            <button
              type="button"
              onClick={() => switchTab("specifications")}
              role="tab"
              id={`demo-tab-spec-${product.slug}`}
              aria-selected={activeTab === "specifications"}
              aria-controls={`demo-panel-${product.slug}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                activeTab === "specifications" ? "bg-white text-primary shadow-sm" : "text-black/65"
              }`}
            >
              Specifikace
            </button>
          </div>

          <div
            id={`demo-panel-${product.slug}`}
            role="tabpanel"
            aria-labelledby={activeTab === "description" ? `demo-tab-desc-${product.slug}` : `demo-tab-spec-${product.slug}`}
            className="ui-motion mt-4 min-h-[170px] rounded-xl border border-black/10 bg-white p-4 text-sm"
          >
            {tabLoading ? (
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-black/10" />
                <div className="h-3 w-[92%] animate-pulse rounded bg-black/10" />
                <div className="h-3 w-[84%] animate-pulse rounded bg-black/10" />
                <div className="h-3 w-[76%] animate-pulse rounded bg-black/10" />
              </div>
            ) : activeTab === "description" ? (
              <p className="leading-relaxed text-black/75">{product.description}</p>
            ) : (
              <dl className="ui-fade-in grid gap-2">
                {Object.entries(product.specifications).map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[1fr_auto] gap-3 border-b border-black/5 pb-2 last:border-0">
                    <dt className="text-black/55">{label}</dt>
                    <dd className="font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="inline-flex justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-foreground"
            >
              Přidat do košíku
            </button>
            <Link
              href={`/demo/product-grid/${product.slug}`}
              className="inline-flex justify-center rounded-xl border border-black/15 bg-card px-5 py-3 text-sm font-semibold text-black/80 transition hover:border-primary/30 hover:text-primary"
            >
              Kompletní detail produktu
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
