"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminOrderStatusFormProps = {
  orderId: string;
  currentStatus: string;
  statusOptions: Array<{ code: string; label: string }>;
};

export default function AdminOrderStatusForm({
  orderId,
  currentStatus,
  statusOptions,
}: AdminOrderStatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note }),
    });

    if (!response.ok) {
      setError("Uložení změny stavu se nepodařilo.");
      setIsSaving(false);
      return;
    }

    setMessage("Stav objednávky byl uložen.");
    setIsSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-black/10 p-4">
      <h2 className="text-lg font-semibold">Změna stavu objednávky</h2>
      <select
        className="w-full rounded-md border border-black/20 px-3 py-2"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        {statusOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label} ({option.code})
          </option>
        ))}
      </select>
      <textarea
        className="w-full rounded-md border border-black/20 px-3 py-2"
        rows={3}
        placeholder="Poznámka ke změně stavu (volitelné)"
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
      <button
        disabled={isSaving}
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSaving ? "Ukládám…" : "Uložit stav"}
      </button>
      {message ? <p className="text-sm font-medium text-green-700">{message}</p> : null}
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </form>
  );
}
