-- QAPI e-shop: AR/3D fields for products
-- Run after 002_catalog.sql

BEGIN;

ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "arModelGlbUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "arModelUsdzUrl" TEXT;

-- Optional defaults for core products (can be replaced later)
UPDATE "Product"
SET "arModelGlbUrl" = COALESCE("arModelGlbUrl", '/models/' || "slug" || '.glb'),
    "arModelUsdzUrl" = COALESCE("arModelUsdzUrl", '/models/' || "slug" || '.usdz')
WHERE "slug" IN (
  'garazova-vrata',
  'prumyslova-vrata',
  'venkovni-zaluzie',
  'screenove-rolety',
  'horizontalni-zaluzie',
  'latkove-zaluzie-plise',
  'zaloha-na-zakazku'
);

COMMIT;
