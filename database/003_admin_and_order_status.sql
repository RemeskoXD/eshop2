-- QAPI e-shop: admin users + roles + order status history
-- Run after database/init.sql and database/002_catalog.sql

BEGIN;

CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "fullName" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "AdminRole" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "AdminUserRole" (
  "id" TEXT PRIMARY KEY,
  "adminUserId" TEXT NOT NULL,
  "adminRoleId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "AdminUserRole_adminUserId_fkey"
    FOREIGN KEY ("adminUserId")
    REFERENCES "AdminUser" ("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT "AdminUserRole_adminRoleId_fkey"
    FOREIGN KEY ("adminRoleId")
    REFERENCES "AdminRole" ("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT "AdminUserRole_unique_pair"
    UNIQUE ("adminUserId", "adminRoleId")
);

CREATE TABLE IF NOT EXISTS "OrderStatusHistory" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "fromStatus" TEXT NULL,
  "toStatus" TEXT NOT NULL,
  "note" TEXT NULL,
  "changedByAdminUserId" TEXT NULL,
  "changedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "OrderStatusHistory_orderId_fkey"
    FOREIGN KEY ("orderId")
    REFERENCES "Order" ("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT "OrderStatusHistory_changedByAdminUserId_fkey"
    FOREIGN KEY ("changedByAdminUserId")
    REFERENCES "AdminUser" ("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "AdminUser_isActive_idx" ON "AdminUser" ("isActive");
CREATE INDEX IF NOT EXISTS "AdminUserRole_adminUserId_idx" ON "AdminUserRole" ("adminUserId");
CREATE INDEX IF NOT EXISTS "AdminUserRole_adminRoleId_idx" ON "AdminUserRole" ("adminRoleId");
CREATE INDEX IF NOT EXISTS "OrderStatusHistory_orderId_idx" ON "OrderStatusHistory" ("orderId");
CREATE INDEX IF NOT EXISTS "OrderStatusHistory_changedAt_idx" ON "OrderStatusHistory" ("changedAt");

-- Default roles
INSERT INTO "AdminRole" ("id", "code", "name")
VALUES
  ('role_owner', 'owner', 'Owner'),
  ('role_manager', 'manager', 'Manager'),
  ('role_support', 'support', 'Support')
ON CONFLICT ("code") DO UPDATE
SET "name" = EXCLUDED."name";

-- Optional bootstrap admin (change email + password hash before production use)
INSERT INTO "AdminUser" ("id", "email", "fullName", "passwordHash", "isActive")
VALUES
  (
    'adm_bootstrap',
    'admin@qapi.cz',
    'QAPI Admin',
    '$2b$12$REPLACE_WITH_REAL_BCRYPT_HASH',
    TRUE
  )
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "AdminUserRole" ("id", "adminUserId", "adminRoleId")
VALUES
  ('aur_bootstrap_owner', 'adm_bootstrap', 'role_owner')
ON CONFLICT ("adminUserId", "adminRoleId") DO NOTHING;

COMMIT;
