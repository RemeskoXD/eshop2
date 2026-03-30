"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AdminArBulkToolsProps = {
  allowExport?: boolean;
  allowImport?: boolean;
};

export default function AdminArBulkTools({
  allowExport = true,
  allowImport = true,
}: AdminArBulkToolsProps) {
  const router = useRouter();
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onImportChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setMessage("");
    setError("");

    const text = await file.text();
    const response = await fetch("/api/admin/products/ar-import", {
      method: "POST",
      headers: { "Content-Type": "text/csv" },
      body: text,
    });
    const result = (await response.json()) as { ok?: boolean; updated?: number; error?: string };

    if (response.status === 403) {
      setError("Nemáte oprávnění importovat CSV (role manager nebo owner).");
      setIsImporting(false);
      return;
    }

    if (!response.ok || !result.ok) {
      setError(result.error ?? "Import CSV selhal.");
      setIsImporting(false);
      return;
    }

    setMessage(`Import hotov. Aktualizováno: ${result.updated ?? 0} produktů.`);
    setIsImporting(false);
    router.refresh();
  }

  if (!allowExport && !allowImport) {
    return (
      <section className="mt-6 rounded-xl border border-amber-200 bg-[#fffdf6] p-4 text-sm text-black/75">
        <h2 className="text-lg font-semibold text-black">Hromadná správa AR (CSV)</h2>
        <p className="mt-2">
          Export a import CSV je dostupný rolím <strong>manager</strong> a <strong>owner</strong>.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-xl border border-black/10 p-4">
      <h2 className="text-lg font-semibold">Hromadná správa AR (CSV)</h2>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {allowExport ? (
          <a
            href="/api/admin/products/ar-export"
            className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary"
          >
            Stáhnout CSV export
          </a>
        ) : null}
        {allowImport ? (
          <label className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">
            {isImporting ? "Importuji…" : "Nahrát CSV import"}
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={onImportChange}
              className="hidden"
              disabled={isImporting}
            />
          </label>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-black/60">
        Formát: slug,arModelGlbUrl,arModelUsdzUrl
      </p>
      {message ? <p className="mt-2 text-sm font-medium text-green-700">{message}</p> : null}
      {error ? <p className="mt-2 text-sm font-medium text-red-600">{error}</p> : null}
    </section>
  );
}
