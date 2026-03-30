"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Box, Search, SlidersHorizontal, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import ModelViewerFrame from "@/components/model-viewer-frame";
import Button from "@/components/ui/button";
import Chip from "@/components/ui/chip";
import EmptyState from "@/components/ui/empty-state";
import OrderProcessMini from "@/components/ui/order-process-mini";
import { trackEvent } from "@/lib/analytics";
import type { ProductDefinition } from "@/lib/catalog";
import { findBestTokenMatch, normalizeForSearch, tokenizeForSearch } from "@/lib/search";
import { productDetailHref } from "@/lib/storefront-paths";

type CatalogInlineGridProps = {
  products: ProductDefinition[];
  /** Zapne sync filtrů do URL query (`q`, `sort`, `with3d`). */
  syncWithUrl?: boolean;
};

type TabKey = "description" | "specifications";

function getColumnCount(): 1 | 2 | 3 {
  if (typeof window === "undefined") return 3;
  if (window.matchMedia("(min-width: 1024px)").matches) return 3;
  if (window.matchMedia("(min-width: 640px)").matches) return 2;
  return 1;
}

function parsePrice(basePriceText: string): number {
  const m = basePriceText.replace(/\s/g, "").match(/\d+/);
  return m ? Number(m[0]) : 5000;
}

function Card({
  product,
  isOpen,
  onQuickView,
}: {
  product: ProductDefinition;
  isOpen: boolean;
  onQuickView: (slug: string) => void;
}) {
  return (
    <article className="ui-motion ui-hover-lift flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-card shadow-sm">
      <div className="relative aspect-[4/3] bg-[#f1f1f3]">
        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width:1024px) 50vw, 33vw" />
        {product.arModelGlbUrl || product.arModelUsdzUrl ? (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-accent/25 bg-white/90 px-2 py-1 text-[11px] font-semibold text-accent shadow-sm">
            <Box className="h-3.5 w-3.5" />
            3D/AR
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-lg font-semibold text-primary">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-black/65">{product.description}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-primary">{product.basePriceText}</p>
            <p className="mt-0.5 text-[11px] text-foreground/60">Orientační cena · finální po zaměření</p>
          </div>
          <Link
            href={productDetailHref(product.slug)}
            className="ui-motion text-xs font-semibold text-black/60 underline-offset-4 hover:text-primary hover:underline"
          >
            Detail produktu
          </Link>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onQuickView(product.slug)}
            aria-expanded={isOpen}
            aria-controls={`quick-view-${product.slug}`}
            className={`ui-motion rounded-xl px-3 py-2 text-sm font-semibold ${
              isOpen ? "bg-black text-white hover:bg-black/85" : "bg-accent text-white hover:bg-foreground"
            }`}
          >
            {isOpen ? "Zavřít náhled" : "Rychlý náhled"}
          </button>
          <Link
            href={productDetailHref(product.slug)}
            className="ui-motion inline-flex items-center justify-center rounded-xl border border-black/[0.12] bg-white px-3 py-2 text-sm font-semibold text-black/80 hover:border-primary/30 hover:text-primary"
          >
            Otevřít detail
          </Link>
        </div>
      </div>
    </article>
  );
}

