"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Lock, Package, Shield } from "lucide-react";
import CheckoutSteps from "@/components/checkout-steps";
import { useCart } from "@/components/cart-provider";
import { trackEvent } from "@/lib/analytics";

const inputClass =
  "w-full rounded-xl border border-black/[0.12] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-black/40 focus:border-primary/45 focus:ring-2 focus:ring-primary/15";

export default function PokladnaPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const roundedTotal = Math.round(total);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!error) return;
    errorSummaryRef.current?.focus();
  }, [error]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      setError("Košík je prázdný. Nejdříve přidejte produkt.");
      trackEvent("checkout_error_empty_cart");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const customerName = String(formData.get("customerName") ?? "");
    const customerEmail = String(formData.get("customerEmail") ?? "");
    const customerPhone = String(formData.get("customerPhone") ?? "");
    const street = String(formData.get("street") ?? "");
    const city = String(formData.get("city") ?? "");
    const postalCode = String(formData.get("postalCode") ?? "");

    setIsSubmitting(true);
    setError("");
    const acceptTerms = formData.get("acceptTerms") === "on";
    const acceptPrivacy = formData.get("acceptPrivacy") === "on";

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        customerEmail,
        customerPhone,
        street,
        city,
        postalCode,
        items,
        acceptTerms,
        acceptPrivacy,
      }),
    });

    if (!response.ok) {
      const errJson = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(
        errJson?.error ??
          "Odeslání objednávky se nepodařilo. Zkuste to prosím znovu.",
      );
      trackEvent("checkout_submit_failed");
      setIsSubmitting(false);
      return;
    }

    const data = (await response.json()) as { orderNumber?: string; variableSymbol?: string };
    trackEvent("checkout_submit_success", {
      orderNumber: data.orderNumber ?? null,
      itemsCount: items.length,
      total: roundedTotal,
    });
    clearCart();
    const params = new URLSearchParams();
    if (data.orderNumber) params.set("orderNumber", data.orderNumber);
    if (data.variableSymbol) params.set("vs", data.variableSymbol);
    const qs = params.toString();
    router.push(qs ? `/objednavka-potvrzena?${qs}` : "/objednavka-potvrzena");
  }

  return (
    <main className="bg-background">
      <div className="border-b border-black/[0.06] bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
          <nav className="mb-4 text-sm text-black/50">
            <Link href="/" className="hover:text-primary">
              Domů
            </Link>
            <span className="mx-2 text-black/30">/</span>
            <Link href="/kosik" className="hover:text-primary">
              Košík
            </Link>
            <span className="mx-2 text-black/30">/</span>
            <span className="font-medium text-foreground/80">Pokladna</span>
          </nav>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Dokončení objednávky</h1>
          <p className="mt-2 text-sm text-black/60">Vyplňte údaje a odešlete objednávku. Potvrzení přijde e-mailem.</p>
          <div className="mt-6">
            <CheckoutSteps current={2} />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 pb-28 sm:px-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-black/[0.08] bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-8"
          >
            {error ? (
              <div
                ref={errorSummaryRef}
                tabIndex={-1}
                role="alert"
                aria-live="assertive"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 outline-none"
              >
                <p className="font-semibold">Odeslání se nepodařilo</p>
                <p className="mt-1">{error}</p>
              </div>
            ) : null}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-3 text-xs text-black/75">
              Vyplnění formuláře trvá obvykle 1-2 minuty. Potvrzení objednávky uvidíte hned na stránce a shrnutí vám pošleme e-mailem.
            </div>
            <p className="text-xs text-black/60">
              Účet nevytváříte. Přehled a další instrukce vám přijdou e-mailem.
            </p>
            <div>
              <h2 className="text-lg font-semibold text-primary">Kontaktní údaje</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input
                  required
                  name="customerName"
                  placeholder="Jméno a příjmení"
                  autoComplete="name"
                  className={inputClass}
                />
                <input
                  required
                  name="customerEmail"
                  type="email"
                  placeholder="E-mail"
                  autoComplete="email"
                  className={inputClass}
                />
                <input
                  required
                  name="customerPhone"
                  placeholder="Telefon"
                  autoComplete="tel"
                  inputMode="tel"
                  className={`${inputClass} sm:col-span-2`}
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-primary">Fakturační údaje</h2>
              <div className="mt-4 grid gap-4">
                <input
                  required
                  name="street"
                  placeholder="Ulice a číslo popisné"
                  autoComplete="address-line1"
                  className={inputClass}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    required
                    name="city"
                    placeholder="Město"
                    autoComplete="address-level2"
                    className={inputClass}
                  />
                  <input
                    required
                    name="postalCode"
                    placeholder="PSČ"
                    autoComplete="postal-code"
                    inputMode="numeric"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/[0.08] bg-strip/50 p-4 text-sm">
              <input required name="acceptTerms" type="checkbox" className="mt-0.5 h-4 w-4 accent-primary" />
              <span className="text-black/80">
                Souhlasím s{" "}
                <Link
                  href="/obchodni-podminky"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  obchodními podmínkami
                </Link>{" "}
                (včetně ustanovení o zboží na míru a zálohách).
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/[0.08] bg-strip/50 p-4 text-sm">
              <input required name="acceptPrivacy" type="checkbox" className="mt-0.5 h-4 w-4 accent-primary" />
              <span className="text-black/80">
                Souhlasím se{" "}
                <Link
                  href="/ochrana-osobnich-udaju"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  zpracováním osobních údajů
                </Link>{" "}
                za účelem vyřízení objednávky.
              </span>
            </label>

            <div className="rounded-xl border border-green-200/85 bg-green-50/90 px-4 py-3 text-xs leading-relaxed text-black/75">
              <strong className="text-foreground">Klid před odesláním:</strong> po odeslání objednávky vás obvykle do 24 hodin
              kontaktuje náš technik a společně zkontrolujete rozměry i parametry z konfigurace — až teprve potom zadáváme
              výrobu. <strong className="text-foreground">Tímto krokem nic neplatíte</strong> — zálohu uhradíte až podle
              pokynů v potvrzení objednávky.
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full rounded-xl bg-accent px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Odesílám…" : "Odeslat objednávku"}
            </button>
            <p className="text-xs text-black/55">
              Žádná platba tlačítkem — nejdřív kontrola s technikem, potom shrnutí e-mailem a platba zálohy podle pokynů v
              potvrzení.
            </p>
            <p className="text-xs text-black/55">
              Potřebujete poradit? Odpověď najdete v sekci{" "}
              <Link href="/kontakt" className="font-medium text-primary underline-offset-2 hover:underline">
                Kontakt
              </Link>
              .
            </p>
          </form>

          <aside className="h-fit space-y-4 lg:sticky lg:top-28">
            <div className="rounded-2xl border border-black/[0.08] bg-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Package className="h-5 w-5 text-primary" strokeWidth={1.75} />
                Souhrn objednávky
              </h2>
              <p className="mt-3 text-sm text-black/60">Položek v košíku</p>
              <p className="text-2xl font-bold text-primary">{items.length}</p>
              <p className="mt-4 text-sm text-black/60">Celkem</p>
              <p className="text-2xl font-bold text-primary">{total.toLocaleString("cs-CZ")} Kč</p>
              <p className="mt-1 text-xs text-black/50">Orientační cena; finální cenu potvrdíme po zaměření technikem.</p>
              <p className="mt-2 text-xs text-black/55">
                Doprava a montáž: upřesní technik po zaměření (bez skrytých poplatků).
              </p>
              <div className="mt-3 rounded-xl border border-green-200/90 bg-green-50/90 px-3 py-2.5 text-xs leading-relaxed text-black/75">
                <strong className="text-foreground">Kontrola technikem:</strong> před výrobou projdeme zadané
                parametry. Když něco nedává smysl, ozveme se.
              </div>
              <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-black/70">
                Krok 2/2: po odeslání uvidíte potvrzení a další instrukce.
              </div>
            </div>
            <div className="rounded-2xl border border-black/[0.06] bg-strip p-5 text-sm text-black/70">
              <p className="flex items-center gap-2 font-medium text-primary">
                <Lock className="h-4 w-4 text-primary" strokeWidth={1.75} />
                Bezpečné odeslání
              </p>
              <p className="mt-2 flex items-start gap-2">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
                Údaje použijeme jen pro vyřízení objednávky a kontakt ohledně realizace.
              </p>
              <ul className="mt-4 space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" strokeWidth={2} />
                  Potvrzení e-mailem
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" strokeWidth={2} />
                  Jasné další kroky s technikem
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" strokeWidth={2} />
                  Transparentní finální cena po zaměření
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-black/[0.06] bg-card p-4 text-xs text-black/70">
              <p className="font-semibold text-foreground/90">Očekávaný postup po odeslání</p>
              <ul className="mt-2 space-y-1.5">
                <li>Do několika minut: potvrzení objednávky.</li>
                <li>Následně: domluva termínu zaměření.</li>
                <li>Po zaměření: potvrzení finální ceny a realizace.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
      {items.length > 0 ? (
        <div className="fixed inset-x-0 bottom-3 z-40 px-4 md:hidden">
          <button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-between rounded-2xl border border-primary/35 bg-white/95 px-4 py-3 text-sm font-semibold text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md disabled:opacity-60"
          >
            <span>{isSubmitting ? "Odesílám…" : "Odeslat objednávku"}</span>
            <div className="flex flex-col items-end leading-tight">
              <span className="text-primary">{total.toLocaleString("cs-CZ")} Kč</span>
              <span className="text-[11px] text-foreground/60">Orientační cena</span>
            </div>
          </button>
        </div>
      ) : null}
    </main>
  );
}
