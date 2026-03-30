"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-strip px-4 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-800">
        <AlertTriangle className="h-7 w-7" strokeWidth={1.75} />
      </span>
      <h1 className="font-heading mt-6 text-2xl font-semibold text-primary sm:text-3xl">Něco se pokazilo</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-black/65">
        Zkuste stránku znovu načíst. Pokud problém přetrvává, napište nám prosím s časem a stránkou, kde k tomu došlo.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-[10px] text-black/35">Kód: {error.digest}</p>
      ) : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-foreground"
        >
          <RefreshCw className="h-4 w-4" strokeWidth={2} />
          Zkusit znovu
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-black/[0.12] bg-card px-5 py-3 text-sm font-semibold text-foreground/90 transition hover:border-primary/30"
        >
          <Home className="h-4 w-4" strokeWidth={2} />
          Hlavní stránka
        </Link>
      </div>
    </main>
  );
}
