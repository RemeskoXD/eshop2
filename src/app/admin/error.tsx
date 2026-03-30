"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminError({
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
    <div className="mx-auto max-w-lg px-4 py-12 text-center">
      <AlertTriangle className="mx-auto h-10 w-10 text-amber-600" strokeWidth={1.75} />
      <h1 className="mt-4 text-lg font-semibold text-black">Chyba v administraci</h1>
      <p className="mt-2 text-sm text-black/65">{error.message || "Neočekávaná chyba."}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/85"
        >
          <RefreshCw className="mr-1.5 inline h-3.5 w-3.5 align-text-bottom" strokeWidth={2} />
          Znovu
        </button>
        <Link href="/admin/objednavky" className="rounded-lg border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5">
          Objednávky
        </Link>
      </div>
    </div>
  );
}
