import type { Metadata } from "next";
import type { ReactNode } from "react";
import { absoluteUrl } from "@/lib/site";

const PATH = "/kosik";

export const metadata: Metadata = {
  title: "Košík | QAPI",
  description: "Rekapitulace objednávky vrat a stínění na míru — úprava položek a přechod k pokladně.",
  alternates: { canonical: absoluteUrl(PATH) },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Košík | QAPI",
    description: "Váš košík — dokončete objednávku nebo pokračujte v konfiguraci.",
    url: PATH,
  },
};

export default function KosikLayout({ children }: { children: ReactNode }) {
  return children;
}
