import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { productDetailHref } from "@/lib/storefront-paths";

type ProductTileProps = {
  slug: string;
  name: string;
  image: string;
  description?: string;
  priceText?: string;
  /** Kratší karta na úvodní stránce */
  compact?: boolean;
};

export default function ProductTile({
  slug,
  name,
  image,
  description,
  priceText,
  compact,
}: ProductTileProps) {
  return (
    <Link
      href={productDetailHref(slug)}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-black/[0.1] bg-card shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-black/[0.14] hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f3f3f5]">
        <Image
          src={image}
          alt={name}
          width={640}
          height={480}
          sizes={compact ? "(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw" : "(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded border border-black/[0.06] bg-white/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground/75 shadow-sm backdrop-blur-sm">
          <Package className="h-3 w-3 text-primary" strokeWidth={2} />
          Na zakázku
        </span>
      </div>
      <div className="flex flex-1 flex-col border-t border-black/[0.06] p-4 sm:p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-primary group-hover:text-primary sm:text-lg">
          {name}
        </h3>
        {!compact && description ? (
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-black/60">{description}</p>
        ) : null}
        {priceText ? (
          <p className="mt-3 text-lg font-bold tracking-tight text-primary">{priceText}</p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary">
          Konfigurovat
          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
