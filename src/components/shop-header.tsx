"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  BadgeCheck,
  ChevronRight,
  ChevronDown,
  Mail,
  Menu,
  Phone,
  ShoppingBag,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import HeaderCatalogSearch from "@/components/header-catalog-search";
import { useCart } from "@/components/cart-provider";
import Badge from "@/components/ui/badge";
import { SHOP_CATEGORY_LINKS } from "@/lib/shop-nav";
import { DEPOSIT_PRODUCT_HREF } from "@/lib/storefront-paths";
import { trackEvent } from "@/lib/analytics";
import { getPublicContactInfo } from "@/lib/contact";

function CartBadgeLink() {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <Link
      href="/kosik"
      className="ui-motion relative flex items-center gap-2 rounded-xl border border-transparent px-2.5 py-2 text-sm font-medium text-foreground/90 hover:border-black/[0.08] hover:bg-black/[0.03] hover:text-primary"
      aria-label={count > 0 ? `Košík, ${count} položek` : "Košík"}
    >
      <ShoppingBag className="h-5 w-5 shrink-0" strokeWidth={1.75} />
      <span className="hidden sm:inline">Košík</span>
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}

export default function ShopHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuTitleId = "mobile-menu-title";
  const contact = getPublicContactInfo();
  const consultationHref = "/kontakt?konzultace=1";

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const isCategoryActive = SHOP_CATEGORY_LINKS.some((c) => pathname.startsWith(c.href));
  const isInfoMoreActive =
    pathname.startsWith("/reference") ||
    pathname.startsWith("/o-nas") ||
    pathname.startsWith("/stavebni-pripravenost") ||
    pathname.startsWith("/technicke-navody");

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="hidden border-b border-black/[0.08] bg-secondary text-[13px] text-white/90 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-8">
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="https://shadeon.eu/"
              target="_blank"
              rel="noreferrer"
              className="ui-motion inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-white/15"
            >
              <BadgeCheck className="h-3.5 w-3.5 text-accent" strokeWidth={1.9} />
              Oficiální partner Shadeon
            </a>
            <span className="inline-flex items-center gap-2 text-white/85">
              <Truck className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
              Montáž a servis po celé ČR
            </span>
            <span className="inline-flex items-center gap-2 text-white/75">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
              Ověřený proces a férové nacenění
            </span>
            <span className="inline-flex items-center gap-2 text-white/80">
              <Phone className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
              <a href={contact.phoneHref} className="transition hover:text-white">
                {contact.phoneRaw}
              </a>
            </span>
            <span className="inline-flex items-center gap-2 text-white/75">
              <Mail className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
              <a href={`mailto:${contact.email}`} className="transition hover:text-white">
                {contact.email}
              </a>
            </span>
          </div>
          <Link
            href={consultationHref}
            onClick={() => trackEvent("header_consultation_click")}
            className="font-medium text-accent transition hover:text-white"
          >
            Konzultace zdarma s technikem →
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-black/[0.08] bg-white/98 shadow-[0_4px_24px_rgba(20,33,47,0.08)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-8 sm:py-3.5">
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="ui-motion flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 text-foreground hover:bg-black/[0.03] md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-label="Otevřít menu"
              aria-controls="mobile-menu-panel"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <Link href="/" className="group flex min-w-0 flex-col leading-tight">
              <span className="font-heading text-xl font-semibold tracking-tight text-primary sm:text-2xl">
                QAPI
              </span>
              <span className="ui-caption hidden font-medium uppercase tracking-[0.14em] sm:block sm:text-[11px]">
                Vrata &amp; stínění
              </span>
            </Link>
          </div>

          <div className="mx-auto hidden min-w-0 max-w-[48rem] flex-1 lg:block">
            <HeaderCatalogSearch />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <Badge tone="primary" className="hidden lg:inline-flex">Premium servis</Badge>
            <CartBadgeLink />
            <Link
              href={consultationHref}
              onClick={() => trackEvent("header_cta_consultation")}
              className="ui-motion hidden rounded-xl border border-primary/35 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 xl:inline-flex"
            >
              Konzultace zdarma
            </Link>
            <Link
              href={DEPOSIT_PRODUCT_HREF}
              onClick={() => trackEvent("header_cta_reservation")}
              className="ui-motion ui-hover-lift hidden rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-foreground md:inline-flex"
            >
              Rezervace
            </Link>
            <Link
              href={DEPOSIT_PRODUCT_HREF}
              onClick={() => trackEvent("header_cta_reservation")}
              className="ui-motion inline-flex rounded-xl border border-accent/25 bg-accent/10 px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/15 md:hidden"
            >
              Záloha
            </Link>
          </div>
        </div>

        <div className="border-t border-black/[0.06] px-4 py-2.5 lg:hidden">
          <HeaderCatalogSearch />
        </div>

        <div className="hidden border-t border-black/[0.06] bg-strip lg:block">
          <nav aria-label="Hlavní navigace" className="mx-auto flex max-w-7xl flex-wrap items-center gap-0.5 px-4 py-0 sm:px-8">
            <Link
              href="/"
              className={`ui-motion rounded-md px-3 py-2.5 text-sm font-medium hover:bg-black/[0.04] hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-foreground/88"
              }`}
            >
              Domů
            </Link>

            <details className="group relative">
              <summary className={`ui-motion flex cursor-pointer list-none items-center gap-0.5 rounded-md px-3 py-2.5 text-sm font-medium marker:content-none hover:bg-black/[0.04] hover:text-primary [&::-webkit-details-marker]:hidden ${
                isCategoryActive ? "text-primary" : "text-foreground/88"
              }`}>
                Kategorie
                <ChevronDown className="h-4 w-4 opacity-60 transition group-open:rotate-180" strokeWidth={2} />
              </summary>
              <div className="absolute left-0 top-full z-50 mt-0 min-w-[240px] rounded-b-xl border border-black/[0.08] border-t-0 bg-white py-2 shadow-[0_16px_48px_rgba(0,0,0,0.12)]">
                {SHOP_CATEGORY_LINKS.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="ui-motion block px-4 py-2.5 text-sm font-medium text-foreground/90 hover:bg-strip hover:text-primary"
                  >
                    {c.label}
                  </Link>
                ))}
                <div className="my-1 border-t border-black/5" />
                <Link
                  href={DEPOSIT_PRODUCT_HREF}
                  className="ui-motion block px-4 py-2.5 text-sm font-semibold text-accent hover:bg-accent/5"
                >
                  Záloha na zakázku
                </Link>
              </div>
            </details>

            <Link
              href="/jak-probiha-objednavka"
              className={`ui-motion rounded-md px-3 py-2.5 text-sm font-medium hover:bg-black/[0.04] hover:text-primary ${
                pathname.startsWith("/jak-probiha-objednavka") ? "text-primary" : "text-foreground/88"
              }`}
            >
              Jak objednat
            </Link>

            <details className="group relative">
              <summary
                className={`ui-motion flex cursor-pointer list-none items-center gap-0.5 rounded-md px-3 py-2.5 text-sm font-medium marker:content-none hover:bg-black/[0.04] hover:text-primary [&::-webkit-details-marker]:hidden ${
                  isInfoMoreActive ? "text-primary" : "text-foreground/88"
                }`}
              >
                Více
                <ChevronDown className="h-4 w-4 opacity-60 transition group-open:rotate-180" strokeWidth={2} />
              </summary>
              <div className="absolute left-0 top-full z-50 mt-0 min-w-[220px] rounded-b-xl border border-black/[0.08] border-t-0 bg-white py-2 shadow-[0_16px_48px_rgba(0,0,0,0.12)]">
                <Link
                  href="/stavebni-pripravenost"
                  className="ui-motion block px-4 py-2.5 text-sm font-medium text-foreground/90 hover:bg-strip hover:text-primary"
                >
                  Stavební připravenost
                </Link>
                <Link
                  href="/technicke-navody"
                  className="ui-motion block px-4 py-2.5 text-sm font-medium text-foreground/90 hover:bg-strip hover:text-primary"
                >
                  Technické návody
                </Link>
                <Link
                  href="/reference"
                  className="ui-motion block px-4 py-2.5 text-sm font-medium text-foreground/90 hover:bg-strip hover:text-primary"
                >
                  Reference
                </Link>
                <Link
                  href="/o-nas"
                  className="ui-motion block px-4 py-2.5 text-sm font-medium text-foreground/90 hover:bg-strip hover:text-primary"
                >
                  O nás
                </Link>
              </div>
            </details>

            <Link
              href="/kontakt"
              className={`ui-motion rounded-md px-3 py-2.5 text-sm font-medium hover:bg-black/[0.04] hover:text-primary ${
                pathname.startsWith("/kontakt") ? "text-primary" : "text-foreground/88"
              }`}
            >
              Kontakt
            </Link>
            <a
              href={contact.phoneHref}
              className="ui-motion ml-auto inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/75 hover:bg-black/[0.04] hover:text-primary"
            >
              <Phone className="h-4 w-4" strokeWidth={1.75} />
              Zavolat
            </a>
          </nav>
        </div>

        <div className="scrollbar-hide overflow-x-auto border-t border-black/[0.06] bg-strip px-4 py-2 lg:hidden">
          <nav aria-label="Rychlé kategorie" className="mx-auto flex w-max min-w-full max-w-7xl gap-2">
            {SHOP_CATEGORY_LINKS.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="ui-motion whitespace-nowrap rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-foreground/85 shadow-sm hover:border-primary/25"
              >
                {c.label}
              </Link>
            ))}
            <Link
              href={DEPOSIT_PRODUCT_HREF}
              className="ui-motion whitespace-nowrap rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/15"
            >
              Záloha
            </Link>
          </nav>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Zavřít menu"
            onClick={closeMobile}
          />
          <div
            id="mobile-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={mobileMenuTitleId}
            className="absolute left-0 top-0 flex h-full w-[min(100%,340px)] flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-4">
              <div>
                <h2 id={mobileMenuTitleId} className="font-heading text-lg font-semibold">
                  Menu
                </h2>
                <p className="ui-caption mt-0.5">Rychlá orientace v nabídce</p>
              </div>
              <button
                type="button"
                className="ui-motion flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 hover:bg-black/[0.03]"
                onClick={closeMobile}
                aria-label="Zavřít"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="Mobilní navigace" className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
              <div className="mb-3">
                <HeaderCatalogSearch onAfterSubmit={closeMobile} />
              </div>
              <Link href="/" onClick={closeMobile} className="ui-motion rounded-lg px-3 py-3 text-base font-medium hover:bg-muted">
                Domů
              </Link>
              <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wider text-black/45">
                Kategorie
              </p>
              {SHOP_CATEGORY_LINKS.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  onClick={closeMobile}
                  className="ui-motion rounded-lg px-3 py-3 font-medium hover:bg-muted"
                >
                  {c.label}
                </Link>
              ))}
              <Link
                href={DEPOSIT_PRODUCT_HREF}
                onClick={closeMobile}
                className="ui-motion rounded-lg px-3 py-3 font-semibold text-accent hover:bg-accent/5"
              >
                Záloha na zakázku
              </Link>
              <div className="my-2 border-t border-black/10" />
              {[
                ["/jak-probiha-objednavka", "Jak objednat"],
                ["/stavebni-pripravenost", "Stavební připravenost"],
                ["/technicke-navody", "Technické návody"],
                ["/reference", "Reference"],
                ["/o-nas", "O nás"],
                ["/kontakt", "Kontakt"],
                ["/kosik", "Košík"],
              ].map(([href, label]) => (
                <Link key={href} href={href} onClick={closeMobile} className="ui-motion rounded-lg px-3 py-3 font-medium hover:bg-muted">
                  <span className="inline-flex items-center gap-1.5">
                    {label}
                    <ChevronRight className="h-3.5 w-3.5 text-black/35" />
                  </span>
                </Link>
              ))}
            </nav>
            <div className="border-t border-black/10 p-4">
              <a
                href={contact.phoneHref}
                className="ui-motion inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-white hover:bg-secondary/90"
              >
                <Phone className="h-4 w-4" />
                Zavolat specialistovi
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
