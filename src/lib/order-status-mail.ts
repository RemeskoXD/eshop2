import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function resolveStatusLabels(
  fromCode: string,
  toCode: string,
): Promise<{ fromLabel: string; toLabel: string }> {
  try {
    const rows = await prisma.$queryRaw<{ code: string; label: string }[]>`
      SELECT "code", "label"
      FROM "OrderStatusType"
      WHERE "code" = ${fromCode} OR "code" = ${toCode};
    `;
    const map = new Map(rows.map((r) => [r.code, r.label]));
    return {
      fromLabel: map.get(fromCode) ?? fromCode,
      toLabel: map.get(toCode) ?? toCode,
    };
  } catch {
    return { fromLabel: fromCode, toLabel: toCode };
  }
}

export type OrderStatusMailContext = {
  orderId: string;
  orderNumber: string | null;
  customerName: string;
  customerEmail: string;
  fromStatus: string;
  toStatus: string;
  note: string | null;
  changedBy: string;
};

/**
 * Interní upozornění + volitelně zákazníkovi (ORDER_STATUS_NOTIFY_CUSTOMER=true).
 */
export async function sendOrderStatusChangeMails(ctx: OrderStatusMailContext): Promise<void> {
  if (ctx.fromStatus === ctx.toStatus) return;

  const { fromLabel, toLabel } = await resolveStatusLabels(ctx.fromStatus, ctx.toStatus);
  let siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://qapi.cz").trim().replace(/\/$/, "");
  siteUrl = /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`;
  const orderRef = ctx.orderNumber?.trim() || ctx.orderId.slice(0, 12);
  const internalTo = process.env.ORDER_NOTIFY_EMAIL?.trim() || "objednavky@qapi.cz";
  const replyTo = process.env.MAIL_REPLY_TO?.trim() || internalTo;

  const noteBlock = ctx.note
    ? `\nPoznámka: ${ctx.note}\n`
    : "";
  const noteHtml = ctx.note
    ? `<p><strong>Poznámka:</strong> ${escapeHtml(ctx.note)}</p>`
    : "";

  const internalSubject = `Stav objednávky ${orderRef}: ${fromLabel} → ${toLabel}`;
  const internalText = [
    `Změna stavu objednávky`,
    `Objednávka: ${orderRef} (id ${ctx.orderId})`,
    `Zákazník: ${ctx.customerName} <${ctx.customerEmail}>`,
    `Změna: ${fromLabel} → ${toLabel}`,
    `Provedl: ${ctx.changedBy}`,
    noteBlock,
    siteUrl,
  ].join("\n");

  const internalHtml = `
    <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;">
      <p><strong>Změna stavu objednávky</strong></p>
      <p>Objednávka: <strong>${escapeHtml(orderRef)}</strong></p>
      <p>Zákazník: ${escapeHtml(ctx.customerName)} &lt;${escapeHtml(ctx.customerEmail)}&gt;</p>
      <p>${escapeHtml(fromLabel)} → <strong>${escapeHtml(toLabel)}</strong></p>
      <p>Provedl: ${escapeHtml(ctx.changedBy)}</p>
      ${noteHtml}
      <p><a href="${escapeHtml(siteUrl)}">${escapeHtml(siteUrl)}</a></p>
    </div>`;

  await sendMail({
    to: internalTo,
    replyTo,
    subject: internalSubject,
    text: internalText,
    html: internalHtml,
  });

  if (process.env.ORDER_STATUS_NOTIFY_CUSTOMER !== "true") return;

  const custSubject = `Stav vaší objednávky ${orderRef} byl aktualizován`;
  const custText = [
    `Dobrý den, ${ctx.customerName},`,
    "",
    `stav vaší objednávky ${orderRef} se změnil na: ${toLabel}.`,
    ctx.note ? `\nPoznámka od týmu: ${ctx.note}\n` : "",
    "",
    `V případě dotazů nás kontaktujte na ${internalTo}.`,
    "",
    `Tým QAPI`,
    siteUrl,
  ].join("\n");

  const custHtml = `
    <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;">
      <p>Dobrý den, <strong>${escapeHtml(ctx.customerName)}</strong>,</p>
      <p>stav vaší objednávky <strong>${escapeHtml(orderRef)}</strong> se změnil na: <strong>${escapeHtml(toLabel)}</strong>.</p>
      ${ctx.note ? `<p><strong>Poznámka:</strong> ${escapeHtml(ctx.note)}</p>` : ""}
      <p>V případě dotazů nás kontaktujte na <a href="mailto:${escapeHtml(internalTo)}">${escapeHtml(internalTo)}</a>.</p>
      <p>Tým QAPI</p>
    </div>`;

  await sendMail({
    to: ctx.customerEmail,
    replyTo,
    subject: custSubject,
    text: custText,
    html: custHtml,
  });
}

export async function loadOrderForStatusChange(orderId: string): Promise<{
  status: string;
  customerEmail: string;
  customerName: string;
  orderNumber: string | null;
} | null> {
  try {
    const rows = await prisma.$queryRaw<
      Array<{
        status: string;
        customerEmail: string;
        customerName: string;
        orderNumber: string | null;
      }>
    >`
      SELECT "status", "customerEmail", "customerName", "orderNumber"
      FROM "Order"
      WHERE "id" = ${orderId}
      LIMIT 1;
    `;
    return rows[0] ?? null;
  } catch {
    try {
      const rows = await prisma.$queryRaw<
        Array<{
          status: string;
          customerEmail: string;
          customerName: string;
        }>
      >`
        SELECT "status", "customerEmail", "customerName"
        FROM "Order"
        WHERE "id" = ${orderId}
        LIMIT 1;
      `;
      const row = rows[0];
      if (!row) return null;
      return { ...row, orderNumber: null };
    } catch {
      return null;
    }
  }
}
