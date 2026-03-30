"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { normalizeForSearch } from "@/lib/search";
import { SHOP_CATEGORY_LINKS } from "@/lib/shop-nav";
import { DEPOSIT_PRODUCT_HREF } from "@/lib/storefront-paths";

/** Jednoduché směrování dotazu na kategorii / zálohu (bez fulltext DB — jako rychlý „Alza“ vstup). */
function resolveSearchHref(query: string): string {
  const q = normalizeForSearch(query.trim());
  if (!q) return "/#kategorie";

  const [catVrata, catVenkovni, catInterier] = SHOP_CATEGORY_LINKS;
  const rules: { test: RegExp; href: string }[] = [
    { test: /vrat|garaz|sekcni|rolovac|prumysl/i, href: catVrata.href },
    { test: /venkov|screen|exteri/i, href: catVenkovni.href },
    { test: /interier|horizontal|plise|den\s*a\s*noc|latkov/i, href: catInterier.href },
    { test: /screen\s*v?s|screenova|klasicka\s*roleta/i, href: "/technicke-navody/screen-vs-klasicka-roleta" },
    { test: /nouzov|vypadk|proud|otevrit\s*vrata/i, href: "/technicke-navody/nouzove-otevreni-vrat-pri-vypadku-proudu" },
    { test: /kastlik|zaluzie|fasad|stavebni\s*pripraven/i, href: "/technicke-navody/kastlik-pro-zaluzie" },
    { test: /zaloh|rezervac|technik|zameren/i, href: DEPOSIT_PRODUCT_HREF },
    { test: /stav|pripraven|kastlik|osteni|napajen/i, href: "/stavebni-pripravenost" },
    { test: /kontakt|poptav|email|telefon/i, href: "/kontakt" },
    { test: /jak\s|objedn|postup|probih/i, href: "/jak-probiha-objednavka" },
  ];

  for (const { test, href } of rules) {
    if (test.test(q)) return href;
  }
  return "/#kategorie";
}

type HeaderCatalogSearchProps = {
  className?: string;
  id?: string;
  /** Např. zavřít mobilní menu po přesměrování */
  onAfterSubmit?: () => void;
};

export default function HeaderCatalogSearch({ className = "", id, onAfterSubmit }: HeaderCatalogSearchProps) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const href = resolveSearchHref(value);
    trackEvent("header_catalog_search", { queryLength: value.trim().length, target: href });
    router.push(href);
    setValue("");
    onAfterSubmit?.();
  }

  return (
    <form
      id={id}
      onSubmit={submit}
      className={`relative flex w-full items-center ${className}`}
      role="search"
      aria-label="Hledat v sortimentu"
    >
      <label htmlFor="header-catalog-search-input" className="sr-only">
        Hledat v sortimentu
      </label>
      <input
        id="header-catalog-search-input"
        type="search"
        name="q"
        autoComplete="off"
        placeholder="Hledat v sortimentu (vrata, žaluzie, záloha…)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-11 w-full rounded-lg border border-black/[0.12] bg-[#f7f7f8] py-2 pl-4 pr-12 text-sm text-foreground outline-none transition placeholder:text-black/40 focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/20"
      />
      <button
        type="submit"
        className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-md bg-accent text-white transition hover:bg-foreground"
        aria-label="Hledat"
      >
        <Search className="h-4 w-4" strokeWidth={2} />
      </button>
    </form>
  );
}
