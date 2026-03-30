-- QAPI e-shop: doporučené volby u konfigurátoru (všechny seedované produkty kromě čistě rozměrových polí)
-- Spusťte po 008. Idempotentní — pouze UPDATE podle "id" pole.

BEGIN;

UPDATE "ProductConfigField" SET "recommendedOption" = 'Sekční' WHERE "id" = 'fld_garazova_varianta';
UPDATE "ProductConfigField" SET "recommendedOption" = 'Hladký' WHERE "id" = 'fld_garazova_design';

UPDATE "ProductConfigField" SET "recommendedOption" = 'Sekční' WHERE "id" = 'fld_prumysl_varianta';
UPDATE "ProductConfigField" SET "recommendedOption" = 'Plný panel' WHERE "id" = 'fld_prumysl_design';

UPDATE "ProductConfigField" SET "recommendedOption" = 'Standard' WHERE "id" = 'fld_venzalu_barva';

UPDATE "ProductConfigField" SET "recommendedOption" = 'Standard' WHERE "id" = 'fld_screen_barva';
UPDATE "ProductConfigField" SET "recommendedOption" = 'Hladký' WHERE "id" = 'fld_screen_povrch';

UPDATE "ProductConfigField" SET "recommendedOption" = 'Bílá' WHERE "id" = 'fld_hz_lamely';
UPDATE "ProductConfigField" SET "recommendedOption" = 'Bílá' WHERE "id" = 'fld_hz_nosnik';
UPDATE "ProductConfigField" SET "recommendedOption" = 'Pravá' WHERE "id" = 'fld_hz_ovladani';

UPDATE "ProductConfigField" SET "recommendedOption" = '3' WHERE "id" = 'fld_plise_skupina';
UPDATE "ProductConfigField" SET "recommendedOption" = 'Bílá' WHERE "id" = 'fld_plise_profil';

COMMIT;
