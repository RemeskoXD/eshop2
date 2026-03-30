-- QAPI e-shop: production-oriented order fields
-- Run after database/init.sql, 002_catalog.sql, 003_admin_and_order_status.sql

BEGIN;

-- Status dictionary (recommended values for workflow)
CREATE TABLE IF NOT EXISTS "OrderStatusType" (
  "code" TEXT PRIMARY KEY,
  "label" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isFinal" BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO "OrderStatusType" ("code", "label", "sortOrder", "isFinal")
VALUES
  ('new', 'Nová', 10, FALSE),
  ('deposit_paid', 'Záloha uhrazena', 20, FALSE),
  ('tech_visit_planned', 'Návštěva technika naplánována', 30, FALSE),
  ('final_quote_sent', 'Finální nacenění odesláno', 40, FALSE),
  ('in_production', 'Ve výrobě', 50, FALSE),
  ('ready_for_install', 'Připraveno k montáži/dodání', 60, FALSE),
  ('completed', 'Dokončeno', 70, TRUE),
  ('cancelled', 'Zrušeno', 80, TRUE)
ON CONFLICT ("code") DO UPDATE
SET
  "label" = EXCLUDED."label",
  "sortOrder" = EXCLUDED."sortOrder",
  "isFinal" = EXCLUDED."isFinal";

-- Add practical business fields directly to Order
ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "orderNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "variableSymbol" TEXT,
  ADD COLUMN IF NOT EXISTS "companyName" TEXT,
  ADD COLUMN IF NOT EXISTS "ico" TEXT,
  ADD COLUMN IF NOT EXISTS "dic" TEXT,
  ADD COLUMN IF NOT EXISTS "deliveryStreet" TEXT,
  ADD COLUMN IF NOT EXISTS "deliveryCity" TEXT,
  ADD COLUMN IF NOT EXISTS "deliveryPostalCode" TEXT,
  ADD COLUMN IF NOT EXISTS "deliveryCountry" TEXT DEFAULT 'Česká republika',
  ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'bank_transfer',
  ADD COLUMN IF NOT EXISTS "shippingMethod" TEXT DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS "currencyRate" NUMERIC(12,6),
  ADD COLUMN IF NOT EXISTS "customerNote" TEXT,
  ADD COLUMN IF NOT EXISTS "internalNote" TEXT,
  ADD COLUMN IF NOT EXISTS "confirmedAt" TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Ensure uniqueness for business identifiers (nullable allowed)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'Order_orderNumber_unique'
  ) THEN
    CREATE UNIQUE INDEX "Order_orderNumber_unique"
      ON "Order" ("orderNumber")
      WHERE "orderNumber" IS NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'Order_variableSymbol_unique'
  ) THEN
    CREATE UNIQUE INDEX "Order_variableSymbol_unique"
      ON "Order" ("variableSymbol")
      WHERE "variableSymbol" IS NOT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order" ("status");
CREATE INDEX IF NOT EXISTS "Order_updatedAt_idx" ON "Order" ("updatedAt");
CREATE INDEX IF NOT EXISTS "Order_confirmedAt_idx" ON "Order" ("confirmedAt");
CREATE INDEX IF NOT EXISTS "Order_cancelledAt_idx" ON "Order" ("cancelledAt");

-- Optional FK from Order.status -> OrderStatusType.code
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'Order_status_fkey'
      AND table_name = 'Order'
  ) THEN
    ALTER TABLE "Order"
      ADD CONSTRAINT "Order_status_fkey"
      FOREIGN KEY ("status")
      REFERENCES "OrderStatusType" ("code")
      ON UPDATE CASCADE;
  END IF;
END $$;

COMMIT;
