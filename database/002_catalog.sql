-- QAPI e-shop: catalog schema + seed data
-- Run after database/init.sql
--
-- Existující databáze ze starší verze: sloupce + záloha „Ovládání a doplňky“ — 008;
-- doporučené volby u ostatních produktů — 009_catalog_recommended_hints.sql
--
-- JAK SPUSTIT (PostgreSQL):
-- • psql:  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/002_catalog.sql
-- • pgAdmin / DBeaver: otevři Query Tool, vlož CELÝ soubor a spusť (F5).
-- • phpPgAdmin: před „Provést“ VYPNI zaškrtávátko „Stránkovat výsledky“ — jinak nástroj
--   obalí skript do SELECT COUNT(*) FROM (...) a PostgreSQL hlásí chybu u řádku BEGIN;
--
BEGIN;

CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT PRIMARY KEY,
  "categoryId" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "image" TEXT NOT NULL,
  "basePriceText" TEXT NOT NULL,
  "basePriceAmount" INTEGER NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "Product_categoryId_fkey"
    FOREIGN KEY ("categoryId")
    REFERENCES "Category" ("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ProductConfigField" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "fieldType" TEXT NOT NULL CHECK ("fieldType" IN ('select', 'number')),
  "placeholder" TEXT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "recommendedOption" TEXT NULL,
  CONSTRAINT "ProductConfigField_productId_fkey"
    FOREIGN KEY ("productId")
    REFERENCES "Product" ("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ProductConfigOption" (
  "id" TEXT PRIMARY KEY,
  "fieldId" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "priceDeltaCzk" INTEGER NULL,
  CONSTRAINT "ProductConfigOption_fieldId_fkey"
    FOREIGN KEY ("fieldId")
    REFERENCES "ProductConfigField" ("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Category_sortOrder_idx" ON "Category" ("sortOrder");
CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product" ("categoryId");
CREATE INDEX IF NOT EXISTS "Product_sortOrder_idx" ON "Product" ("sortOrder");
CREATE INDEX IF NOT EXISTS "ProductConfigField_productId_idx" ON "ProductConfigField" ("productId");
CREATE INDEX IF NOT EXISTS "ProductConfigOption_fieldId_idx" ON "ProductConfigOption" ("fieldId");

-- Seed: categories
INSERT INTO "Category" ("id", "slug", "title", "description", "sortOrder", "isActive")
VALUES
  ('cat_vrata', 'vrata', 'Vrata', 'Garážová, průmyslová i speciální vrata na míru.', 10, TRUE),
  ('cat_venkovni', 'venkovni-stineni', 'Venkovní stínění', 'Efektivní ochrana před sluncem, teplem i pohledy zvenčí.', 20, TRUE),
  ('cat_interier', 'interierove-stineni', 'Interiérové stínění', 'Žaluzie a rolety do interiéru s širokou nabídkou barev a látek.', 30, TRUE)
ON CONFLICT ("slug") DO UPDATE
SET
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "sortOrder" = EXCLUDED."sortOrder",
  "isActive" = EXCLUDED."isActive";

-- Seed: products
INSERT INTO "Product"
  ("id", "categoryId", "slug", "name", "description", "image", "basePriceText", "basePriceAmount", "isActive", "sortOrder")
VALUES
  ('prd_garazova_vrata', 'cat_vrata', 'garazova-vrata', 'Garážová vrata', 'Sekční a rolovací řešení s možností designu a povrchové úpravy.', '/IMAGE/sekvencni_garazova_vrata.webp', 'Na poptávku', NULL, TRUE, 10),
  ('prd_prumyslova_vrata', 'cat_vrata', 'prumyslova-vrata', 'Průmyslová vrata', 'Odolná vrata pro komerční a průmyslové provozy.', '/IMAGE/prumyslova-vrata.webp', 'Na poptávku', NULL, TRUE, 20),
  ('prd_venkovni_zaluzie', 'cat_venkovni', 'venkovni-zaluzie', 'Venkovní žaluzie', 'Moderní žaluzie s plynulou regulací světla.', '/IMAGE/venkovni_zaluzie.webp', 'Na poptávku', NULL, TRUE, 10),
  ('prd_screenove_rolety', 'cat_venkovni', 'screenove-rolety', 'Screenové rolety', 'Designové stínění s vysokou účinností a moderním vzhledem.', '/IMAGE/screenove_rolety.webp', 'Na poptávku', NULL, TRUE, 20),
  ('prd_horizontalni_zaluzie', 'cat_interier', 'horizontalni-zaluzie', 'Horizontální žaluzie', 'Klasické interiérové řešení s jednoduchým ovládáním.', '/IMAGE/horizontalnizaluzie.webp', 'Od 1 290 Kč', 1290, TRUE, 10),
  ('prd_latkove_plise', 'cat_interier', 'latkove-zaluzie-plise', 'Látkové žaluzie plisé', 'Plisé systémy s výběrem látek v cenových skupinách 1 až 5.', '/IMAGE/plise_zaluzie.webp', 'Od 1 990 Kč', 1990, TRUE, 20),
  ('prd_zaloha', 'cat_venkovni', 'zaloha-na-zakazku', 'Záloha na zakázku - vrata / venkovní stínění na míru', 'Záloha slouží k rezervaci termínu technika. V případě, že zakázku nebude možné technicky realizovat, je záloha vrácena v plné výši.', '/IMAGE/prodej_a_mont_____bez_logo.webp', '5 000 - 10 000 Kč', 5000, TRUE, 999)
ON CONFLICT ("slug") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "image" = EXCLUDED."image",
  "basePriceText" = EXCLUDED."basePriceText",
  "basePriceAmount" = EXCLUDED."basePriceAmount",
  "isActive" = EXCLUDED."isActive",
  "sortOrder" = EXCLUDED."sortOrder";

-- Upsert helper strategy: delete and recreate config for seeded products
DELETE FROM "ProductConfigOption"
WHERE "fieldId" IN (
  SELECT "id" FROM "ProductConfigField"
  WHERE "productId" IN (
    'prd_garazova_vrata',
    'prd_prumyslova_vrata',
    'prd_venkovni_zaluzie',
    'prd_screenove_rolety',
    'prd_horizontalni_zaluzie',
    'prd_latkove_plise',
    'prd_zaloha'
  )
);

DELETE FROM "ProductConfigField"
WHERE "productId" IN (
  'prd_garazova_vrata',
  'prd_prumyslova_vrata',
  'prd_venkovni_zaluzie',
  'prd_screenove_rolety',
  'prd_horizontalni_zaluzie',
  'prd_latkove_plise',
  'prd_zaloha'
);

-- Product config fields
INSERT INTO "ProductConfigField" ("id", "productId", "label", "fieldType", "placeholder", "sortOrder", "recommendedOption")
VALUES
  ('fld_garazova_varianta', 'prd_garazova_vrata', 'Varianta', 'select', NULL, 10, 'Sekční'),
  ('fld_garazova_design', 'prd_garazova_vrata', 'Design', 'select', NULL, 20, 'Hladký'),
  ('fld_garazova_povrch', 'prd_garazova_vrata', 'Druh povrchu', 'select', NULL, 30, NULL),
  ('fld_garazova_sirka', 'prd_garazova_vrata', 'Šířka (mm)', 'number', 'např. 2500', 40, NULL),
  ('fld_garazova_vyska', 'prd_garazova_vrata', 'Výška (mm)', 'number', 'např. 2125', 50, NULL),

  ('fld_prumysl_varianta', 'prd_prumyslova_vrata', 'Varianta', 'select', NULL, 10, 'Sekční'),
  ('fld_prumysl_design', 'prd_prumyslova_vrata', 'Design', 'select', NULL, 20, 'Plný panel'),
  ('fld_prumysl_sirka', 'prd_prumyslova_vrata', 'Šířka (mm)', 'number', 'např. 4000', 30, NULL),
  ('fld_prumysl_vyska', 'prd_prumyslova_vrata', 'Výška (mm)', 'number', 'např. 3500', 40, NULL),

  ('fld_venzalu_barva', 'prd_venkovni_zaluzie', 'Barva', 'select', NULL, 10, 'Standard'),
  ('fld_venzalu_sirka', 'prd_venkovni_zaluzie', 'Šířka (mm)', 'number', 'např. 1800', 20, NULL),
  ('fld_venzalu_vyska', 'prd_venkovni_zaluzie', 'Výška (mm)', 'number', 'např. 1500', 30, NULL),

  ('fld_screen_barva', 'prd_screenove_rolety', 'Barva', 'select', NULL, 10, 'Standard'),
  ('fld_screen_povrch', 'prd_screenove_rolety', 'Druh povrchu', 'select', NULL, 20, 'Hladký'),
  ('fld_screen_sirka', 'prd_screenove_rolety', 'Šířka (mm)', 'number', 'např. 2200', 30, NULL),
  ('fld_screen_vyska', 'prd_screenove_rolety', 'Výška (mm)', 'number', 'např. 2400', 40, NULL),

  ('fld_hz_lamely', 'prd_horizontalni_zaluzie', 'Barva lamel', 'select', NULL, 10, 'Bílá'),
  ('fld_hz_nosnik', 'prd_horizontalni_zaluzie', 'Barva nosníku', 'select', NULL, 20, 'Bílá'),
  ('fld_hz_ovladani', 'prd_horizontalni_zaluzie', 'Strana ovládání', 'select', NULL, 30, 'Pravá'),
  ('fld_hz_sirka', 'prd_horizontalni_zaluzie', 'Šířka (mm)', 'number', 'např. 1200', 40, NULL),
  ('fld_hz_vyska', 'prd_horizontalni_zaluzie', 'Výška (mm)', 'number', 'např. 1400', 50, NULL),

  ('fld_plise_skupina', 'prd_latkove_plise', 'Skupina látky', 'select', NULL, 10, '3'),
  ('fld_plise_profil', 'prd_latkove_plise', 'Barva profilu', 'select', NULL, 20, 'Bílá'),
  ('fld_plise_sirka', 'prd_latkove_plise', 'Šířka (mm)', 'number', 'např. 1000', 30, NULL),
  ('fld_plise_vyska', 'prd_latkove_plise', 'Výška (mm)', 'number', 'např. 1200', 40, NULL),

  ('fld_zaloha_barva', 'prd_zaloha', 'Barva', 'select', NULL, 10, NULL),
  ('fld_zaloha_varianta', 'prd_zaloha', 'Varianta', 'select', NULL, 20, NULL),
  ('fld_zaloha_design', 'prd_zaloha', 'Design', 'select', NULL, 30, NULL),
  ('fld_zaloha_povrch', 'prd_zaloha', 'Druh povrchu', 'select', NULL, 40, NULL),
  (
    'fld_zaloha_ovladani',
    'prd_zaloha',
    'Ovládání a doplňky',
    'select',
    NULL,
    45,
    'Střední (dálkové ovládání, časovač)'
  ),
  ('fld_zaloha_sirka', 'prd_zaloha', 'Šířka (mm)', 'number', 'např. 2500', 55, NULL),
  ('fld_zaloha_vyska', 'prd_zaloha', 'Výška (mm)', 'number', 'např. 2100', 65, NULL);

-- Product config options (priceDeltaCzk = orientační příplatek v Kč u dané volby, NULL = bez příplatku v UI)
INSERT INTO "ProductConfigOption" ("id", "fieldId", "value", "sortOrder", "priceDeltaCzk")
VALUES
  ('opt_garazova_varianta_1', 'fld_garazova_varianta', 'Sekční', 10, NULL),
  ('opt_garazova_varianta_2', 'fld_garazova_varianta', 'Rolovací', 20, NULL),
  ('opt_garazova_design_1', 'fld_garazova_design', 'Hladký', 10, NULL),
  ('opt_garazova_design_2', 'fld_garazova_design', 'Kazetový', 20, NULL),
  ('opt_garazova_design_3', 'fld_garazova_design', 'Lamela', 30, NULL),
  ('opt_garazova_povrch_1', 'fld_garazova_povrch', 'Mat', 10, NULL),
  ('opt_garazova_povrch_2', 'fld_garazova_povrch', 'Lesk', 20, NULL),
  ('opt_garazova_povrch_3', 'fld_garazova_povrch', 'Struktura', 30, NULL),

  ('opt_prumysl_varianta_1', 'fld_prumysl_varianta', 'Sekční', 10, NULL),
  ('opt_prumysl_varianta_2', 'fld_prumysl_varianta', 'Rychloběžná', 20, NULL),
  ('opt_prumysl_design_1', 'fld_prumysl_design', 'Plný panel', 10, NULL),
  ('opt_prumysl_design_2', 'fld_prumysl_design', 'Prosklený panel', 20, NULL),

  ('opt_venzalu_barva_1', 'fld_venzalu_barva', 'RAL', 10, NULL),
  ('opt_venzalu_barva_2', 'fld_venzalu_barva', 'Standard', 20, NULL),

  ('opt_screen_barva_1', 'fld_screen_barva', 'RAL', 10, NULL),
  ('opt_screen_barva_2', 'fld_screen_barva', 'Standard', 20, NULL),
  ('opt_screen_povrch_1', 'fld_screen_povrch', 'Hladký', 10, NULL),
  ('opt_screen_povrch_2', 'fld_screen_povrch', 'Textura', 20, NULL),

  ('opt_hz_lamely_1', 'fld_hz_lamely', 'Bílá', 10, NULL),
  ('opt_hz_lamely_2', 'fld_hz_lamely', 'Antracit', 20, NULL),
  ('opt_hz_lamely_3', 'fld_hz_lamely', 'Stříbrná', 30, NULL),
  ('opt_hz_nosnik_1', 'fld_hz_nosnik', 'Bílá', 10, NULL),
  ('opt_hz_nosnik_2', 'fld_hz_nosnik', 'Hnědá', 20, NULL),
  ('opt_hz_nosnik_3', 'fld_hz_nosnik', 'Černá', 30, NULL),
  ('opt_hz_ovladani_1', 'fld_hz_ovladani', 'Levá', 10, NULL),
  ('opt_hz_ovladani_2', 'fld_hz_ovladani', 'Pravá', 20, NULL),

  ('opt_plise_skupina_1', 'fld_plise_skupina', '1', 10, NULL),
  ('opt_plise_skupina_2', 'fld_plise_skupina', '2', 20, NULL),
  ('opt_plise_skupina_3', 'fld_plise_skupina', '3', 30, NULL),
  ('opt_plise_skupina_4', 'fld_plise_skupina', '4', 40, NULL),
  ('opt_plise_skupina_5', 'fld_plise_skupina', '5', 50, NULL),
  ('opt_plise_profil_1', 'fld_plise_profil', 'Bílá', 10, NULL),
  ('opt_plise_profil_2', 'fld_plise_profil', 'Krémová', 20, NULL),
  ('opt_plise_profil_3', 'fld_plise_profil', 'Hnědá', 30, NULL),
  ('opt_plise_profil_4', 'fld_plise_profil', 'Stříbrná', 40, NULL),
  ('opt_plise_profil_5', 'fld_plise_profil', 'Antracit', 50, NULL),
  ('opt_plise_profil_6', 'fld_plise_profil', 'Černá', 60, NULL),

  ('opt_zaloha_barva_1', 'fld_zaloha_barva', 'RAL', 10, NULL),
  ('opt_zaloha_barva_2', 'fld_zaloha_barva', 'Standard', 20, NULL),
  ('opt_zaloha_varianta_1', 'fld_zaloha_varianta', 'Vrata', 10, NULL),
  ('opt_zaloha_varianta_2', 'fld_zaloha_varianta', 'Venkovní stínění', 20, NULL),
  ('opt_zaloha_design_1', 'fld_zaloha_design', 'Hladký', 10, NULL),
  ('opt_zaloha_design_2', 'fld_zaloha_design', 'Kazetový', 20, NULL),
  ('opt_zaloha_design_3', 'fld_zaloha_design', 'Lamela', 30, NULL),
  ('opt_zaloha_povrch_1', 'fld_zaloha_povrch', 'Mat', 10, NULL),
  ('opt_zaloha_povrch_2', 'fld_zaloha_povrch', 'Lesk', 20, NULL),
  ('opt_zaloha_povrch_3', 'fld_zaloha_povrch', 'Struktura', 30, NULL),

  ('opt_zaloha_ovlad_1', 'fld_zaloha_ovladani', 'Základní (manuál / lokální spínač)', 10, 0),
  ('opt_zaloha_ovlad_2', 'fld_zaloha_ovladani', 'Střední (dálkové ovládání, časovač)', 20, 3500),
  ('opt_zaloha_ovlad_3', 'fld_zaloha_ovladani', 'Prémiové (Smart Home / motor s aplikací)', 30, 8900);

COMMIT;
