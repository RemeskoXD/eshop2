import type { Metadata } from "next";
import Link from "next/link";
import { Home, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Stránka nenalezena | QAPI",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-strip px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">404</p>
      <h1 className="font-heading mt-3 max-w-lg text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
        Tuto stránku jsme nenašli
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-black/65">
        Adresa mohla být přepsána, nebo produkt už není v nabídce. Zkuste úvod, vyhledávání v hlavičce nebo sortiment.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-foreground"
        >
          <Home className="h-4 w-4" strokeWidth={2} />
          Hlavní stránka
        </Link>
        <Link
          href="/#kategorie"
          className="inline-flex items-center gap-2 rounded-xl border border-black/[0.12] bg-card px-5 py-3 text-sm font-semibold text-foreground/90 transition hover:border-primary/30"
        >
          <Search className="h-4 w-4" strokeWidth={2} />
          Sortiment
        </Link>
        <Link
          href="/kontakt"
          className="inline-flex items-center rounded-xl border border-black/[0.08] bg-white px-5 py-3 text-sm font-semibold text-foreground/85 transition hover:bg-black/[0.02]"
        >
          Kontakt
        </Link>
      </div>
    </main>
  );
}
