"use client";

import Link from "next/link";
import { Star, ShieldCheck } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

function clampNumber(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function getReviewsConfig() {
  const url = (process.env.NEXT_PUBLIC_REVIEWS_URL || "").trim() || "/reference";
  const ratingRaw = Number((process.env.NEXT_PUBLIC_REVIEWS_RATING || "4.9").trim());
  const countRaw = Number((process.env.NEXT_PUBLIC_REVIEWS_COUNT || "1000").trim());

  const rating = Number.isFinite(ratingRaw) ? clampNumber(ratingRaw, 0, 5) : 4.9;
  const count = Number.isFinite(countRaw) ? Math.max(0, Math.round(countRaw)) : 1000;
  const isExternal = url.startsWith("http://") || url.startsWith("https://");

  return { url, rating, count, isExternal };
}

export default function ReviewsProof({ className = "" }: { className?: string }) {
  const { url, rating, count, isExternal } = getReviewsConfig();
  const fullStars = Math.floor(rating);

  const content = (
    <div className={`ui-motion ui-hover-lift flex items-center justify-between gap-4 rounded-2xl border border-black/[0.08] bg-card px-4 py-3 shadow-sm ${className}`}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/25">
          <Star className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">Hodnocení zákazníků</p>
          <p className="mt-0.5 text-xs text-foreground/70">
            {rating.toFixed(1)} / 5 · {count.toLocaleString("cs-CZ")}+ recenzí
          </p>
          <div className="mt-1 flex items-center gap-0.5 text-accent" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3.5 w-3.5 ${i < fullStars ? "fill-current" : "opacity-25"}`} />
            ))}
          </div>
        </div>
      </div>
      <div className="hidden items-center gap-2 rounded-xl border border-black/[0.06] bg-strip/70 px-3 py-2 text-xs font-semibold text-foreground/80 sm:flex">
        <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={1.75} />
        Ověřený proces
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackEvent("reviews_proof_click", { target: "external" })}
        className="block"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={url}
      onClick={() => trackEvent("reviews_proof_click", { target: "internal" })}
      className="block"
    >
      {content}
    </Link>
  );
}

