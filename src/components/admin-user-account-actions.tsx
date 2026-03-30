"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminUserAccountActionsProps = {
  userId: string;
  email: string;
  isActive: boolean;
  isSelf: boolean;
  readOnly: boolean;
};

export default function AdminUserAccountActions({
  userId,
  email,
  isActive,
  isSelf,
  readOnly,
}: AdminUserAccountActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [showManualReset, setShowManualReset] = useState(false);
  const [manualPassword, setManualPassword] = useState("");

  async function patchJson(body: object): Promise<{ ok: boolean; error?: string; generatedPassword?: string }> {
    const res = await fetch(`/api/admin/team/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => null)) as {
      error?: string;
      generatedPassword?: string;
    } | null;
    if (!res.ok) {
      return { ok: false, error: data?.error ?? "Požadavek selhal." };
    }
    return { ok: true, generatedPassword: data?.generatedPassword };
  }

  async function toggleActive() {
    if (readOnly) return;
    const next = !isActive;
    if (!next && isSelf) {
      setError("Vlastní účet nelze deaktivovat.");
      return;
    }
    if (!next && !confirm(`Deaktivovat účet ${email}? Uživatel se nebude moci přihlásit.`)) {
      return;
    }
    setBusy(true);
    setError("");
    setGeneratedPassword(null);
    const r = await patchJson({ isActive: next });
    setBusy(false);
    if (!r.ok) {
      setError(r.error ?? "");
      return;
    }
    router.refresh();
  }

  async function generateNewPassword() {
    if (readOnly) return;
    if (!confirm(`Vygenerovat nové heslo pro ${email}? Staré heslo přestane platit.`)) return;
    setBusy(true);
    setError("");
    setGeneratedPassword(null);
    const r = await patchJson({ generatePassword: true });
    setBusy(false);
    if (!r.ok) {
      setError(r.error ?? "");
      return;
    }
    if (r.generatedPassword) {
      setGeneratedPassword(r.generatedPassword);
    }
    router.refresh();
  }

  async function saveManualPassword() {
    if (readOnly || manualPassword.length < 8) {
      setError("Heslo musí mít alespoň 8 znaků.");
      return;
    }
    if (!confirm(`Nastavit nové heslo pro ${email}?`)) return;
    setBusy(true);
    setError("");
    setGeneratedPassword(null);
    const r = await patchJson({ newPassword: manualPassword });
    setBusy(false);
    if (!r.ok) {
      setError(r.error ?? "");
      return;
    }
    setManualPassword("");
    setShowManualReset(false);
    router.refresh();
  }

  if (readOnly) {
    return (
      <p className="text-xs text-black/60">
        Účet: {isActive ? <span className="text-green-700">aktivní</span> : <span className="text-amber-800">neaktivní</span>}
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-black/10 bg-muted/50 p-3 text-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-black/50">Účet</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            isActive ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-900"
          }`}
        >
          {isActive ? "Aktivní" : "Neaktivní"}
        </span>
        <button
          type="button"
          disabled={busy || (!isActive ? false : isSelf)}
          onClick={() => void toggleActive()}
          className="rounded-md border border-black/15 bg-white px-2 py-1 text-xs font-medium hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
          title={isSelf && isActive ? "Vlastní účet nelze deaktivovat" : undefined}
        >
          {isActive ? "Deaktivovat" : "Aktivovat"}
        </button>
      </div>
      {isSelf && isActive ? (
        <p className="mt-1 text-xs text-black/50">Vlastní účet nelze deaktivovat.</p>
      ) : null}

      <div className="mt-3 border-t border-black/10 pt-3">
        <p className="text-xs font-medium text-black/60">Reset hesla</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void generateNewPassword()}
            className="rounded-md bg-primary px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
            title={!isActive ? "Účet je neaktivní — po nastavení hesla ho můžete aktivovat." : undefined}
          >
            Vygenerovat heslo
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => setShowManualReset((v) => !v)}
            className="rounded-md border border-black/15 bg-white px-2 py-1 text-xs font-medium disabled:opacity-50"
          >
            {showManualReset ? "Zrušit" : "Nastavit heslo ručně"}
          </button>
        </div>
        {showManualReset ? (
          <div className="mt-2 flex flex-wrap items-end gap-2">
            <input
              type="password"
              value={manualPassword}
              onChange={(e) => setManualPassword(e.target.value)}
              placeholder="Min. 8 znaků"
              className="min-w-[180px] rounded border border-black/15 px-2 py-1 text-xs"
              autoComplete="new-password"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => void saveManualPassword()}
              className="rounded-md border border-primary px-2 py-1 text-xs font-semibold text-primary disabled:opacity-50"
            >
              Uložit heslo
            </button>
          </div>
        ) : null}
        {generatedPassword ? (
          <div className="mt-2 rounded border border-primary/40 bg-[#fffdf6] p-2 text-xs">
            <p className="font-semibold">Nové heslo (uložte / předejte uživateli):</p>
            <p className="mt-1 break-all font-mono">{generatedPassword}</p>
          </div>
        ) : null}
        {error ? <p className="mt-2 text-xs font-medium text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
