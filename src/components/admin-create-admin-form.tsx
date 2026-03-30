"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ADMIN_ROLE_OPTIONS } from "@/lib/admin-team-constants";

const ROLE_LABELS: Record<string, string> = {
  owner: "Vlastník",
  manager: "Manažer",
  support: "Podpora",
};

export default function AdminCreateAdminForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [generatePassword, setGeneratePassword] = useState(true);
  const [roles, setRoles] = useState<string[]>(["support"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  function toggleRole(code: string) {
    setRoles((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setGeneratedPassword(null);
    setLoading(true);

    const response = await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        fullName,
        password: generatePassword ? undefined : password,
        generatePassword,
        roles,
      }),
    });

    const data = (await response.json().catch(() => null)) as {
      error?: string;
      generatedPassword?: string;
    } | null;

    if (!response.ok) {
      setError(data?.error ?? "Vytvoření účtu se nezdařilo.");
      setLoading(false);
      return;
    }

    if (data?.generatedPassword) {
      setGeneratedPassword(data.generatedPassword);
    }

    setEmail("");
    setFullName("");
    setPassword("");
    setRoles(["support"]);
    setLoading(false);
    router.refresh();
  }

  return (
    <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Nový administrátor</h2>
      <p className="mt-1 text-xs text-black/60">
        Pouze role <strong>owner</strong>. Heslo se zobrazí jen jednou — uložte ho nebo pošlete uživateli.
      </p>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-black/70" htmlFor="new-admin-email">
            E-mail (přihlašovací)
          </label>
          <input
            id="new-admin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-black/70" htmlFor="new-admin-name">
            Jméno
          </label>
          <input
            id="new-admin-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Např. Jana Nováková"
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={generatePassword}
            onChange={(e) => setGeneratePassword(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Vygenerovat bezpečné heslo
        </label>

        {!generatePassword ? (
          <div>
            <label className="text-xs font-medium text-black/70" htmlFor="new-admin-pass">
              Heslo (min. 8 znaků)
            </label>
            <input
              id="new-admin-pass"
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
              autoComplete="new-password"
            />
          </div>
        ) : null}

        <div>
          <p className="text-xs font-medium text-black/70">Počáteční role</p>
          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            {ADMIN_ROLE_OPTIONS.map((code) => (
              <label key={code} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={roles.includes(code)}
                  onChange={() => toggleRole(code)}
                  className="h-4 w-4 accent-primary"
                />
                {ROLE_LABELS[code] ?? code}
              </label>
            ))}
          </div>
        </div>

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
        {generatedPassword ? (
          <div className="rounded-lg border border-primary/40 bg-[#fffdf6] p-3 text-sm">
            <p className="font-semibold text-black">Dočasné heslo (zkopírujte hned):</p>
            <p className="mt-2 break-all font-mono text-base">{generatedPassword}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Vytvářím…" : "Vytvořit účet"}
        </button>
      </form>
    </section>
  );
}
