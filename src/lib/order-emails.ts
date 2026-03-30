import { isSmtpConfigured, sendMail } from "@/lib/mail";
import { getPaymentInfoFromEnv, hasBankTransferDetails } from "@/lib/payment";

type RequestItem = {
  name: string;
  unitPrice: number;
  quantity: number;
  config: Record<string, string>;
};

type OrderEmailContext = {
  orderNumber: string;
  variableSymbol: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  city: string;
  postalCode: string;
  totalPrice: number;
  items: RequestItem[];
};

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatConfig(config: Record<string, string>): string {
  return Object.entries(config)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

function buildItemsText(items: RequestItem[]): string {
  return items
    .map((item, idx) => {
      const lineTotal = Math.round(item.unitPrice) * item.quantity;
      const cfg = formatConfig(item.config);
      return [
        `${idx + 1}. ${item.name}`,
        `   Počet: ${item.quantity} × ${Math.round(item.unitPrice).toLocaleString("cs-CZ")} Kč = ${lineTotal.toLocaleString("cs-CZ")} Kč`,
        cfg ? `   Parametry:\n   ${cfg.replaceAll("\n", "\n   ")}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

function buildItemsHtml(items: RequestItem[]): string {
  return items
    .map((item, idx) => {
      const lineTotal = Math.round(item.unitPrice) * item.quantity;
      const rows = Object.entries(item.config).map(
        ([k, v]) =>
          `<tr><td style="padding:4px 8px;border:1px solid #e5e5e5;">${escapeHtml(k)}</td><td style="padding:4px 8px;border:1px solid #e5e5e5;">${escapeHtml(v)}</td></tr>`,
      );
      return `
        <div style="margin-bottom:16px;padding:12px;border:1px solid #e5e5e5;border-radius:8px;">
          <p style="margin:0 0 8px;font-weight:600;">${idx + 1}. ${escapeHtml(item.name)}</p>
          <p style="margin:0 0 8px;">Počet: <strong>${item.quantity}</strong> × ${Math.round(item.unitPrice).toLocaleString("cs-CZ")} Kč =
            <strong>${lineTotal.toLocaleString("cs-CZ")} Kč</strong></p>
          ${
            rows.length
              ? `<table style="border-collapse:collapse;width:100%;font-size:14px;">${rows.join("")}</table>`
              : ""
          }
        </div>`;
    })
    .join("");
}

export async function sendOrderEmails(ctx: OrderEmailContext): Promise<{
  customer: "sent" | "skipped" | "failed";
  internal: "sent" | "skipped" | "failed";
}> {
  let siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://qapi.cz").trim().replace(/\/$/, "");
  siteUrl = /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`;
  const payment = getPaymentInfoFromEnv();
  const showBank = hasBankTransferDetails(payment);

  const itemsText = buildItemsText(ctx.items);
  const itemsHtml = buildItemsHtml(ctx.items);

  const bankText = showBank
    ? [
        "",
        "Platební údaje (převod):",
        payment.bankName ? `Banka: ${payment.bankName}` : "",
        payment.bankAccount ? `Číslo účtu: ${payment.bankAccount}` : "",
        payment.iban ? `IBAN: ${payment.iban}` : "",
        payment.swift ? `SWIFT/BIC: ${payment.swift}` : "",
        `Variabilní symbol: ${ctx.variableSymbol}`,
        `Částka: ${ctx.totalPrice.toLocaleString("cs-CZ")} Kč`,
        payment.note ? `Poznámka: ${payment.note}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  const bankHtml = showBank
    ? `
      <div style="margin-top:16px;padding:12px;border-radius:8px;background:#fffdf6;border:1px solid #d4af37;">
        <p style="margin:0 0 8px;font-weight:600;">Platební údaje (převod)</p>
        <ul style="margin:0;padding-left:18px;">
          ${payment.bankName ? `<li>Banka: ${escapeHtml(payment.bankName)}</li>` : ""}
          ${payment.bankAccount ? `<li>Číslo účtu: ${escapeHtml(payment.bankAccount)}</li>` : ""}
          ${payment.iban ? `<li>IBAN: ${escapeHtml(payment.iban)}</li>` : ""}
          ${payment.swift ? `<li>SWIFT/BIC: ${escapeHtml(payment.swift)}</li>` : ""}
          <li>Variabilní symbol: <strong>${escapeHtml(ctx.variableSymbol)}</strong></li>
          <li>Částka: <strong>${ctx.totalPrice.toLocaleString("cs-CZ")} Kč</strong></li>
        </ul>
        ${payment.note ? `<p style="margin:8px 0 0;font-size:14px;">${escapeHtml(payment.note)}</p>` : ""}
      </div>`
    : "";

  const customerSubject = `Potvrzení objednávky ${ctx.orderNumber} — QAPI`;
  const customerText = [
    `Dobrý den, ${ctx.customerName},`,
    "",
    `děkujeme za objednávku ${ctx.orderNumber}.`,
    "",
    "Souhrn:",
    itemsText,
    "",
    `Celkem k úhradě: ${ctx.totalPrice.toLocaleString("cs-CZ")} Kč`,
    bankText,
    "",
    "Další krok: náš tým vás bude kontaktovat ohledně termínu technika a doladění detailů.",
    "",
    `Váš tým QAPI`,
    `${siteUrl}`,
  ].join("\n");

  const customerHtml = `
    <div style="font-family:system-ui,Segoe UI,sans-serif;line-height:1.5;color:#111;">
      <p>Dobrý den, <strong>${escapeHtml(ctx.customerName)}</strong>,</p>
      <p>děkujeme za objednávku <strong>${escapeHtml(ctx.orderNumber)}</strong>.</p>
      <h3 style="margin:16px 0 8px;">Souhrn</h3>
      ${itemsHtml}
      <p><strong>Celkem k úhradě:</strong> ${ctx.totalPrice.toLocaleString("cs-CZ")} Kč</p>
      ${bankHtml}
      <p style="margin-top:16px;">Další krok: náš tým vás bude kontaktovat ohledně termínu technika a doladění detailů.</p>
      <p style="margin-top:24px;">Váš tým QAPI<br/><a href="${escapeHtml(siteUrl)}">${escapeHtml(siteUrl)}</a></p>
    </div>`;

  const internalTo = process.env.ORDER_NOTIFY_EMAIL?.trim() || "objednavky@qapi.cz";
  const internalSubject = `Nová objednávka ${ctx.orderNumber}`;
  const internalText = [
    `Nová objednávka ${ctx.orderNumber}`,
    `VS: ${ctx.variableSymbol}`,
    "",
    "Zákazník:",
    `Jméno: ${ctx.customerName}`,
    `E-mail: ${ctx.customerEmail}`,
    `Telefon: ${ctx.customerPhone}`,
    `Adresa: ${ctx.street}, ${ctx.postalCode} ${ctx.city}`,
    "",
    "Položky:",
    itemsText,
    "",
    `Celkem: ${ctx.totalPrice.toLocaleString("cs-CZ")} Kč`,
  ].join("\n");

  const internalHtml = `
    <div style="font-family:system-ui,Segoe UI,sans-serif;line-height:1.5;color:#111;">
      <h2 style="margin:0 0 8px;">Nová objednávka ${escapeHtml(ctx.orderNumber)}</h2>
      <p><strong>VS:</strong> ${escapeHtml(ctx.variableSymbol)}</p>
      <h3 style="margin:16px 0 8px;">Zákazník</h3>
      <ul>
        <li>${escapeHtml(ctx.customerName)}</li>
        <li><a href="mailto:${escapeHtml(ctx.customerEmail)}">${escapeHtml(ctx.customerEmail)}</a></li>
        <li>${escapeHtml(ctx.customerPhone)}</li>
        <li>${escapeHtml(ctx.street)}, ${escapeHtml(ctx.postalCode)} ${escapeHtml(ctx.city)}</li>
      </ul>
      <h3 style="margin:16px 0 8px;">Položky</h3>
      ${itemsHtml}
      <p><strong>Celkem:</strong> ${ctx.totalPrice.toLocaleString("cs-CZ")} Kč</p>
    </div>`;

  const replyToShop =
    process.env.MAIL_REPLY_TO?.trim() ||
    process.env.ORDER_NOTIFY_EMAIL?.trim() ||
    undefined;

  const [customerResult, internalResult] = await Promise.all([
    sendMail({
      to: ctx.customerEmail,
      replyTo: replyToShop,
      subject: customerSubject,
      text: customerText,
      html: customerHtml,
    }),
    sendMail({
      to: internalTo,
      subject: internalSubject,
      text: internalText,
      html: internalHtml,
    }),
  ]);

  return {
    customer: customerResult.ok ? "sent" : isSmtpConfigured() ? "failed" : "skipped",
    internal: internalResult.ok ? "sent" : isSmtpConfigured() ? "failed" : "skipped",
  };
}
