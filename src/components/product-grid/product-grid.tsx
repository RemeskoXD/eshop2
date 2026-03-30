"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useCart } from "@/components/cart-provider";
import ProductCard from "@/components/product-grid/product-card";
import QuickViewPanel from "@/components/product-grid/quick-view-panel";
import { trackEvent } from "@/lib/analytics";
import type { MockProduct } from "@/lib/mocks/products";

type ProductGridProps = {
  products: MockProduct[];
};

function getColumnCount(): 1 | 2 | 3 | 4 {
  if (typeof window === "undefined") return 4;
  if (window.matchMedia("(min-width: 1280px)").matches) return 4;
  if (window.matchMedia("(min-width: 1024px)").matches) return 3;
  if (window.matchMedia("(min-width: 640px)").matches) return 2;
  return 1;
}

/**
 * Main ProductGrid component:
 * - Responsive grid cards
 * - Inline quick view expansion (row-aware, not modal)
 * - Smooth layout shifts via CSS transitions
 */
export default function ProductGrid({ products }: ProductGridProps) {
  const { addItem } = useCart();
  const [openProductId, setOpenProductId] = useState<string | null>(null);
  const [columns, setColumns] = useState<1 | 2 | 3 | 4>(getColumnCount);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setColumns(getColumnCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const openProductIndex = useMemo(
    () => products.findIndex((p) => p.id === openProductId),
    [openProductId, products],
  );

  function toggleQuickView(productId: string) {
    setOpenProductId((prev) => (prev === productId ? null : productId));
    trackEvent("quick_view_toggle", { productId });
  }

  function handleAddToCart(product: MockProduct) {
    addItem({
      id: `${product.id}-${Date.now()}`,
      name: product.title,
      unitPrice: product.price,
      quantity: 1,
      config: { source: "quick-view" },
    });
    trackEvent("quick_view_add_to_cart", { productId: product.id, price: product.price });
  }

  const nodes: ReactNode[] = [];

  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    const isOpen = openProductId === product.id;

    nodes.push(
      <div key={`card-${product.id}`} className="transition-all duration-300">
        <ProductCard product={product} isOpen={isOpen} onQuickView={toggleQuickView} />
      </div>,
    );

    const rowStart = i - (i % columns);
    const rowEnd = Math.min(rowStart + columns - 1, products.length - 1);
    const isLastInRow = i === rowEnd;
    const isOpenInThisRow = openProductIndex >= rowStart && openProductIndex <= rowEnd;

    if (isLastInRow && isOpenInThisRow && openProductIndex >= 0) {
      const selected = products[openProductIndex];
      nodes.push(
        <div
          key={`quick-row-${rowStart}`}
          className="col-span-full overflow-hidden transition-all duration-300 ease-out"
        >
          <QuickViewPanel product={selected} onAddToCart={handleAddToCart} />
        </div>,
      );
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {nodes}
    </div>
  );
}
