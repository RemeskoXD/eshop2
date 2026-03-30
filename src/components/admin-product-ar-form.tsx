"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { productDetailHref } from "@/lib/storefront-paths";

type AdminProductArFormProps = {
  productId: string;
  productName: string;
  productSlug: string;
  categoryTitle: string;
  initialGlbUrl: string | null;
  initialUsdzUrl: string | null;
  arReady: boolean;
  /** Role support — pouze čtení a test URL, bez uložení. */
  readOnly?: boolean;
};

export default function AdminProductArForm({
  productId,
  productName,
  productSlug,
  categoryTitle,
  initialGlbUrl,
  initialUsdzUrl,
  arReady,
  readOnly = false,
}: AdminProductArFormProps) {
  const router = useRouter();
  const [glbUrl, setGlbUrl] = useState(initialGlbUrl ?? "");
  const [usdzUrl, setUsdzUrl] = useState(initialUsdzUrl ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testMessage, setTestMessage] = useState("");

  async function onSave() {
    setIsSaving(true);
    setError("");
    setMessage("");
    const response = await fetch(`/api/admin/products/${productId}/ar`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        arModelGlbUrl: glbUrl,
        arModelUsdzUrl: usdzUrl,
      }),
    });

    if (response.status === 403) {
      setError("Nemáte oprávnění měnit AR URL (potřeba role manager nebo owner).");
      setIsSaving(false);
      return;
    }

    if (!response.ok) {
      setError("Nepodařilo se uložit AR model URL.");
      setIsSaving(false);
      return;
    }

    setMessage("Uloženo.");
    setIsSaving(false);
    router.refresh();
  }

  async function onTest() {
    setIsTesting(true);
    setError("");
    setMessage("");
    setTestMessage("");
    const response = await fetch("/api/admin/products/validate-ar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ glbUrl, usdzUrl }),
    });
    const result = (await response.json()) as {
      ok: boolean;
      error?: string;
      glbReachable?: boolean;
      usdzReachable?: boolean;
    };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "Validace AR modelů selhala.");
      setIsTesting(false);
      return;
    }

    setTestMessage(
      `Kontrola dostupnosti: GLB ${result.glbReachable ? "v pořádku" : "chyba"}, USDZ ${result.usdzReachable ? "v pořádku" : "chyba"}`,
    );
    setIsTesting(false);
  }

  return (
    <article className="rounded-xl border border-black/10 p-4">
      <h3 className="text-base font-semibold">{productName}</h3>
      <p className="text-xs text-black/60">Slug: {productSlug}</p>
      <p className="text-xs text-black/60">Kategorie: {categoryTitle}</p>
      <p className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-semibold ${arReady ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
        {arReady ? "AR připraveno" : "Chybí AR model"}
      </p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <a
          href={productDetailHref(productSlug)}
          target="_blank"
          rel="noreferrer"
          className="rounded border border-black/15 px-2 py-1 hover:border-primary"
        >
          Otevřít produkt
        </a>
        {glbUrl ? (
          <a
            href={glbUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded border border-black/15 px-2 py-1 hover:border-primary"
          >
            Otevřít GLB
          </a>
        ) : null}
        {usdzUrl ? (
          <a
            href={usdzUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded border border-black/15 px-2 py-1 hover:border-primary"
          >
            Otevřít USDZ
          </a>
        ) : null}
      </div>
      {readOnly ? (
        <p className="mt-2 text-xs text-amber-800">
          Vaše role může měnit URL jen po přiřazení oprávnění manager/owner.
        </p>
      ) : null}
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium">GLB URL</span>
          <input
            value={glbUrl}
            onChange={(event) => setGlbUrl(event.target.value)}
            readOnly={readOnly}
            placeholder={`/models/${productSlug}.glb`}
            className="w-full rounded-md border border-black/20 px-3 py-2 read-only:bg-black/5"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">USDZ URL</span>
          <input
            value={usdzUrl}
            onChange={(event) => setUsdzUrl(event.target.value)}
            readOnly={readOnly}
            placeholder={`/models/${productSlug}.usdz`}
            className="w-full rounded-md border border-black/20 px-3 py-2 read-only:bg-black/5"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving || readOnly}
        className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSaving ? "Ukládám..." : "Uložit AR URL"}
      </button>
      <button
        type="button"
        onClick={onTest}
        disabled={isTesting}
        className="ml-2 mt-3 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary disabled:opacity-60"
      >
        {isTesting ? "Testuji…" : "Otestovat URL"}
      </button>
      {message ? <p className="mt-2 text-sm font-medium text-green-700">{message}</p> : null}
      {testMessage ? <p className="mt-2 text-sm font-medium text-green-700">{testMessage}</p> : null}
      {error ? <p className="mt-2 text-sm font-medium text-red-600">{error}</p> : null}
    </article>
  );
}
