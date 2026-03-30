import type { Metadata } from "next";
import ProductGrid from "@/components/product-grid/product-grid";
import { mockProducts } from "@/lib/mocks/products";

export const metadata: Metadata = {
  title: "Demo mřížky produktů | QAPI",
  description:
    "Interní ukázka: mřížka produktů s vloženým rychlým náhledem a 3D/AR (neindexuje se).",
  robots: { index: false, follow: false },
};

export default function ProductGridDemoPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Demo</p>
      <h1 className="font-heading mt-2 text-3xl font-semibold text-primary sm:text-4xl">
        Mřížka produktů s rychlým náhledem a 3D/AR
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-black/70 sm:text-base">
        Klikněte na <strong>Rychlý náhled</strong> u karty — panel se rozvine přímo pod řádkem a posune obsah níže
        (bez modálního okna).
      </p>

      <div className="mt-8">
        <ProductGrid products={mockProducts} />
      </div>
    </main>
  );
}
