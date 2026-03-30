"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeCheck, CreditCard, FileText, Mail, MapPin, Phone, Truck, Wrench } from "lucide-react";
import CookieConsentBanner from "@/components/cookie-consent-banner";
import FloatingHelpWidget from "@/components/floating-help-widget";
import ShopHeader from "@/components/shop-header";
import TrustStrip from "@/components/trust-strip";
import { SHOP_CATEGORY_LINKS } from "@/lib/shop-nav";
import { DEPOSIT_PRODUCT_HREF } from "@/lib/storefront-paths";
import { trackEvent } from "@/lib/analytics";
import { getPublicContactInfo } from "@/lib/contact";

function SiteFooter() {
  const contact = getPublicContactInfo();
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#10161d] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
        <div className="grid gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.2)] lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.2fr] lg:p-8">
          <div>
            <p className="font-heading text-xl font-semibold tracking-tight">QAPI</p>
            <p className="mt-1 text-sm font-medium uppercase tracking-[0.12em] text-white/50">
              Vrata a stínění na míru
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Prémiový e-shop s rychlou orientací, důrazem na design a transparentní postup od zaměření po montáž.
            </p>
            <Link
              href={DEPOSIT_PRODUCT_HREF}
              className="ui-motion mt-5 inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-foreground"
            >
              Rezervace termínu
            </Link>
          </div>

          <nav aria-label="Sortiment">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Sortiment</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SHOP_CATEGORY_LINKS.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="ui-motion text-white/75 hover:text-white">
                    {c.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={DEPOSIT_PRODUCT_HREF} className="ui-motion font-medium text-white/85 hover:text-white">
                  Záloha na zakázku
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Služby">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Služby</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["/jak-probiha-objednavka", "Průběh objednávky"],
                ["/stavebni-pripravenost", "Stavební připravenost"],
                ["/technicke-navody", "Technické návody"],
                ["/reference", "Reference a realizace"],
                ["/kontakt", "Poptávka a dotazy"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="ui-motion text-white/75 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
              <li className="flex items-start gap-2 text-white/65">
                <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/60" strokeWidth={2} />
                Zaměření a montáž na míru
              </li>
              <li className="flex items-start gap-2 text-white/65">
                <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/60" strokeWidth={2} />
                Servis po celé ČR
              </li>
            </ul>
          </nav>

          <nav aria-label="Rychlé odkazy">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Rychlé odkazy</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/o-nas" className="ui-motion text-white/75 hover:text-white">
                  O nás
                </Link>
              </li>
              <li>
                <Link href="/kosik" className="ui-motion text-white/75 hover:text-white">
                  Košík
                </Link>
              </li>
              <li>
                <Link href="/obchodni-podminky" className="ui-motion text-white/75 hover:text-white">
                  Obchodní podmínky
                </Link>
              </li>
              <li>
                <Link href="/ochrana-osobnich-udaju" className="ui-motion text-white/75 hover:text-white">
                  Ochrana údajů
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="ui-motion text-white/75 hover:text-white">
                  Cookies
                </Link>
              </li>
            </ul>
          </nav>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/12 bg-white/[0.03] p-4">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.11em] text-accent">
                <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
                Oficiální partner Shadeon
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Inspirujeme se prémiovým standardem Shadeon a přenášíme jej do návrhu i realizace.
              </p>
              <a
                href="https://shadeon.eu/"
                target="_blank"
                rel="noreferrer"
                className="ui-motion mt-3 inline-flex text-sm font-semibold text-accent hover:text-white"
              >
                Zobrazit partnera
              </a>
            </div>
            <ul className="space-y-3 text-sm text-white/75">
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
                <a href={contact.phoneHref} className="ui-motion hover:text-white">
                  {contact.phoneRaw}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
                <a href={`mailto:${contact.email}`} className="ui-motion break-all hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
                <span className="text-white/65">{contact.addressLine ?? "Montáž po celé České republice"}</span>
              </li>
              <li className="flex gap-3">
                <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
                <span className="text-white/65">Platba dle domluvy po nacenění</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-xs text-white/45">
          <span className="inline-flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
            Texty OP / GDPR před provozem zkontrolovat s právníkem
          </span>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} QAPI — vrata a stínění
      </div>
    </footer>
  );
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminArea = pathname.startsWith("/admin");
  const isCheckoutArea =
    pathname.startsWith("/pokladna") ||
    pathname.startsWith("/kosik") ||
    pathname.startsWith("/objednavka-potvrzena");

  if (isAdminArea) {
    return <>{children}</>;
  }

  return (
    <>
      <ShopHeader />
      {!isCheckoutArea ? <TrustStrip /> : null}
      <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
        {children}
      </main>
      {!isAdminArea ? <CookieConsentBanner /> : null}
      {!isAdminArea ? <FloatingHelpWidget /> : null}
      {!isCheckoutArea ? (
        <div className="fixed inset-x-0 bottom-4 z-40 px-4 md:hidden">
          <div className="mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-primary/35 bg-white/95 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md">
            <p className="text-xs font-medium leading-snug text-foreground/90">
              1. krok: rezervace technika. Bez rizika při nerealizovatelnosti.
            </p>
            <Link
              href={DEPOSIT_PRODUCT_HREF}
              onClick={() => trackEvent("mobile_sticky_reservation_click")}
              className="shrink-0 rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-white shadow-sm"
            >
              Začít
            </Link>
          </div>
        </div>
      ) : null}
      <SiteFooter />
    </>
  );
}
