"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ADMIN_ROLE_OPTIONS } from "@/lib/admin-team-constants";

const ROLE_LABELS: Record<string, string> = {
  owner: "Vlastník",
  manager: "Manažer",
  support: "Podpora",
};

type AdminTeamRolesFormProps = {
  userId: string;
  initialRoles: string[];
  readOnly: boolean;
};

export default function AdminTeamRolesForm({
  userId,
  initialRoles,
  readOnly,
}: AdminTeamRolesFormProps) {
  const router = useRouter();
  const [roles, setRoles] = useState<string[]>(initialRoles);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setRoles(initialRoles);
  }, [initialRoles]);

  function toggle(code: string) {
    setRoles((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    setError("");
    const response = await fetch(`/api/admin/team/${userId}/roles`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ roles }),
    });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (response.status === 403) {
      setError("Změnu rolí může provést jen role owner.");
      setSaving(false);
      return;
    }

    if (!response.ok) {
      setError(data?.error ?? "Uložení se nezdařilo.");
      setSaving(false);
      return;
    }

    setMessage("Role uloženy.");
    setSaving(false);
    router.refresh();
  }

  if (readOnly) {
    return (
      <p className="text-xs text-black/65">
        {initialRoles.length > 0
          ? initialRoles.map((c) => ROLE_LABELS[c] ?? c).join(", ")
          : "Žádné přiřazené role (v systému jako podpora)."}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3 text-sm">
        {ADMIN_ROLE_OPTIONS.map((code) => (
          <label key={code} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={roles.includes(code)}
              onChange={() => toggle(code)}
              className="h-4 w-4 accent-primary"
            />
            <span>{ROLE_LABELS[code] ?? code}</span>
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={() => void save()}
        disabled={saving}
        className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Ukládám…" : "Uložit role"}
      </button>
      {message ? <p className="text-xs font-medium text-green-700">{message}</p> : null}
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
