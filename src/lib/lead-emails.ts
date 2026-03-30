import { isSmtpConfigured, sendMail } from "@/lib/mail";

type LeadContext = {
  email: string;
  phone?: string;
  source: string;
};

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendLeadMagnetEmails(ctx: LeadContext): Promise<{
  customer: "sent" | "skipped" | "failed";
  internal: "sent" | "skipped" | "failed";
}> {
  const internalTo = process.env.ORDER_NOTIFY_EMAIL?.trim() || "objednavky@qapi.cz";
  let publicSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://qapi.cz").trim().replace(/\/$/, "");
  publicSiteUrl = /^https?:\/\//i.test(publicSiteUrl) ? publicSiteUrl : `https://${publicSiteUrl}`;
  const checklistUrl =
    process.env.NEXT_PUBLIC_CHECKLIST_URL?.trim() || `${publicSiteUrl.replace(/\/$/, "")}/stavebni-pripravenost`;

  const customerSubject = "Checklist: 5 chyb při zaměřování (QAPI)";
  const customerText = [
    "Dobrý den,",
    "",
    "děkujeme za zájem o checklist před objednávkou.",
    "Najdete ho zde:",
    checklistUrl,
    "",
    "Pokud chcete, projdeme s vámi zdarma i konkrétní rozměry a připravenost stavby.",
    "Stačí odpovědět na tento e-mail nebo zavolat.",
    "",
    "Tým QAPI",
  ].join("\n");
  const customerHtml = `
    <div style="font-family:system-ui,Segoe UI,sans-serif;line-height:1.5;color:#111;">
      <p>Dobrý den,</p>
      <p>děkujeme za zájem o checklist před objednávkou.</p>
      <p>
        Najdete ho zde:<br/>
        <a href="${escapeHtml(checklistUrl)}">${escapeHtml(checklistUrl)}</a>
      </p>
      <p>Pokud chcete, projdeme s vámi zdarma i konkrétní rozměry a připravenost stavby.</p>
      <p>Tým QAPI</p>
    </div>
  `;

  const internalSubject = "Nový lead: checklist stavební připravenost";
  const internalText = [
    "Nový lead z formuláře checklistu.",
    "",
    `E-mail: ${ctx.email}`,
    `Telefon: ${ctx.phone || "neuveden"}`,
    `Zdroj: ${ctx.source}`,
  ].join("\n");
  const internalHtml = `
    <div style="font-family:system-ui,Segoe UI,sans-serif;line-height:1.5;color:#111;">
      <h3 style="margin:0 0 8px;">Nový lead z formuláře checklistu</h3>
      <ul>
        <li>E-mail: <a href="mailto:${escapeHtml(ctx.email)}">${escapeHtml(ctx.email)}</a></li>
        <li>Telefon: ${escapeHtml(ctx.phone || "neuveden")}</li>
        <li>Zdroj: ${escapeHtml(ctx.source)}</li>
      </ul>
    </div>
  `;

  const [customerResult, internalResult] = await Promise.all([
    sendMail({
      to: ctx.email,
      subject: customerSubject,
      text: customerText,
      html: customerHtml,
    }),
    sendMail({
      to: internalTo,
      subject: internalSubject,
      text: internalText,
      html: internalHtml,
      replyTo: ctx.email,
    }),
  ]);

  return {
    customer: customerResult.ok ? "sent" : isSmtpConfigured() ? "failed" : "skipped",
    internal: internalResult.ok ? "sent" : isSmtpConfigured() ? "failed" : "skipped",
  };
}
