export type PublicContactInfo = {
  phoneRaw: string;
  phoneHref: string;
  email: string;
  addressLine?: string;
};

function normalizePhoneForTelHref(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  // Keep only digits, preserve optional leading "+".
  const hasLeadingPlus = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/\D/g, "");
  if (!digitsOnly) return "";
  return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
}

export function getPublicContactInfo(): PublicContactInfo {
  const phoneRaw = (process.env.NEXT_PUBLIC_CONTACT_PHONE || "+420 777 000 000").trim();
  const email = (process.env.NEXT_PUBLIC_CONTACT_EMAIL || "objednavky@qapi.cz").trim();
  const addressLine = (process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "").trim() || undefined;

  const phoneHrefRaw = normalizePhoneForTelHref(phoneRaw);
  const phoneHref = phoneHrefRaw ? `tel:${phoneHrefRaw}` : "tel:+420777000000";

  return { phoneRaw, phoneHref, email, addressLine };
}

