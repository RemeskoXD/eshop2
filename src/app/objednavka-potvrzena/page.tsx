import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import CheckoutSteps from "@/components/checkout-steps";
import { getPaymentInfoFromEnv, hasBankTransferDetails } from "@/lib/payment";
import { absoluteUrl } from "@/lib/site";

const POTVRZENI_PATH = "/objednavka-potvrzena";

export const metadata: Metadata = {
  title: "Objednávka odeslána | QAPI",
  description: "Potvrzení přijetí objednávky a další kroky — QAPI vrata a stínění.",
  alternates: { canonical: absoluteUrl(POTVRZENI_PATH) },
  robots: { index: false, follow: true },
};

type ConfirmationPageProps = {
  searchParams: Promise<{ orderNumber?: string; vs?: string }>;
};

export default async function ObjednavkaPotvrzenaPage({ searchParams }: ConfirmationPageProps) {
  const { orderNumber, vs } = await searchParams;
  const payment = getPaymentInfoFromEnv();
  const showBank = hasBankTransferDetails(payment);

  return (
    <main className="bg-background">
      <div className="border-b border-black/[0.06] bg-card">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 sm:py-10">
          <nav className="mb-4 flex flex-wrap gap-x-2 gap-y-1 text-sm text-black/50">
            <Link href="/" className="hover:text-primary">
              Domů
            </Link>
            <span className="text-black/30">/</span>
            <Link href="/kosik" className="hover:text-primary">
              Košík
            </Link>
            <span className="text-black/30">/</span>
            <Link href="/pokladna" className="hover:text-primary">
              Pokladna
            </Link>
            <span className="text-black/30">/</span>
            <span className="font-medium text-foreground/80">Potvrzení</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Objednávka</p>
          <p className="font-heading mt-1 text-xl font-semibold tracking-tight text-primary sm:text-2xl">
            Stav nákupu: potvrzení
          </p>
          <div className="mt-6">
            <CheckoutSteps current={3} />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
        <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700 ring-4 ring-green-100/50">
            <CheckCircle2 className="h-9 w-9" strokeWidth={1.75} />
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Děkujeme</p>
          <h1 className="font-heading mt-2 text-3xl font-semibold sm:text-4xl">Objednávka byla úspěšně odeslána</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-black/70 sm:text-base">
            Shrnutí jsme odeslali na váš e-mail. Technik se ozve kvůli zaměření a společně zkontrolujete parametry —
            stejně jako jsme slibovali před odesláním objednávky.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/[0.08] bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Identifikace objednávky</p>
            {orderNumber ? (
              <p className="mt-3 text-sm text-black/65">
                Číslo objednávky
                <br />
                <span className="text-xl font-bold text-primary">{orderNumber}</span>
              </p>
            ) : (
              <p className="mt-3 text-sm text-black/65">Číslo objednávky bude v potvrzovacím e-mailu.</p>
            )}
            {vs ? (
              <p className="mt-3 text-sm text-black/70">
                Variabilní symbol: <span className="font-semibold text-black">{vs}</span>
              </p>
            ) : null}
          </div>
          <div className="rounded-2xl border border-black/[0.08] bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Co bude následovat</p>
            <ol className="mt-3 space-y-2 text-sm text-black/75">
              <li>1) Obdržíte potvrzení a rekapitulaci objednávky.</li>
              <li>
                2) Obvykle do 24 hodin (pracovní dny) vás kontaktuje technik kvůli termínu zaměření a kontrole parametrů z
                konfigurace.
              </li>
              <li>3) Po zaměření potvrdíme finální cenu a harmonogram realizace.</li>
            </ol>
            <div className="mt-4 rounded-xl border border-black/[0.08] bg-strip/70 px-3 py-2 text-xs text-black/70">
              Doprava a montáž se upřesní po zaměření technikem (bez skrytých poplatků).
            </div>
            <div className="mt-3 rounded-xl border border-green-200/90 bg-green-50/90 px-3 py-2.5 text-xs leading-relaxed text-black/75">
              <strong className="text-foreground">Kontrola parametrů:</strong> projdeme zadání z objednávky a v případě
              nejasností vás budeme kontaktovat dřív, než potvrdíme výrobu.
            </div>
          </div>
        </div>

        {showBank ? (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-primary/30 bg-[#fffdf6] p-6 text-left text-sm text-black/80 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Platba převodem
            </p>
            <h2 className="mt-2 text-lg font-semibold text-black">Platební údaje</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {payment.bankName ? (
                <li>
                  <span className="text-black/60">Banka: </span>
                  {payment.bankName}
                </li>
              ) : null}
              {payment.bankAccount ? (
                <li>
                  <span className="text-black/60">Číslo účtu: </span>
                  <span className="font-semibold">{payment.bankAccount}</span>
                </li>
              ) : null}
              {payment.iban ? (
                <li>
                  <span className="text-black/60">IBAN: </span>
                  <span className="font-semibold">{payment.iban}</span>
                </li>
              ) : null}
              {payment.swift ? (
                <li>
                  <span className="text-black/60">SWIFT/BIC: </span>
                  {payment.swift}
                </li>
              ) : null}
              {vs ? (
                <li>
                  <span className="text-black/60">Variabilní symbol: </span>
                  <span className="font-semibold">{vs}</span>
                </li>
              ) : null}
            </ul>
            {payment.note ? <p className="mt-4 text-xs text-black/65">{payment.note}</p> : null}
          </div>
        ) : (
          <p className="mx-auto mt-8 max-w-xl rounded-xl border border-black/[0.08] bg-card p-5 text-center text-sm text-black/65 shadow-sm">
            Platební údaje vám pošleme e-mailem, případně je doplní obchodník.
          </p>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="inline-flex w-full justify-center rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-foreground sm:w-auto"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </main>
  );
}
