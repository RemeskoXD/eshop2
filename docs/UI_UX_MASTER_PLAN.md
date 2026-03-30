# UI/UX Master Plan (Shadeon-inspired)

Zivy dokument pro postupny redesign frontendu. Po kazdem kroku aktualizujeme stav.

## 0) Foundation & Design System

- [x] Audit a sjednoceni soucasnych UI patterns (cards, spacing, radius, shadows, typografie, CTA hierarchy).
- [x] Definice Shadeon-inspired design tokens v `globals.css` (primary, secondary, neutral, accent, gradients, surfaces, borders, focus states).
- [x] Zavedeni konzistentniho systemu komponent (Button, Badge, SectionHeader, Card, Chip, EmptyState, TrustItem).
- [x] Nastaveni typograficke skaly (hero/title/body/caption) a responzivnich pravidel.
- [x] Pridani motion guidelines (micro-interactions, hover/focus, reveal animations) bez degradace vykonu.

## 1) Global Layout Revamp (Navbar, Footer, Branding)

- [x] Redesign hlavni hlavicky na premium e-commerce standard (jasna hierarchie: logo, search, category shortcuts, cart, CTA).
- [x] Pridani prominentniho branding prvku: "Proud Partner of Shadeon" (header strip + dedicated section).
- [x] Vizualni upgrade trust stripu (garance, montaz po CR, podpora, transparentni proces).
- [x] Refaktor paticky do moderniho multi-column layoutu (kontakt, sluzby, legal, quick links, partner block).
- [x] Globalni a11y polishing (skip link, focus-visible consistency, semantic landmarks).

## 2) Homepage Redesign (High-end, Conversion-first)

- [x] Kompletne prepracovany Hero: silny value proposition, CTA na vyber kategorie + CTA na konzultaci/zalohu.
- [x] Integrace "Shadeon partner credibility" sekce s badge + kratky text partnerstvi.
- [x] Zjednodusena "Find your solution" sekce: 3 hlavni cesty (Vrata / Venkovni stineni / Interierove stineni).
- [x] Upgrade sekce kategorii na vizualni, rychlou a "zero-friction" orientaci.
- [x] Pridani premium trust proof sekci (realizace, reference highlights, proces v 3-4 krocich).
- [x] CTA funnel tuning (sticky/mobile CTA, jasne dalsi kroky bez rozhodovaciho sumu).

## 3) Product Discovery & Navigation (Small Catalog, Zero Friction)

- [x] Zjednoduseni IA (information architecture) pro maly katalog: minimum kliku ke spravnemu produktu.
- [x] Ladeni kategorie page UX: filtry + sort + active chips + URL sync.
- [x] Dokonceni inline Quick View flow jako primarni discovery pattern (home + category parity, smooth row expansion).
- [x] Dusledna konzistence "Quick View -> Add to Cart -> Full Product Page" cesty.
- [x] Pridani "Guided selection" prvku (napr. "Nevite co vybrat?" mini decision helper).
- [x] UX prazdnych stavu / no-results / reset filtru + analytika techto interakci.

## 4) 3D/AR "Wow Effect" Upgrade

- [x] Vizualni redesign 3D/AR bloku (lepsi framing, lighting feel, premium container styling).
- [x] Vylepseni `model-viewer` controls UX (camera hints, AR hints, loading skeleton, fallback states).
- [x] Pridani "Try in AR" prominence (clear CTA + compatibility hint iOS/Android).
- [x] Inline Quick View 3D pane polishing (tabs, transitions, perceived performance).
- [x] Full product page 3D/AR storytelling section (benefits + practical usage guidance).
- [x] Tracking AR engagement funnel (view, interact, AR attempt, add-to-cart after AR).

## 5) Product Detail Page Revamp (CMS-ready structure)

- [x] Redesign product detail template pro premium look (gallery/3D left, conversion box right, sticky summary).
- [x] UX pro custom products (jasne "orientacni cena", "finalni cena po zamereni", expectations management).
- [x] Standardizace props/data shape pro budouci CMS/Admin editaci obsahu (title, body, specs, media, AR assets).
- [x] Sekce "Why this product", "Specifications", "Process after order", "FAQ" s konzistentnim stylem.
- [x] Cross-linking na related products / category shortcuts.

## 6) Checkout & Trust Conversion Polish

- [x] Vizualni upgrade kosiku a pokladny (enterprise-like clarity + low-friction form UX).
- [x] Pridani progress confidence cues (security, process expectations, what happens next).
- [x] Rework order confirmation page (premium success state + crystal-clear next steps + payment details hierarchy).
- [x] Dotazeni microcopy (jasna, strucna, duveryhodna, bez nejistoty).
- [x] Mobile-first kontrola CTA a readability v celem nakupnim flow.

## 7) Performance, SEO, Accessibility Final Pass

- [x] UI performance pass (layout shift reduction, image strategy, component-level optimization).
- [x] SEO pass (metadata consistency, schema.org enrichment, internal linking quality).
- [x] Accessibility QA pass (keyboard flow, contrast, focus order, semantic headings).
- [x] Visual regression sanity pass across key routes.
- [x] Final polish pass: spacing consistency, iconography consistency, premium detail quality.

## 8) Release Readiness

- [x] Update docs/checklist with completed UI/UX milestones.
- [x] Prepare before/after summary for deployment review.
- [x] Final lint/build/test pass before production rollout. (`npm run lint` + `npm run build` + `npm run test` OK)

---

## Audit Summary (step 0.1 completed)

Soucasny stav je funkcni a uz obsahuje nekolik modernich prvku (inline quick view, trust strip, sticky CTA, kroky checkoutu), ale vizualni jazyk neni jeste plne sjednoceny.

### Co uz je dobre

- Konzistentni rounded card styl ve vetsine shop pages.
- Silny zaklad navigace + trust messaging.
- Funkcni 3D/AR body (`model-viewer`) a inline quick view.
- Zavedene loading/error fallbacky a zaklad SEO metadata.

### Kde je nejvetsi potencial

- Sjednotit tokeny barev a surface hierarchy do jasne "premium" palety.
- Sjednotit velikosti CTA, stiny, border contrast a vertical rhythm.
- Doplnit jasny brand anchor "Proud Partner of Shadeon".
- Zjemnit microcopy a interakce (jednotny ton, mene technickych textu v user-facing castech).

### Prakticka pravidla pro dalsi kroky

- Jedna primarni CTA na sekci, maximalne jedna sekundarni.
- Vsechny karty: stejny radius + border opacity + shadow progression.
- Jedna typograficka hierarchie napric strankami (hero > section title > card title > body).
- 3D/AR bloky: konzistentni label, hint a fallback ve vsech kontextech.
