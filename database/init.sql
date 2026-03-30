-- QAPI e-shop: initial PostgreSQL schema
-- Run in your target database (e.g. via pgAdmin / DBeaver / psql).

BEGIN;

CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "status" TEXT NOT NULL DEFAULT 'new',
  "currency" TEXT NOT NULL DEFAULT 'CZK',
  "totalPrice" INTEGER NOT NULL,
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "street" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "postalCode" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "unitPrice" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  CONSTRAINT "OrderItem_orderId_fkey"
    FOREIGN KEY ("orderId")
    REFERENCES "Order" ("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OrderItemConfig" (
  "id" TEXT PRIMARY KEY,
  "orderItemId" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  CONSTRAINT "OrderItemConfig_orderItemId_fkey"
    FOREIGN KEY ("orderItemId")
    REFERENCES "OrderItem" ("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON "Order" ("createdAt");
CREATE INDEX IF NOT EXISTS "Order_customerEmail_idx" ON "Order" ("customerEmail");
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem" ("orderId");
CREATE INDEX IF NOT EXISTS "OrderItemConfig_orderItemId_idx" ON "OrderItemConfig" ("orderItemId");

COMMIT;
