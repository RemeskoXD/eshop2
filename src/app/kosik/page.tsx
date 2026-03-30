"use client";

import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import CheckoutSteps from "@/components/checkout-steps";
import CartTrustRow from "@/components/cart-trust-row";
import { useCart } from "@/components/cart-provider";
import { trackEvent } from "@/lib/analytics";
import { DEPOSIT_PRODUCT_HREF } from "@/lib/storefront-paths";

function czechItemsLabel(count: number): string {
  if (count === 1) return "1 položka";
  const m10 = count % 10;
  const m100 = count % 100;
  if (m100 >= 11 && m100 <= 14) return `${count} položek`;
  if (m10 >= 2 && m10 <= 4) return `${count} položky`;
  return `${count} položek`;
}

export default function KosikPage() {
  const { items, removeItem, total } = useCart();
  const roundedTotal = Math.round(total);

  return (
    <main className="bg-background">
      <div className="border-b border-black/[0.06] bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
          <nav className="mb-4 text-sm text-black/50">
            <Link href="/" className="hover:text-primary">
              Domů
            </Link>
            <span className="mx-2 text-black/30">/</span>
            <span className="font-medium text-foreground/80">Košík</span>
          </nav>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Košík</h1>
          <p className="mt-2 max-w-2xl text-sm text-black/60">
            Zkontrolujte položky a konfiguraci. V pokladně doplníte údaje — zálohu typicky hradíte až po kontaktu
            technika, ne okamžitě po kliknutí.
          </p>
          <div className="mt-6">
            <CheckoutSteps current={1} />
          </div>
          <div className="mt-5">
            <CartTrustRow />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 pb-28 sm:px-8 sm:py-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-black/15 bg-card px-6 py-14 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-black/35">
              <ShoppingBag className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <p className="mt-6 text-lg font-medium text-foreground">Košík je prázdný</p>
            <p className="mt-2 max-w-sm text-sm text-black/60">
              Vyberte produkt v kategorii nebo začněte rezervací technika u zálohy na zakázku.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/#kategorie"
                className="rounded-xl border-2 border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
              >
                Prohlédnout sortiment
              </Link>
              <Link
                href={DEPOSIT_PRODUCT_HREF}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-foreground"
              >
                Záloha na zakázku
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-black/[0.08] bg-gradient-to-r from-primary/8 to-transparent px-4 py-3 text-sm text-black/70">
                Konfigurace je uložená v košíku. V pokladně doplníte kontakt a fakturační údaje — parametry ještě
                před výrobou projde technik.
              </div>
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-black/[0.06] bg-card p-5 shadow-[0_6px_28px_rgba(0,0,0,0.05)] sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold text-primary">{item.name}</h2>
                    <span className="rounded-full border border-black/10 bg-strip px-2.5 py-1 text-xs font-semibold text-black/60">
                      Zakázka na míru
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-black/70">
                    Jednotková cena:{" "}
                    <span className="font-semibold text-foreground">
                      {item.unitPrice.toLocaleString("cs-CZ")} Kč
                    </span>
                    {item.quantity > 1 ? (
                      <span className="text-black/50"> × {item.quantity}</span>
                    ) : null}
                  </p>
                  <dl className="mt-4 grid gap-2 rounded-xl bg-strip/80 px-4 py-3 text-sm">
                    {Object.entries(item.config).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-[1fr_auto] gap-3 border-b border-black/[0.05] pb-2 last:border-0 last:pb-0">
                        <dt className="text-black/55">{key}</dt>
                        <dd className="max-w-[200px] break-words text-right font-medium text-foreground">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Odebrat položku ${item.name} z košíku`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 transition hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                    Odebrat z košíku
                  </button>
                </article>
              ))}
            </div>

            <aside className="h-fit space-y-4 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-black/[0.06] bg-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                <h2 className="text-lg font-semibold text-primary">Souhrn objednávky</h2>
                <p className="mt-3 text-sm text-black/60">Mezisoučet ({czechItemsLabel(items.length)})</p>
                <p className="text-2xl font-bold text-primary">{total.toLocaleString("cs-CZ")} Kč</p>
                <p className="mt-2 text-xs text-black/50">
                  Orientační cena pro zakázky na míru. Finální cenu potvrdíme po zaměření technikem.
                </p>
                <div className="mt-3 rounded-xl border border-black/[0.08] bg-strip/70 px-3 py-2 text-xs text-black/70">
                  Doprava a montáž: upřesní technik po zaměření (bez skrytých poplatků).
                </div>
                <div className="mt-3 rounded-xl border border-green-200/90 bg-green-50/90 px-3 py-2.5 text-xs leading-relaxed text-black/75">
                  <strong className="text-foreground">Kontrola technikem:</strong> před zadáním do výroby zkontrolujeme
                  parametry z košíku. Když něco nesedí nebo je málo pravděpodobné, ozveme se vám.
                </div>
                <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-black/70">
                  Krok 1/2: položky jsou připravené.
                </div>
                <Link
                  href="/pokladna"
                  onClick={() =>
                    trackEvent("begin_checkout", { itemsCount: items.length, total: roundedTotal })
                  }
                  className="mt-6 inline-block w-full rounded-xl bg-accent px-4 py-3.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-foreground"
                >
                  Pokračovat k objednávce
                </Link>
                <p className="mt-2 text-center text-[11px] leading-snug text-black/55">
                  V pokladně jen doplníte údaje — zálohu hradíte až po kontaktu technika, ne hned po kliknutí.
                </p>
                <Link
                  href="/#kategorie"
                  className="mt-3 block w-full rounded-xl border border-black/[0.1] py-2.5 text-center text-sm font-medium text-foreground/80 transition hover:border-primary/25 hover:text-primary"
                >
                  Přidat další produkt
                </Link>
              </div>
              <div className="rounded-2xl border border-black/[0.06] bg-strip p-4 text-xs text-black/70">
                <p className="font-semibold text-foreground/90">Co bude následovat</p>
                <ul className="mt-2 space-y-1.5">
                  <li>1) Vyplníte údaje v pokladně.</li>
                  <li>2) Dostanete potvrzení objednávky.</li>
                  <li>3) Technik domluví zaměření a finální nabídku.</li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </div>
      {items.length > 0 ? (
        <div className="fixed inset-x-0 bottom-3 z-40 px-4 md:hidden">
          <Link
            href="/pokladna"
            onClick={() => trackEvent("begin_checkout", { itemsCount: items.length, total: roundedTotal })}
            className="inline-flex w-full items-center justify-between rounded-2xl border border-primary/35 bg-white/95 px-4 py-3 text-sm font-semibold text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md"
          >
            <span>Pokračovat k objednávce</span>
            <div className="flex flex-col items-end leading-tight">
              <span className="text-primary">{total.toLocaleString("cs-CZ")} Kč</span>
              <span className="text-[11px] text-foreground/60">Orientační cena</span>
            </div>
          </Link>
        </div>
      ) : null}
    </main>
  );
}
