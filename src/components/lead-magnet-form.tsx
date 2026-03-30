"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Download, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type LeadMagnetFormProps = {
  source: string;
};

export default function LeadMagnetForm({ source }: LeadMagnetFormProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!consent) {
      setError("Potvrďte prosím souhlas se zpracováním údajů.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, consent, source, website }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Odeslání se nepodařilo.");
        return;
      }
      setOk(true);
      trackEvent("lead_magnet_submitted", { source });
    } catch {
      setError("Odeslání se nepodařilo. Zkuste to prosím znovu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (ok) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-black/75">
        <p className="font-semibold text-foreground">Hotovo, checklist jsme poslali na váš e-mail.</p>
        <p className="mt-1">
          Pokud chcete, můžete hned pokračovat na{" "}
          <Link href="/#kategorie" className="font-semibold text-primary hover:underline">
            konfigurátor produktů
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-foreground">E-mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-black/[0.12] bg-white px-3 py-2.5 outline-none focus:border-primary/35"
            placeholder="např. jana@firma.cz"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-foreground">Telefon (volitelně)</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-black/[0.12] bg-white px-3 py-2.5 outline-none focus:border-primary/35"
            placeholder="+420 777 123 456"
          />
        </label>
      </div>
      <label className="hidden">
        Web
        <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </label>
      <label className="flex items-start gap-2 text-xs text-black/65">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-black/20"
        />
        <span>
          Souhlasím se{" "}
          <Link href="/ochrana-osobnich-udaju" className="font-semibold text-primary hover:underline">
            zpracováním osobních údajů
          </Link>{" "}
          pro účely odpovědi na poptávku.
        </span>
      </label>
      {error ? <p className="text-xs font-medium text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-foreground disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Poslat checklist do e-mailu
      </button>
    </form>
  );
}
