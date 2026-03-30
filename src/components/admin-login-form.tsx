"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";

function sanitizeNext(next: string | undefined): string {
  if (!next || !next.startsWith("/admin")) return "/admin/objednavky";
  if (next.startsWith("//") || next.includes(":") || next.includes("..")) return "/admin/objednavky";
  return next;
}

export default function AdminLoginForm({ defaultNext }: { defaultNext: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) setError(err);
  }, [searchParams]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = event.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");

    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Přihlášení se nezdařilo.");
      setLoading(false);
      return;
    }

    router.push(sanitizeNext(defaultNext));
    router.refresh();
  }

  return (
    <form action="/api/admin/auth/login" method="POST" onSubmit={onSubmit} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={defaultNext} />
      <div>
        <label className="text-xs font-medium text-black/70" htmlFor="admin-email">
          E-mail
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-black/70" htmlFor="admin-password">
          Heslo
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
        />
      </div>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-foreground disabled:opacity-60"
      >
        {loading ? "Přihlašuji…" : "Přihlásit se"}
      </button>
      <p className="text-xs text-black/50">
        Tip: použijte účet z tabulky <code className="rounded bg-black/5 px-1">AdminUser</code> (bcrypt) nebo
        přihlašovací údaje z <code className="rounded bg-black/5 px-1">ADMIN_EMAIL</code> /{" "}
        <code className="rounded bg-black/5 px-1">ADMIN_BASIC_*</code> v prostředí.
      </p>
      <p className="text-xs text-amber-600 font-medium mt-2">
        Upozornění: Pokud se přihlášení nedaří (stránka se neustále vrací na přihlášení), může to být způsobeno blokováním cookies třetích stran ve vašem prohlížeči (časté v Safari nebo anonymním okně). V takovém případě si aplikaci otevřete v novém panelu.
      </p>
    </form>
  );
}
