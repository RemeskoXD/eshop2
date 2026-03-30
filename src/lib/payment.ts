export type PaymentInfo = {
  bankAccount: string | null;
  iban: string | null;
  swift: string | null;
  bankName: string | null;
  note: string | null;
};

/**
 * Platební údaje pro převod (nastavte v produkci přes env, bez NEXT_PUBLIC_).
 */
export function getPaymentInfoFromEnv(): PaymentInfo {
  return {
    bankAccount: process.env.PAYMENT_BANK_ACCOUNT?.trim() || null,
    iban: process.env.PAYMENT_IBAN?.trim() || null,
    swift: process.env.PAYMENT_SWIFT?.trim() || null,
    bankName: process.env.PAYMENT_BANK_NAME?.trim() || null,
    note: process.env.PAYMENT_NOTE?.trim() || null,
  };
}

export function hasBankTransferDetails(info: PaymentInfo): boolean {
  return Boolean(info.bankAccount || info.iban);
}
