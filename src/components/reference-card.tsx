"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff, MapPin } from "lucide-react";
import type { ReferenceItem } from "@/data/references";

type ReferenceCardProps = {
  item: ReferenceItem;
};

function RefImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
}) {
  const [failed, setFailed] = useState(false);
  const isRemote = src.startsWith("http://") || src.startsWith("https://");

  if (failed) {
    return (
      <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 bg-[#eaecef] p-4 text-center text-black/40">
        <ImageOff className="h-8 w-8" strokeWidth={1.25} />
        <p className="text-[10px] font-medium">
          Doplňte soubor do <code className="rounded bg-black/5 px-1">public{src}</code>
        </p>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      sizes={sizes}
      className={className}
      unoptimized={isRemote}
      onError={() => setFailed(true)}
    />
  );
}

export default function ReferenceCard({ item }: ReferenceCardProps) {
  const hasBefore = Boolean(item.imageBefore);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-card shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)]">
      <div className="relative overflow-hidden bg-[#f0f0f2]">
        {hasBefore ? (
          <div className="grid grid-cols-2 gap-px bg-black/10">
            <div className="relative">
              <span className="absolute left-2 top-2 z-10 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                Před
              </span>
              <RefImage
                src={item.imageBefore!}
                alt={`${item.title} — před realizací`}
                className="aspect-[4/3] h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="relative">
              <span className="absolute left-2 top-2 z-10 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                Po
              </span>
              <RefImage
                src={item.image}
                alt={`${item.title} — po realizaci`}
                className="aspect-[4/3] h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>
        ) : (
          <div className="relative aspect-[4/3]">
            <RefImage
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        {item.tags?.length ? (
          <div className="pointer-events-none absolute bottom-2 left-2 flex flex-wrap gap-1 sm:bottom-auto sm:left-2 sm:top-2">
            {item.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary shadow-sm backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-heading text-lg font-semibold leading-snug text-primary">{item.title}</h2>
        <p className="mt-1 text-sm font-medium text-primary">{item.subtitle}</p>
        {item.quote ? (
          <blockquote className="mt-3 border-l-2 border-primary/35 pl-3 text-xs leading-relaxed text-black/70 italic">
            „{item.quote}“
          </blockquote>
        ) : null}
        <p className="mt-3 flex items-center gap-1.5 text-xs text-black/55">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/80" strokeWidth={2} />
          {item.location}
        </p>
      </div>
    </article>
  );
}
