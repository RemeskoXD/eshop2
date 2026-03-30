"use client";

import Image from "next/image";
import type { MockProduct } from "@/lib/mocks/products";

type ProductCardProps = {
  product: MockProduct;
  isOpen: boolean;
  onQuickView: (productId: string) => void;
};

export default function ProductCard({ product, isOpen, onQuickView }: ProductCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-[#f3f3f5]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold text-primary">{product.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-black/65">{product.shortDescription}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-primary">{product.price.toLocaleString("cs-CZ")} Kč</p>
            <p className="mt-0.5 text-[11px] text-foreground/60">Orientační cena</p>
          </div>
          <button
            type="button"
            onClick={() => onQuickView(product.id)}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              isOpen
                ? "bg-black text-white hover:bg-black/85"
                : "bg-accent text-white hover:bg-foreground"
            }`}
          >
            {isOpen ? "Zavřít náhled" : "Rychlý náhled"}
          </button>
        </div>
      </div>
    </article>
  );
}
