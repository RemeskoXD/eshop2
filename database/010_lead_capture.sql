-- QAPI e-shop: ukládání leadů (měkké konverze / checklist / konzultace)
-- Spusťte po 009. Idempotentní.

BEGIN;

CREATE TABLE IF NOT EXISTS "LeadCapture" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL,
  "phone" TEXT NULL,
  "source" TEXT NOT NULL,
  "consent" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "LeadCapture_createdAt_idx" ON "LeadCapture" ("createdAt");
CREATE INDEX IF NOT EXISTS "LeadCapture_email_idx" ON "LeadCapture" (LOWER("email"));
CREATE INDEX IF NOT EXISTS "LeadCapture_source_idx" ON "LeadCapture" ("source");

COMMIT;
