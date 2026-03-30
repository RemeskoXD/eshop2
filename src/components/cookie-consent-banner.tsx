"use client";

import Link from "next/link";
import { Cookie } from "lucide-react";
import { useReducer, useSyncExternalStore } from "react";
import { trackEvent } from "@/lib/analytics";

const STORAGE_KEY = "qapi_cookie_consent_v1";

const emptySubscribe = () => () => {};

export default function CookieConsentBanner() {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [, forceRerender] = useReducer((n: number) => n + 1, 0);

  if (!isClient) {
    return null;
  }

  try {
    if (window.localStorage.getItem(STORAGE_KEY)) {
      return null;
    }
  } catch {
    /* zobrazíme lištu i při chybě úložiště */
  }

  function accept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      /* ignore */
    }
    trackEvent("cookie_consent_accept");
    forceRerender();
  }

  function reject() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "essential_only");
    } catch {
      /* ignore */
    }
    trackEvent("cookie_consent_essential_only");
    forceRerender();
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/[0.08] bg-white/98 p-4 shadow-[0_-12px_40px_rgba(0,0,0,0.1)] backdrop-blur-md md:p-5"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-3 text-sm text-black/80 md:items-start">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Cookie className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div>
          <p className="font-semibold text-primary">Cookies a soukromí</p>
          <p className="mt-1">
            Používáme nezbytné soubory pro chod e-shopu a měření základních událostí. Více v{" "}
            <Link href="/cookies" className="font-medium text-primary underline-offset-2 hover:underline">
              zásadách cookies
            </Link>{" "}
            a v{" "}
            <Link
              href="/ochrana-osobnich-udaju"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              ochraně osobních údajů
            </Link>
            .
          </p>
          </div>
        </div>
        <div className="flex flex-shrink-0 flex-wrap gap-2 md:justify-end">
          <button
            type="button"
            onClick={reject}
            className="rounded-xl border border-black/[0.12] bg-white px-4 py-2.5 text-sm font-semibold text-black/80 transition hover:bg-black/[0.04]"
          >
            Jen nezbytné
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-foreground"
          >
            Souhlasím
          </button>
        </div>
      </div>
    </div>
  );
}
