import { NextResponse } from "next/server";
import { saveLeadCapture } from "@/lib/lead-capture";
import { sendLeadMagnetEmails } from "@/lib/lead-emails";

type LeadPayload = {
  email?: string;
  phone?: string;
  source?: string;
  consent?: boolean;
  website?: string;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LeadPayload;
    const email = (payload.email ?? "").trim().toLowerCase();
    const phone = (payload.phone ?? "").trim();
    const source = (payload.source ?? "unknown").trim();
    const website = (payload.website ?? "").trim();

    // Honeypot field for simple bot filtering
    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Zadejte platný e-mail." }, { status: 400 });
    }
    if (!payload.consent) {
      return NextResponse.json({ error: "Potvrďte souhlas se zpracováním údajů." }, { status: 400 });
    }

    const [mail, storage] = await Promise.all([
      sendLeadMagnetEmails({ email, phone: phone || undefined, source }),
      saveLeadCapture({ email, phone: phone || undefined, source, consent: Boolean(payload.consent) }),
    ]);
    return NextResponse.json({ ok: true, mail, storage });
  } catch {
    return NextResponse.json({ error: "Formulář se nepodařilo odeslat." }, { status: 500 });
  }
}