function QuickView({
  product,
  onAddToCart,
  onOpenDetail,
  onTryAr,
  onArStatus,
}: {
  product: ProductDefinition;
  onAddToCart: (p: ProductDefinition) => void;
  onOpenDetail: (slug: string) => void;
  onTryAr: (slug: string) => void;
  onArStatus: (slug: string, status: string) => void;
}) {
  const [tab, setTab] = useState<TabKey>("description");
  const [tabLoading, setTabLoading] = useState(false);
  const tabTimer = useRef<number | null>(null);
  const modelWrapRef = useRef<HTMLDivElement | null>(null);
  const hasModel = Boolean(product.arModelGlbUrl || product.arModelUsdzUrl);

  useEffect(() => () => {
    if (tabTimer.current) window.clearTimeout(tabTimer.current);
  }, []);

  function switchTab(next: TabKey) {
    if (next === tab) return;
    if (tabTimer.current) window.clearTimeout(tabTimer.current);
    setTabLoading(true);
    setTab(next);
    tabTimer.current = window.setTimeout(() => setTabLoading(false), 140);
    trackEvent("catalog_quick_view_tab_change", { slug: product.slug, tab: next });
  }

  function handleTryArClick() {
    onTryAr(product.slug);
    modelWrapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <section
      id={`quick-view-${product.slug}`}
      className="ui-fade-in mt-4 overflow-hidden rounded-2xl border border-primary/25 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.08)]"
    >
      <div className="grid lg:grid-cols-2">
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
              src={hasModel ? product.arModelGlbUrl : undefined}
              iosSrc={product.arModelUsdzUrl}
              alt={product.name}
              height={320}
              fallbackText="3D model zatím není nahraný. Pokračujte na detail produktu."
              analytics={{ context: "catalog-quick-view", slug: product.slug }}
              onArStatus={(status) => onArStatus(product.slug, status)}
            />
          </div>
          <p className="mt-2 text-xs text-black/55">
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
          <h3 className="font-heading text-2xl font-semibold text-primary">{product.name}</h3>
          <p className="mt-1 text-sm text-black/60">Cena od <strong className="text-primary">{product.basePriceText}</strong></p>
          <p className="mt-1 text-xs text-foreground/60">Orientační cena · finální po zaměření technikem</p>
          <OrderProcessMini className="mt-4" />

          <div role="tablist" aria-label={`Detail produktu ${product.name}`} className="mt-5 inline-flex rounded-xl border border-black/10 bg-strip p-1">
            <button
              type="button"
              onClick={() => switchTab("description")}
              role="tab"
              id={`tab-desc-${product.slug}`}
              aria-selected={tab === "description"}
              aria-controls={`panel-${product.slug}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                tab === "description" ? "bg-white text-primary shadow-sm" : "text-black/65"
              }`}
            >
              Popis
            </button>
            <button
              type="button"
              onClick={() => switchTab("specifications")}
              role="tab"
              id={`tab-spec-${product.slug}`}
              aria-selected={tab === "specifications"}
              aria-controls={`panel-${product.slug}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                tab === "specifications" ? "bg-white text-primary shadow-sm" : "text-black/65"
              }`}
            >
              Specifikace
            </button>
          </div>

          <div
            id={`panel-${product.slug}`}
            role="tabpanel"
            aria-labelledby={tab === "description" ? `tab-desc-${product.slug}` : `tab-spec-${product.slug}`}
            className="ui-motion mt-4 min-h-[170px] rounded-xl border border-black/10 bg-white p-4 text-sm"
          >
            {tabLoading ? (
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-black/10" />
                <div className="h-3 w-[92%] animate-pulse rounded bg-black/10" />
                <div className="h-3 w-[84%] animate-pulse rounded bg-black/10" />
                <div className="h-3 w-[76%] animate-pulse rounded bg-black/10" />
              </div>
            ) : tab === "description" ? (
              <p className="leading-relaxed text-black/75">{product.description}</p>
            ) : (
              <dl className="ui-fade-in grid gap-2">
                {product.config.map((field) => (
                  <div key={field.label} className="grid grid-cols-[1fr_auto] gap-3 border-b border-black/5 pb-2 last:border-0">
                    <dt className="text-black/55">{field.label}</dt>
                    <dd className="font-medium text-foreground">
                      {field.type === "select" ? field.options?.slice(0, 3).join(", ") || "-" : field.placeholder || "Číselný vstup"}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <p className="mt-5 text-xs text-black/55">Postup: Rychlý náhled {"->"} Přidat do košíku {"->"} Detail produktu</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="inline-flex justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-foreground"
            >
              Přidat do košíku
            </button>
            <Link
              href={productDetailHref(product.slug)}
              onClick={() => onOpenDetail(product.slug)}
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

export default function CatalogInlineGrid({ products, syncWithUrl = false }: CatalogInlineGridProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [columns, setColumns] = useState<1 | 2 | 3>(getColumnCount);
  const [localQuery, setLocalQuery] = useState("");
  const [localOnlyWith3d, setLocalOnlyWith3d] = useState(false);
  const [localSortBy, setLocalSortBy] = useState<"popular" | "price-asc" | "price-desc" | "name-asc">("popular");
  const lastNoResultsKey = useRef<string | null>(null);
  const arAttemptedSlugs = useRef<Set<string>>(new Set());

  useEffect(() => {
    const onResize = () => setColumns(getColumnCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const urlQuery = searchParams.get("q") ?? "";
  const urlWith3d = searchParams.get("with3d") === "1";
  const urlOpen = searchParams.get("open");
  const urlSortRaw = searchParams.get("sort");
  const urlSort: typeof localSortBy =
    urlSortRaw === "price-asc" || urlSortRaw === "price-desc" || urlSortRaw === "name-asc"
      ? urlSortRaw
      : "popular";

  const query = syncWithUrl ? urlQuery : localQuery;
  const onlyWith3d = syncWithUrl ? urlWith3d : localOnlyWith3d;
  const sortBy = syncWithUrl ? urlSort : localSortBy;

  function replaceFilterQuery(next: {
    q?: string;
    with3d?: boolean;
    sort?: typeof sortBy;
    open?: string | null;
  }) {
    if (!syncWithUrl) return;
    const params = new URLSearchParams(searchParams.toString());
    const q = (next.q ?? query).trim();
    const with3d = next.with3d ?? onlyWith3d;
    const sort = next.sort ?? sortBy;
    const open = next.open === undefined ? (syncWithUrl ? urlOpen : openSlug) : next.open;

    if (q) params.set("q", q);
    else params.delete("q");

    if (with3d) params.set("with3d", "1");
    else params.delete("with3d");

    if (sort !== "popular") params.set("sort", sort);
    else params.delete("sort");

    if (open) params.set("open", open);
    else params.delete("open");

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function updateQuery(nextQuery: string) {
    if (!syncWithUrl) setLocalQuery(nextQuery);
    replaceFilterQuery({ q: nextQuery });
    trackEvent("catalog_filter_query_change", { q: nextQuery.trim().slice(0, 64) });
  }

  function updateOnlyWith3d(nextValue: boolean) {
    if (!syncWithUrl) setLocalOnlyWith3d(nextValue);
    replaceFilterQuery({ with3d: nextValue });
    trackEvent("catalog_filter_3d_toggle", { enabled: nextValue });
  }

  function updateSort(nextSort: typeof sortBy) {
    if (!syncWithUrl) setLocalSortBy(nextSort);
    replaceFilterQuery({ sort: nextSort });
    trackEvent("catalog_filter_sort_change", { sort: nextSort });
  }

  function resetFilters() {
    setLocalQuery("");
    setLocalOnlyWith3d(false);
    setLocalSortBy("popular");
    replaceFilterQuery({ q: "", with3d: false, sort: "popular" });
    trackEvent("catalog_filters_reset");
  }

  function clearQueryFilter() {
    updateQuery("");
    trackEvent("catalog_filter_chip_remove", { filter: "q" });
  }

  function clearOnlyWith3dFilter() {
    updateOnlyWith3d(false);
    trackEvent("catalog_filter_chip_remove", { filter: "with3d" });
  }

  function clearSortFilter() {
    updateSort("popular");
    trackEvent("catalog_filter_chip_remove", { filter: "sort" });
  }

  const requestedOpenSlug = syncWithUrl ? urlOpen : openSlug;

  const filteredProducts = useMemo(() => {
    const q = normalizeForSearch(query.trim());
    const list = products.filter((p) => {
      const has3d = Boolean(p.arModelGlbUrl || p.arModelUsdzUrl);
      if (onlyWith3d && !has3d) return false;
      if (!q) return true;
      const nameTokens = tokenizeForSearch(p.name);
      const descriptionNorm = normalizeForSearch(p.description ?? "");
      const priceNorm = normalizeForSearch(p.basePriceText ?? "");

      // 1) robustní match bez diakritiky
      const includesMatch =
        nameTokens.some((t) => t.includes(q)) ||
        descriptionNorm.includes(q) ||
        priceNorm.includes(q);
      if (includesMatch) return true;

      // 2) lehká typo tolerance přes tokeny (malý katalog -> ok)
      const best = findBestTokenMatch(q, [p], (item) => tokenizeForSearch(item.name));
      return Boolean(best);
    });

    const sorted = [...list];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => parsePrice(a.basePriceText) - parsePrice(b.basePriceText));
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => parsePrice(b.basePriceText) - parsePrice(a.basePriceText));
    } else if (sortBy === "name-asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "cs"));
    }
    return sorted;
  }, [products, query, onlyWith3d, sortBy]);

  const bestQuerySuggestion = useMemo(() => {
    const q = normalizeForSearch(query.trim());
    if (!q) return null;
    if (filteredProducts.length > 0) return null;

    return findBestTokenMatch(
      q,
      products,
      (p) => tokenizeForSearch(p.name),
    );
  }, [products, query, filteredProducts.length]);

  const effectiveOpenSlug = useMemo(() => {
    if (!requestedOpenSlug) return null;
    return filteredProducts.some((p) => p.slug === requestedOpenSlug) ? requestedOpenSlug : null;
  }, [requestedOpenSlug, filteredProducts]);

  const openIndex = useMemo(
    () => filteredProducts.findIndex((p) => p.slug === effectiveOpenSlug),
    [effectiveOpenSlug, filteredProducts],
  );

  function toggleQuickView(slug: string) {
    if (syncWithUrl) {
      const next = requestedOpenSlug === slug ? null : slug;
      replaceFilterQuery({ open: next });
      trackEvent("catalog_quick_view_toggle", { slug, open: next ? 1 : 0 });
      return;
    }
    setOpenSlug((prev) => {
      const next = prev === slug ? null : slug;
      trackEvent("catalog_quick_view_toggle", { slug, open: next ? 1 : 0 });
      return next;
    });
  }

  function addFromQuickView(p: ProductDefinition) {
    const unitPrice = parsePrice(p.basePriceText);
    addItem({
      id: `${p.slug}-${Date.now()}`,
      name: p.name,
      unitPrice,
      quantity: 1,
      config: { source: "catalog-quick-view" },
    });
    trackEvent("catalog_quick_view_add_to_cart", { slug: p.slug, unitPrice });
    if (arAttemptedSlugs.current.has(p.slug)) {
      trackEvent("catalog_add_to_cart_after_ar", { slug: p.slug, unitPrice });
    }
  }

  function openDetailFromQuickView(slug: string) {
    trackEvent("catalog_quick_view_open_detail", { slug });
  }

  function tryArFromQuickView(slug: string) {
    arAttemptedSlugs.current.add(slug);
    trackEvent("catalog_quick_view_try_ar_click", { slug });
  }

  function handleQuickViewArStatus(slug: string, status: string) {
    if (status !== "not-presenting") {
      arAttemptedSlugs.current.add(slug);
    }
    trackEvent("catalog_quick_view_ar_status", { slug, status });
  }

  const hasActiveFilters = Boolean(query || onlyWith3d || sortBy !== "popular");

  useEffect(() => {
    if (!hasActiveFilters || filteredProducts.length > 0) {
      lastNoResultsKey.current = null;
      return;
    }
    const key = `${query}|${onlyWith3d}|${sortBy}`;
    if (lastNoResultsKey.current === key) return;
    lastNoResultsKey.current = key;
    trackEvent("catalog_no_results", { q: query.trim().slice(0, 64), onlyWith3d, sortBy });
  }, [filteredProducts.length, hasActiveFilters, onlyWith3d, query, sortBy]);

  useEffect(() => {
    if (!effectiveOpenSlug) return;
    const el = document.getElementById(`quick-view-${effectiveOpenSlug}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [effectiveOpenSlug]);

  const nodes: ReactNode[] = [];

  for (let i = 0; i < filteredProducts.length; i += 1) {
    const product = filteredProducts[i];
    nodes.push(
      <Card
        key={`card-${product.slug}`}
        product={product}
        isOpen={effectiveOpenSlug === product.slug}
        onQuickView={toggleQuickView}
      />,
    );

    const rowStart = i - (i % columns);
    const rowEnd = Math.min(rowStart + columns - 1, filteredProducts.length - 1);
    const isLastInRow = i === rowEnd;
    const openInRow = openIndex >= rowStart && openIndex <= rowEnd;

    if (isLastInRow && openInRow && openIndex >= 0) {
      nodes.push(
        <div key={`quick-${rowStart}`} className="col-span-full">
          <QuickView
            product={filteredProducts[openIndex]}
            onAddToCart={addFromQuickView}
            onOpenDetail={openDetailFromQuickView}
            onTryAr={tryArFromQuickView}
            onArStatus={handleQuickViewArStatus}
          />
        </div>,
      );
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-black/[0.08] bg-card p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              updateQuery(e.target.value);
            }}
            placeholder="Hledat produkt v kategorii..."
            className="h-11 w-full rounded-xl border border-black/[0.12] bg-white py-2 pl-9 pr-4 text-sm outline-none transition placeholder:text-black/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            onClick={() => {
              updateOnlyWith3d(!onlyWith3d);
            }}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
              onlyWith3d
                ? "border-accent/35 bg-accent/10 text-accent"
                : "border-black/[0.12] bg-white text-black/70 hover:border-primary/25"
            }`}
            variant="ghost"
            size="sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Jen s 3D/AR
          </Button>
          <select
            value={sortBy}
            onChange={(e) => {
              updateSort(e.target.value as typeof sortBy);
            }}
            className="h-10 rounded-xl border border-black/[0.12] bg-white px-3 text-sm text-black/75 outline-none focus:border-primary/40"
          >
            <option value="popular">Řazení: Doporučené</option>
            <option value="price-asc">Cena: od nejnižší</option>
            <option value="price-desc">Cena: od nejvyšší</option>
            <option value="name-asc">Název: A-Z</option>
          </select>
        </div>
      </div>

      <p className="mb-4 text-xs text-black/55">
        Nalezeno produktů: <strong>{filteredProducts.length}</strong>
      </p>
      <p className="mb-4 text-xs text-black/50">
        Tip: klikněte na <strong>Rychlý náhled</strong> a porovnejte produkt bez odchodu ze seznamu.
      </p>

      {hasActiveFilters ? (
        <div className="mb-3">
          <button
            type="button"
            onClick={resetFilters}
            className="ui-motion inline-flex items-center gap-1.5 rounded-full border border-black/12 bg-white px-3 py-1.5 text-xs font-semibold text-black/70 hover:border-primary/30 hover:text-primary"
          >
            <X className="h-3.5 w-3.5" />
            Vyčistit všechny filtry
          </button>
        </div>
      ) : null}

      {hasActiveFilters ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {query ? (
            <Chip
              onClick={clearQueryFilter}
              active
            >
              Hledání: {query} ×
            </Chip>
          ) : null}
          {onlyWith3d ? (
            <Chip
              onClick={clearOnlyWith3dFilter}
              active
            >
              Jen s 3D/AR ×
            </Chip>
          ) : null}
          {sortBy !== "popular" ? (
            <Chip
              onClick={clearSortFilter}
              active
            >
              Řazení ×
            </Chip>
          ) : null}
        </div>
      ) : null}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{nodes}</div>
      ) : (
        <EmptyState
          title="Žádný produkt neodpovídá aktuálnímu filtru"
          description="Zkuste upravit hledání, vypnout 3D/AR filtr nebo vrátit doporučené řazení."
          actions={(
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button onClick={resetFilters}>Reset filtrů</Button>
              {bestQuerySuggestion ? (
                <Button
                  onClick={() => updateQuery(bestQuerySuggestion.item.name)}
                  variant="secondary"
                >
                  Mysleli jste: {bestQuerySuggestion.item.name}?
                </Button>
              ) : null}
              <Button
                variant="secondary"
                onClick={() => {
                  clearQueryFilter();
                  clearOnlyWith3dFilter();
                }}
              >
                Zrušit omezení
              </Button>
            </div>
          )}
        />
      )}
    </>
  );
}
