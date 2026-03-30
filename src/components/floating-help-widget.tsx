"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Headphones, Mail, Phone, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { getPublicContactInfo } from "@/lib/contact";

/**
 * Desktop FAB: rychlá pomoc (telefon + kontakt) bez externího chatu.
 * Mobil necháváme čistý — už je sticky CTA v SiteChrome a telefon v hlavičce.
 */
export default function FloatingHelpWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const contact = getPublicContactInfo();

  if (pathname.startsWith("/admin")) return null;

  function toggle() {
    setOpen((prev) => {
      const next = !prev;
      trackEvent("floating_help_toggle", { open: next });
      return next;
    });
  }

  return (
    <div
      className="pointer-events-none fixed bottom-6 right-6 z-[45] hidden flex-col items-end gap-3 md:flex"
      aria-live="polite"
    >
      {open ? (
        <div
          id="floating-help-panel"
          role="region"
          aria-label="Rychlá pomoc"
          className="pointer-events-auto relative w-[min(100vw-3rem,18rem)] rounded-2xl border border-black/[0.08] bg-card p-4 shadow-[0_14px_40px_rgba(43,43,43,0.14)]"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-2 top-2 rounded-lg p-1.5 text-black/45 transition hover:bg-black/[0.04] hover:text-foreground"
            aria-label="Zavřít nápovědu"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
          <p className="pr-8 text-sm font-semibold text-primary">Zasekli jste se?</p>
          <p className="mt-1 text-xs leading-relaxed text-black/65">
            Zavolejte nebo napište — u zakázek na míru je to běžné. Rozměry a detaily vždy ještě ověří technik.
          </p>
          <a
            href={contact.phoneHref}
            onClick={() => trackEvent("floating_help_phone_click")}
            className="ui-motion mt-3 flex items-center gap-2 rounded-xl bg-accent px-3 py-2.5 text-sm font-semibold text-white hover:bg-foreground"
          >
            <Phone className="h-4 w-4 shrink-0" strokeWidth={2} />
            {contact.phoneRaw}
          </a>
          <a
            href={`mailto:${contact.email}`}
            onClick={() => trackEvent("floating_help_email_click")}
            className="ui-motion mt-2 flex items-center gap-2 rounded-xl border border-black/[0.1] bg-white px-3 py-2 text-sm font-semibold text-foreground hover:border-primary/30"
          >
            <Mail className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} />
            Napsat e-mail
          </a>
          <Link
            href="/jak-probiha-objednavka"
            onClick={() => trackEvent("floating_help_process_click")}
            className="ui-motion mt-2 block text-center text-xs font-semibold text-primary underline-offset-2 hover:underline"
          >
            Jak probíhá objednávka
          </Link>
        </div>
      ) : null}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        id="floating-help-trigger"
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_30px_rgba(43,43,43,0.2)] transition hover:bg-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="sr-only">{open ? "Zavřít rychlou pomoc" : "Otevřít rychlou pomoc"}</span>
        {open ? <X className="h-6 w-6" strokeWidth={2} aria-hidden /> : <Headphones className="h-6 w-6" strokeWidth={1.75} aria-hidden />}
      </button>
    </div>
  );
}
