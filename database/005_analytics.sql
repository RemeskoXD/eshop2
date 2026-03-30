-- QAPI e-shop: analytics events tracking
-- Run after previous migrations

BEGIN;

CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
  "id" TEXT PRIMARY KEY,
  "event" TEXT NOT NULL,
  "dataJson" JSONB,
  "path" TEXT,
  "userAgent" TEXT,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "AnalyticsEvent_event_idx" ON "AnalyticsEvent" ("event");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent" ("createdAt");

COMMIT;
