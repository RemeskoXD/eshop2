import React from "react";
import ModelViewerFrame from "@/components/model-viewer-frame";

type ProductSubpageSkeletonProps = {
  title: string;
  description: string;
  model3dUrl: string;
  specs: Record<string, string>;
};

/**
 * Standalone product subpage skeleton.
 * Props-based API is prepared for easy CMS wiring.
 */
export default function ProductSubpageSkeleton({
  title,
  description,
  model3dUrl,
  specs,
}: ProductSubpageSkeletonProps) {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-8 lg:grid-cols-2">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Demo produktu</p>
        <h1 className="font-heading text-3xl font-semibold text-primary sm:text-4xl">{title}</h1>
        <p className="text-sm leading-relaxed text-black/75 sm:text-base">{description}</p>

        <div className="overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-b from-[#f6f9fd] to-white shadow-[0_14px_38px_rgba(20,33,47,0.14)]">
          <div className="flex items-center justify-between border-b border-black/8 px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-[0.11em] text-primary">Náhled 3D/AR</p>
            <span className="rounded-full border border-black/10 bg-white px-2 py-0.5 text-[11px] font-semibold text-black/55">
              Tahem otočte model
            </span>
          </div>
          <ModelViewerFrame src={model3dUrl} alt={title} height={420} />
        </div>
      </section>

      <aside className="h-fit rounded-2xl border border-black/10 bg-card p-6 shadow-sm lg:sticky lg:top-24">
        <h2 className="text-xl font-semibold text-primary">Specifikace</h2>
        <dl className="mt-4 grid gap-2 text-sm">
          {Object.entries(specs).map(([label, value]) => (
            <div key={label} className="grid grid-cols-[1fr_auto] gap-3 border-b border-black/5 pb-2 last:border-0">
              <dt className="text-black/55">{label}</dt>
              <dd className="font-medium text-black/85">{value}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          className="mt-6 w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-foreground"
        >
          Přidat do košíku
        </button>
      </aside>
    </main>
  );
}
