E-shop **QAPI** (vrata, stínění) — [Next.js](https://nextjs.org) App Router, Prisma u objednávek, katalog z PostgreSQL nebo fallback v kódu.

### Databáze (PostgreSQL)

Spouštějte skripty ve složce `database/` v tomto pořadí (u existující DB jen chybějící čísla):

1. `init.sql`
2. `002_catalog.sql` — katalog, konfigurace produktů
3. `003_admin_and_order_status.sql`
4. `004_order_business_fields.sql`
5. `005_analytics.sql`
6. `006_product_ar_fields.sql`
7. `007_order_status_history_actor.sql`
8. `008_product_config_recommended_and_deltas.sql` — doporučená varianta pole + příplatky voleb (záloha)
9. `009_catalog_recommended_hints.sql` — doporučené volby u ostatních produktů v katalogu
10. `010_lead_capture.sql` — ukládání leadů (checklist / měkké konverze)

Poté `npx prisma generate` (schéma Prisma pokrývá především objednávky; katalog je v SQL tabulkách z kroků výše).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
