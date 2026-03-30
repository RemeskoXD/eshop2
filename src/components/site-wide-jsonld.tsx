import JsonLd from "@/components/json-ld";
import { getPublicContactInfo } from "@/lib/contact";
import { getSiteUrl } from "@/lib/site";

export default function SiteWideJsonLd() {
  const base = getSiteUrl();
  const contact = getPublicContactInfo();
  const telephone = contact.phoneHref.replace(/^tel:/, "") || "+420777000000";

  const graph = [
    {
      "@type": "Organization",
      "@id": `${base}/#organization`,
      name: "QAPI",
      url: base,
      description: "Vrata a stínění na míru — zakázková výroba, zaměření technikem a montáž po celé ČR.",
      email: contact.email,
      telephone,
      areaServed: { "@type": "Country", name: "CZ" },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: contact.email,
        telephone,
        areaServed: "CZ",
        availableLanguage: ["cs"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${base}/#website`,
      name: "QAPI e-shop",
      url: base,
      publisher: { "@id": `${base}/#organization` },
      inLanguage: "cs-CZ",
    },
  ];

  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}
