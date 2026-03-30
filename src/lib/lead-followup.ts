export function buildLeadFollowUpTemplate(source: string): { subject: string; body: string } {
  const sourceLabel = source.trim() || "web";
  const subject = `Navázání na poptávku (${sourceLabel}) – QAPI`;

  const sourceHint =
    sourceLabel === "stavebni-pripravenost"
      ? "Vidím, že jste řešil stavební připravenost. Pokud chcete, projdeme spolu konkrétní rozměry a montážní podmínky."
      : sourceLabel === "configurator"
        ? "Vidím, že jste měl rozpracovanou konfiguraci. Rád pomohu s posledními kroky před objednávkou."
        : "Děkujeme za váš zájem. Rád pomohu s výběrem varianty a ověřením rozměrů.";

  const body = [
    "Dobrý den,",
    "",
    sourceHint,
    "",
    "Můžeme navázat krátkým hovorem (10–15 minut), kde doladíme:",
    "- vhodnou variantu produktu,",
    "- orientační rozměry a připravenost stavby,",
    "- další postup (zaměření, termín, výroba).",
    "",
    "Stačí odpovědět na tento e-mail s preferovaným časem.",
    "",
    "S pozdravem",
    "QAPI",
  ].join("\n");

  return { subject, body };
}

export function buildLeadFollowUpMailto(email: string, source: string): string {
  const { subject, body } = buildLeadFollowUpTemplate(source);
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
