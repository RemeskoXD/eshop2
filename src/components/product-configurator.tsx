"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Mail,
  Minus,
  Palette,
  Phone,
  Plus,
  Ruler,
  SlidersHorizontal,
  SwatchBook,
} from "lucide-react";
import type { ProductConfigField } from "@/lib/catalog";
import { useCart } from "@/components/cart-provider";
import { trackEvent } from "@/lib/analytics";
import { getPublicContactInfo } from "@/lib/contact";
import { getCapacityHint } from "@/lib/site";
import { isColorField, resolveColorSwatch } from "@/lib/product-config-colors";
import { useConfiguratorPreview } from "@/components/configurator-preview-context";

type ProductConfiguratorProps = {
  productId: string;
  productName: string;
  unitPrice: number;
  fields: ProductConfigField[];
};

type StepId = "dimensions" | "options" | "extras";

function isDimensionField(field: ProductConfigField): boolean {
  const v = `${field.label} ${field.placeholder ?? ""}`.toLowerCase();
  return (
    field.type !== "select" &&
    (v.includes("šíř") ||
      v.includes("sirka") ||
      v.includes("šírka") ||
      v.includes("výš") ||
      v.includes("vyska") ||
      v.includes("mm"))
  );
}

type DimensionConstraint = {
  absoluteMin: number;
  absoluteMax: number;
  typicalMin: number;
  typicalMax: number;
  unit: "mm";
};

const DEFAULT_DIMENSION_CONSTRAINT: DimensionConstraint = {
  absoluteMin: 100,
  absoluteMax: 10000,
  typicalMin: 500,
  typicalMax: 6000,
  unit: "mm",
};

function normalizeDimConstraint(c: DimensionConstraint): DimensionConstraint {
  let { absoluteMin: a, absoluteMax: b, typicalMin: t1, typicalMax: t2 } = c;
  if (a > b) [a, b] = [b, a];
  if (t1 > t2) [t1, t2] = [t2, t1];
  t1 = Math.max(a, Math.min(b, t1));
  t2 = Math.max(a, Math.min(b, t2));
  return { ...c, absoluteMin: a, absoluteMax: b, typicalMin: t1, typicalMax: t2 };
}

function getDimensionConstraint(field: ProductConfigField): DimensionConstraint {
  if (!isDimensionField(field)) return DEFAULT_DIMENSION_CONSTRAINT;
  const d = DEFAULT_DIMENSION_CONSTRAINT;
  const merged: DimensionConstraint = {
    unit: "mm",
    absoluteMin: field.minMm ?? d.absoluteMin,
    absoluteMax: field.maxMm ?? d.absoluteMax,
    typicalMin: field.typicalMinMm ?? d.typicalMin,
    typicalMax: field.typicalMaxMm ?? d.typicalMax,
  };
  return normalizeDimConstraint(merged);
}

type DimensionKind = "width" | "height" | "generic";

function getDimensionKind(field: ProductConfigField): DimensionKind {
  const v = `${field.label} ${field.placeholder ?? ""}`.toLowerCase();
  const isWidth = v.includes("šíř") || v.includes("sirka") || v.includes("šírka");
  const isHeight = v.includes("výš") || v.includes("vyska") || v.includes("výška");
  if (isWidth && !isHeight) return "width";
  if (isHeight && !isWidth) return "height";
  if (isWidth) return "width";
  if (isHeight) return "height";
  return "generic";
}

function formatSelectOptionLabel(option: string, field: ProductConfigField): string {
  const deltas = field.optionPriceDeltasCzk;
  if (!deltas) return option;
  const d = deltas[option];
  if (d === undefined) return option;
  if (d === 0) return `${option} — v ceně`;
  return `${option} (+ ${d.toLocaleString("cs-CZ")} Kč)`;
}

function getDimensionMicrocopy(field: ProductConfigField): string {
  switch (getDimensionKind(field)) {
    case "width":
      return "Šířku měřte jako rozměr čistého (montážního) otvoru v mm, typicky nejužší průchod mezi bočními hranami.";
    case "height":
      return "Výšku měřte v mm v místě montáže (např. otvor po výšce). Nejste si jistí? Přidejte fotku nebo volejte — technik to doladí.";
    default:
      return "Hodnota v milimetrech. Přesný význam pole (např. kam měřit „od–do“) potvrdí technik při zaměření.";
  }
}

