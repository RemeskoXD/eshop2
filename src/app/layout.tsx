import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { CartProvider } from "@/components/cart-provider";
import SiteChrome from "@/components/site-chrome";
import SiteWideJsonLd from "@/components/site-wide-jsonld";
import { getSiteUrl } from "@/lib/site";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [{ url: "/icons/app-icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/app-icon.svg" }],
  },
  title: "QAPI e-shop | Vrata a stínění na míru",
  description:
    "Zakázková řešení vrat, venkovního i interiérového stínění. Přehledná konfigurace, zaměření technikem a odborná montáž.",
  keywords: ["vrata", "stínění", "žaluzie", "rolety", "pergoly", "zakázka na míru"],
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: "QAPI",
    title: "QAPI e-shop | Vrata a stínění na míru",
    description:
      "Zakázková řešení vrat, venkovního i interiérového stínění. Konfigurace online, zaměření technikem a montáž.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "QAPI e-shop | Vrata a stínění na míru",
    description:
      "Vrata a stínění na míru — přehledný e-shop, rezervace technika a transparentní proces.",
  },
  appleWebApp: {
    capable: true,
    title: "QAPI e-shop",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#c9a227",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="cs"
      className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary: ${settings.primaryColor};
              --accent: ${settings.accentColor};
              --background: ${settings.backgroundColor};
              --foreground: ${settings.textColor};
            }
            body {
              background-color: var(--background);
              color: var(--foreground);
            }
          `
        }} />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="skip-link"
        >
          Přeskočit na obsah
        </a>
        <SiteWideJsonLd />
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer@4.2.0/dist/model-viewer.min.js"
          strategy="afterInteractive"
        />
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
