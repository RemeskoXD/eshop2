-- QAPI e-shop: kdo změnil stav objednávky (audit)
-- Spusťte po 003_admin_and_order_status.sql

BEGIN;

ALTER TABLE "OrderStatusHistory"
  ADD COLUMN IF NOT EXISTS "changedByEmail" TEXT;

COMMENT ON COLUMN "OrderStatusHistory"."changedByEmail" IS 'E-mail z admin session (i bez řádku v AdminUser)';

COMMIT;
