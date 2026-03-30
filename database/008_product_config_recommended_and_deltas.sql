-- QAPI e-shop: doporučená varianta u pole + orientační příplatky u voleb (záloha / budoucí produkty)
-- Spusťte po 002_catalog.sql (idempotentní).

BEGIN;

ALTER TABLE "ProductConfigField"
  ADD COLUMN IF NOT EXISTS "recommendedOption" TEXT NULL;

ALTER TABLE "ProductConfigOption"
  ADD COLUMN IF NOT EXISTS "priceDeltaCzk" INTEGER NULL;

UPDATE "ProductConfigField" SET "sortOrder" = 55 WHERE "id" = 'fld_zaloha_sirka';
UPDATE "ProductConfigField" SET "sortOrder" = 65 WHERE "id" = 'fld_zaloha_vyska';

INSERT INTO "ProductConfigField" ("id", "productId", "label", "fieldType", "placeholder", "sortOrder", "recommendedOption")
VALUES (
  'fld_zaloha_ovladani',
  'prd_zaloha',
  'Ovládání a doplňky',
  'select',
  NULL,
  45,
  'Střední (dálkové ovládání, časovač)'
)
ON CONFLICT ("id") DO UPDATE SET
  "productId" = EXCLUDED."productId",
  "label" = EXCLUDED."label",
  "fieldType" = EXCLUDED."fieldType",
  "placeholder" = EXCLUDED."placeholder",
  "sortOrder" = EXCLUDED."sortOrder",
  "recommendedOption" = EXCLUDED."recommendedOption";

INSERT INTO "ProductConfigOption" ("id", "fieldId", "value", "sortOrder", "priceDeltaCzk")
VALUES
  ('opt_zaloha_ovlad_1', 'fld_zaloha_ovladani', 'Základní (manuál / lokální spínač)', 10, 0),
  ('opt_zaloha_ovlad_2', 'fld_zaloha_ovladani', 'Střední (dálkové ovládání, časovač)', 20, 3500),
  ('opt_zaloha_ovlad_3', 'fld_zaloha_ovladani', 'Prémiové (Smart Home / motor s aplikací)', 30, 8900)
ON CONFLICT ("id") DO UPDATE SET
  "fieldId" = EXCLUDED."fieldId",
  "value" = EXCLUDED."value",
  "sortOrder" = EXCLUDED."sortOrder",
  "priceDeltaCzk" = EXCLUDED."priceDeltaCzk";

COMMIT;