function parseNumericValue(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export default function ProductConfigurator({
  productId,
  productName,
  unitPrice,
  fields,
}: ProductConfiguratorProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const contact = getPublicContactInfo();
  const capacityHint = getCapacityHint();
  const previewCtx = useConfiguratorPreview();
  const initialState = useMemo(() => {
    return Object.fromEntries(
      fields.map((field) => {
        if (field.type !== "select") return [field.label, ""];
        const opts = field.options ?? [];
        const rec = field.recommendedOption;
        const initial =
          rec && opts.includes(rec) ? rec : opts[0] ?? "";
        return [field.label, initial];
      }),
    );
  }, [fields]);

  const vzornikHref = `/kontakt?vzornik=1&produkt=${encodeURIComponent(productName)}`;
  const inquiryHref = `/kontakt?produkt=${encodeURIComponent(productName)}`;

  const [values, setValues] = useState<Record<string, string>>(initialState);

  const setPreviewValues = previewCtx?.setPreviewValues;
  useEffect(() => {
    setPreviewValues?.(values);
  }, [values, setPreviewValues]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<StepId>(() => {
    const hasDimensions = fields.some((f) => isDimensionField(f));
    return hasDimensions ? "dimensions" : "options";
  });

  const steps = useMemo(() => {
    const dimensions = fields.filter(isDimensionField);
    const rest = fields.filter((f) => !isDimensionField(f));
    const options = rest.filter((f) => f.type === "select");
    const extras = rest.filter((f) => f.type !== "select");

    const result: Array<{ id: StepId; title: string; icon: React.ElementType; fields: ProductConfigField[] }> = [];
    if (dimensions.length) result.push({ id: "dimensions", title: "Rozměry", icon: Ruler, fields: dimensions });
    if (options.length) result.push({ id: "options", title: "Varianty", icon: SlidersHorizontal, fields: options });
    if (extras.length) result.push({ id: "extras", title: "Doplňky", icon: SlidersHorizontal, fields: extras });
    return result;
  }, [fields]);

  const activeStepIndex = Math.max(
    0,
    steps.findIndex((s) => s.id === step),
  );
  const activeStep = steps[activeStepIndex] ?? steps[0];
  const isLastStep = activeStepIndex >= steps.length - 1;
  const isFirstStep = activeStepIndex <= 0;
  const filledCount = Object.values(values).filter((v) => v.trim() !== "").length;
  const totalCount = Object.keys(values).length;
  const dimensionFields = useMemo(() => fields.filter(isDimensionField), [fields]);
  const colorFields = useMemo(() => fields.filter(isColorField), [fields]);
  const saveConfigMailto = useMemo(() => {
    const lines = fields.map((field) => {
      const value = (values[field.label] ?? "").trim() || "neuvedeno";
      return `- ${field.label}: ${value}`;
    });
    const fallbackPath = `/produkty/${productId}`;
    const productUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `https://qapi.cz${fallbackPath}`;
    const subject = `Rozpracovaná konfigurace – ${productName}`;
    const body = [
      "Dobrý den,",
      "",
      "prosím o nezávaznou konzultaci k této rozpracované konfiguraci:",
      "",
      ...lines,
      "",
      `Odkaz na produkt: ${productUrl}`,
      "",
      "Prosím o zpětné kontaktování na tento e-mail / telefon.",
      "",
      "Děkuji",
    ].join("\n");
    return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [contact.email, fields, productId, productName, values]);

  function getStepInvalidFields(stepFields: ProductConfigField[]): string[] {
    return stepFields
      .map((f) => f.label)
      .filter((label) => (values[label] ?? "").trim() === "");
  }

  function getStepInvalidReason(stepFields: ProductConfigField[]): string | null {
    for (const f of stepFields) {
      const raw = (values[f.label] ?? "").trim();
      if (!raw) return "Prosím vyplňte všechna pole v tomto kroku.";
      if (isDimensionField(f)) {
        const n = parseNumericValue(raw);
        const c = getDimensionConstraint(f);
        if (n === null) return "Prosím zadejte číselnou hodnotu rozměru.";
        if (n < c.absoluteMin || n > c.absoluteMax) {
          return `Rozměr „${f.label}“ musí být v rozmezí ${c.absoluteMin}–${c.absoluteMax} ${c.unit}.`;
        }
      }
    }
    return null;
  }

  function goNext() {
    if (!activeStep) return;
    const reason = getStepInvalidReason(activeStep.fields);
    if (reason) {
      setError(reason);
      const invalid = getStepInvalidFields(activeStep.fields);
      trackEvent("config_step_validation_error", { productId, step: activeStep.id, invalidCount: invalid.length });
      return;
    }
    setError("");
    const next = steps[activeStepIndex + 1];
    if (next) setStep(next.id);
  }

  function goBack() {
    setError("");
    const prev = steps[activeStepIndex - 1];
    if (prev) setStep(prev.id);
  }

  function setFieldValue(label: string, value: string) {
    setValues((prev) => ({ ...prev, [label]: value }));
    const f = fields.find((fi) => fi.label === label);
    if (f && isColorField(f)) {
      trackEvent("config_color_change", { productId, field: label, value });
    }
  }

  function nudgeNumber(label: string, delta: number, field: ProductConfigField) {
    if (isDimensionField(field)) {
      nudgeDimension(label, delta, field);
      return;
    }
    const raw = (values[label] ?? "").trim();
    const current = raw === "" ? 0 : Number(raw);
    const next = Number.isFinite(current) ? Math.max(0, Math.round(current + delta)) : 0;
    setFieldValue(label, String(next));
  }

  function nudgeDimension(label: string, delta: number, field: ProductConfigField) {
    const c = getDimensionConstraint(field);
    const raw = (values[label] ?? "").trim();
    const current = raw === "" ? 0 : Number(raw);
    const base = Number.isFinite(current) ? Math.round(current) : 0;
    const next = Math.min(c.absoluteMax, Math.max(c.absoluteMin, base + delta));
    setFieldValue(label, String(next));
  }

  function handleAddToCart() {
    setIsSubmitting(true);
    const invalidReason = getStepInvalidReason(fields);
    if (invalidReason) {
      setError(invalidReason);
      trackEvent("config_validation_error", { productId });
      setIsSubmitting(false);
      return;
    }

    addItem({
      id: `${productId}-${Date.now()}`,
      name: productName,
      unitPrice,
      quantity: 1,
      config: values,
    });
    trackEvent("add_to_cart", { productId, productName, unitPrice });
    setError("");
    setIsSubmitting(false);
    router.push("/kosik");
  }

  const activeFields = activeStep?.fields ?? fields;
  const showDeltaMicrocopy = activeFields.some((f) => f.optionPriceDeltasCzk);

  return (
    <aside className="relative max-md:pb-28 space-y-5 rounded-2xl border border-black/[0.08] bg-card p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-6 lg:sticky lg:top-24">
      <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-3.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Konverzní box</p>
        <h2 className="font-heading mt-1 text-xl font-semibold">Konfigurace variant</h2>
      </div>
      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-[#fffdf8] to-[#f8f4e8] p-3 text-xs leading-relaxed text-black/75">
        Krok za krokem vyplníte parametry. Finální nacenění vždy potvrzuje technik po zaměření.
        {capacityHint ? (
          <span className="mt-2 block rounded-lg border border-primary/15 bg-white/60 px-2.5 py-2 font-medium text-primary/90">
            {capacityHint}
          </span>
        ) : null}
      </div>
      <div className="rounded-xl border border-black/10 bg-muted/30 px-4 py-3">
        <p className="text-xs text-black/55">Orientační cena od</p>
        <p className="mt-1 text-2xl font-bold text-primary">{unitPrice.toLocaleString("cs-CZ")} Kč</p>
        <p className="mt-1 text-xs text-black/60">Finální cenu potvrzujeme po zaměření technikem.</p>
      </div>
      {colorFields.length ? (
        <div className="rounded-xl border border-black/[0.08] bg-white p-4">
          <div className="flex items-start gap-2">
            <Palette className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.8} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">Náhled odstínu (orientační)</p>
              <p className="mt-0.5 text-xs text-black/55">
                Barvy na monitoru zkreslují — přesný odstín potvrdíme u vzorku nebo při zaměření.
              </p>
              <div className="mt-3 space-y-3">
                {colorFields.map((cf) => {
                  const val = (values[cf.label] ?? "").trim();
                  const hex = val ? resolveColorSwatch(val) ?? "#E5E2DC" : "#E5E2DC";
                  return (
                    <div key={cf.label}>
                      <p className="text-xs font-medium text-black/60">
                        {cf.label}
                        {val ? (
                          <>
                            : <span className="text-foreground">{val}</span>
                          </>
                        ) : null}
                      </p>
                      <div
                        className="relative mt-1.5 h-14 w-full overflow-hidden rounded-lg border border-black/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)]"
                        style={{ backgroundColor: hex }}
                        role="img"
                        aria-label={`Náhled odstínu: ${val || "nevybráno"}`}
                      >
                        <div
                          className="pointer-events-none absolute inset-0 opacity-[0.38]"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(180deg, transparent 0 5px, rgba(0,0,0,0.14) 5px 6px)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-[#fffdf8] to-[#f8f4e8] p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <SwatchBook className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">Chcete ladit barvu „naživo“?</p>
            <p className="mt-1 text-xs leading-relaxed text-black/65">
              Objednejte si kousky lamel / vzorník zdarma. Domluvíme doručení a získáte přesnější představu než z
              obrazovky.
            </p>
            <Link
              href={vzornikHref}
              onClick={() => trackEvent("config_swatches_cta_click", { productId, productName })}
              className="ui-motion mt-3 inline-flex items-center justify-center rounded-xl border border-primary/30 bg-white px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              Poslat vzorník zdarma
            </Link>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-black/[0.08] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">Shrnutí výběru</p>
          <span className="rounded-full border border-black/10 bg-strip px-2 py-0.5 text-[11px] font-semibold text-black/55">
            Vyplněno {filledCount}/{totalCount}
          </span>
        </div>
        <div className="mt-2 grid gap-2 text-xs text-black/70 sm:grid-cols-2">
          {dimensionFields.slice(0, 2).map((f) => (
            <div key={f.label} className="flex items-center justify-between rounded-lg border border-black/5 bg-card px-3 py-2">
              <span className="text-black/55">{f.label}</span>
              <span className="font-semibold text-foreground">{(values[f.label] ?? "").trim() ? `${values[f.label]} mm` : "—"}</span>
            </div>
          ))}
          {colorFields.map((cf) => {
            const cv = (values[cf.label] ?? "").trim();
            const sw = cv ? resolveColorSwatch(cv) : null;
            return (
              <div
                key={cf.label}
                className="flex items-center justify-between rounded-lg border border-black/5 bg-card px-3 py-2 sm:col-span-2"
              >
                <span className="inline-flex items-center gap-2 text-black/55">
                  <Palette className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {cf.label}
                </span>
                <span className="inline-flex items-center gap-2 font-semibold text-foreground">
                  {sw ? (
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/15"
                      style={{ backgroundColor: sw }}
                      aria-hidden
                    />
                  ) : null}
                  {cv || "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid gap-2 rounded-xl border border-black/10 bg-white p-3 text-xs text-black/70">
        <p className="font-semibold text-foreground/90">Co se děje po odeslání konfigurace</p>
        <p>1) Zkontrolujeme zadané parametry a kontaktujeme vás.</p>
        <p>2) Domluvíme zaměření a technické ověření na místě.</p>
        <p>3) Potvrdíme finální cenu a termín realizace.</p>
      </div>
      {error ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      ) : null}
      {steps.length > 1 ? (
        <div className="rounded-xl border border-black/[0.08] bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-black/55">
              Krok {activeStepIndex + 1} / {steps.length}
            </p>
            <div className="flex items-center gap-1.5">
              {steps.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-1.5 w-7 rounded-full ${
                    i === activeStepIndex ? "bg-accent" : i < activeStepIndex ? "bg-primary/30" : "bg-black/10"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            {activeStep ? (
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <activeStep.icon className="h-4.5 w-4.5" strokeWidth={1.9} />
              </span>
            ) : null}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary">{activeStep?.title ?? "Konfigurace"}</p>
              {activeStep?.id === "dimensions" ? (
                <div className="space-y-1">
                  <Link
                    href="/jak-probiha-objednavka"
                    className="ui-motion inline-flex items-center gap-1 text-xs font-semibold text-primary/90 hover:underline"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    Jak správně zaměřit?
                  </Link>
                  <p className="text-xs text-black/55">
                    Pojistka: než zadáme zakázku do výroby, technik hodnoty zkontroluje a když něco nesedí, ozve se.
                  </p>
                  <div className="mt-2 rounded-lg border border-black/[0.08] bg-card px-3 py-2 text-xs text-black/70">
                    <p className="font-semibold text-foreground/90">Zasekli jste se u rozměrů?</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <a
                        href={contact.phoneHref}
                        className="ui-motion inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {contact.phoneRaw}
                      </a>
                      <a
                        href={`mailto:${contact.email}`}
                        className="ui-motion inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-black/55">Vyplňte jen to, co právě řešíte.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {showDeltaMicrocopy ? (
        <p className="text-xs leading-relaxed text-black/55">
          U příplatkových variantách uvádíme orientační doplatek (+ Kč) k základní konfiguraci, aby bylo snazší porovnat rozdíly mezi
          úrovněmi. Přesnou částku vždy stvrdíme v závazné nabídce po zaměření.
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {activeFields.map((field, fieldIndex) => (
          <label key={field.label} className="flex flex-col gap-2 text-sm">
            <span className="flex items-center justify-between gap-2 font-medium">
              <span>{field.label}</span>
              {isDimensionField(field) ? (
                <span className="text-xs font-semibold text-black/45">
                  {getDimensionConstraint(field).unit}
                </span>
              ) : null}
            </span>
            {isDimensionField(field) ? (
              <p className="text-xs leading-relaxed text-black/55">{getDimensionMicrocopy(field)}</p>
            ) : null}
            {field.type === "select" ? (
              <>
                <select
                  className="rounded-md border border-black/20 px-3 py-2 outline-none focus:border-primary"
                  value={values[field.label] ?? ""}
                  onChange={(event) => setFieldValue(field.label, event.target.value)}
                  aria-describedby={
                    field.recommendedOption ? `recommended-hint-${fieldIndex}` : undefined
                  }
                >
                  {(field.options ?? []).map((option) => (
                    <option key={option} value={option}>
                      {formatSelectOptionLabel(option, field)}
                    </option>
                  ))}
                </select>
                {field.recommendedOption && (field.options ?? []).includes(field.recommendedOption) ? (
                  <p
                    id={`recommended-hint-${fieldIndex}`}
                    className="text-xs leading-relaxed text-primary/95"
                  >
                    <span className="font-semibold text-primary">Doporučená volba:</span> {field.recommendedOption} — typická
                    „zlatá střední cesta“ mezi cenou a komfortem; přesný doplatek stvrdíme v nabídce po zaměření.
                  </p>
                ) : null}
              </>
            ) : (
              <div className="grid grid-cols-[44px_1fr_44px] items-center gap-2">
                <button
                  type="button"
                  aria-label={`Snížit hodnotu ${field.label}`}
                  onClick={() => nudgeNumber(field.label, -10, field)}
                  className="ui-motion inline-flex h-11 w-11 items-center justify-center rounded-lg border border-black/[0.12] bg-white text-foreground hover:border-primary/30 hover:text-primary"
                >
                  <Minus className="h-4 w-4" strokeWidth={2} />
                </button>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder={field.placeholder}
                    className="h-11 w-full rounded-md border border-black/20 px-3 py-2 pr-12 outline-none focus:border-primary"
                    value={values[field.label] ?? ""}
                    onChange={(event) => setFieldValue(field.label, event.target.value)}
                  />
                  {isDimensionField(field) ? (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-black/45">
                      mm
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  aria-label={`Zvýšit hodnotu ${field.label}`}
                  onClick={() => nudgeNumber(field.label, 10, field)}
                  className="ui-motion inline-flex h-11 w-11 items-center justify-center rounded-lg border border-black/[0.12] bg-white text-foreground hover:border-primary/30 hover:text-primary"
                >
                  <Plus className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            )}
            {isDimensionField(field) ? (
              <div className="flex flex-wrap gap-2">
                {[
                  { delta: -100, label: "−100" },
                  { delta: -50, label: "−50" },
                  { delta: 50, label: "+50" },
                  { delta: 100, label: "+100" },
                ].map(({ delta, label: lbl }) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => nudgeDimension(field.label, delta, field)}
                    className="ui-motion min-h-[40px] min-w-[3.25rem] rounded-lg border border-black/[0.1] bg-white px-2.5 py-2 text-xs font-semibold text-foreground hover:border-primary/30 hover:text-primary sm:min-h-[44px]"
                  >
                    {lbl} mm
                  </button>
                ))}
              </div>
            ) : null}
            {isDimensionField(field) ? (
              (() => {
                const raw = (values[field.label] ?? "").trim();
                const n = parseNumericValue(raw);
                const c = getDimensionConstraint(field);
                if (!raw) return <p className="text-xs text-black/50">Zadejte rozměr v milimetrech.</p>;
                if (n === null) return <p className="text-xs text-red-700">Zadejte číselnou hodnotu.</p>;
                if (n < c.absoluteMin || n > c.absoluteMax)
                  return (
                    <p className="text-xs text-red-700">
                      Povolený rozsah je {c.absoluteMin}–{c.absoluteMax} {c.unit}.
                    </p>
                  );
                if (n < c.typicalMin || n > c.typicalMax)
                  return (
                    <p className="text-xs text-black/55">
                      Mimo běžný rozsah ({c.typicalMin}–{c.typicalMax} {c.unit}). Pokud je to záměr, můžete pokračovat.
                    </p>
                  );
                return <p className="text-xs text-black/50">Běžný rozsah {c.typicalMin}–{c.typicalMax} {c.unit}.</p>;
              })()
            ) : null}
          </label>
        ))}
      </div>

      {steps.length > 1 ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={goBack}
            disabled={isFirstStep}
            className="ui-motion inline-flex items-center justify-center gap-2 rounded-xl border border-black/[0.1] bg-white px-4 py-3 text-sm font-semibold text-foreground/85 hover:border-primary/30 hover:text-primary disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Zpět
          </button>
          {isLastStep ? (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-accent px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-foreground disabled:opacity-60"
            >
              {isSubmitting ? "Přidávám…" : "Přidat do košíku"}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="ui-motion inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-foreground"
            >
              Pokračovat
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isSubmitting}
          className="w-full rounded-xl bg-accent px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-foreground disabled:opacity-60"
        >
          {isSubmitting ? "Přidávám…" : "Přidat do košíku"}
        </button>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        <Link
          href={inquiryHref}
          onClick={() => trackEvent("config_soft_conversion_inquiry_click", { productId })}
          className="ui-motion inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10"
        >
          Nezávazná poptávka
        </Link>
        <a
          href={saveConfigMailto}
          onClick={() => trackEvent("config_save_to_email_click", { productId })}
          className="ui-motion inline-flex items-center justify-center gap-2 rounded-xl border border-black/[0.12] bg-white px-4 py-3 text-sm font-semibold text-foreground/90 hover:border-primary/30 hover:text-primary"
        >
          <Mail className="h-4 w-4" />
          Uložit konfiguraci na e-mail
        </a>
      </div>
      <p className="text-xs text-black/60">Bez rizika: při technické nerealizovatelnosti vracíme zálohu.</p>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden">
        <div className="pointer-events-auto border-t border-black/10 bg-white/95 px-4 pt-2 shadow-[0_-8px_28px_rgba(0,0,0,0.08)] backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className={`grid gap-2 ${steps.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {steps.length > 1 ? (
              <button
                type="button"
                onClick={goBack}
                disabled={isFirstStep}
                className="ui-motion inline-flex items-center justify-center gap-1.5 rounded-xl border border-black/[0.1] bg-white px-3 py-3 text-sm font-semibold text-foreground/85 hover:border-primary/30 hover:text-primary disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Zpět
              </button>
            ) : null}
            {isLastStep ? (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSubmitting}
                className="rounded-xl bg-accent px-3 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-foreground disabled:opacity-60"
              >
                {isSubmitting ? "Přidávám…" : "Přidat do košíku"}
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="ui-motion inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-3 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-foreground"
              >
                Pokračovat
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
