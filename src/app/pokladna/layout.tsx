import type { Metadata } from "next";
import type { ReactNode } from "react";
import { absoluteUrl } from "@/lib/site";

const PATH = "/pokladna";

export const metadata: Metadata = {
  title: "Pokladna | QAPI",
  description:
    "Dokončení objednávky vrat a stínění — kontaktní údaje a odeslání poptávky. Platba zálohy až po domluvě s technikem.",
  alternates: { canonical: absoluteUrl(PATH) },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Pokladna | QAPI",
    description: "Bezpečné odeslání objednávky — nejdřív kontrola parametrů s technikem.",
    url: PATH,
  },
};

export default function PokladnaLayout({ children }: { children: ReactNode }) {
  return children;
}
