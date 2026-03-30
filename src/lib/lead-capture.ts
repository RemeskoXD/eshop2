import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export async function saveLeadCapture(args: {
  email: string;
  phone?: string;
  source: string;
  consent: boolean;
}): Promise<"saved" | "skipped"> {
  try {
    await prisma.$executeRaw`
      INSERT INTO "LeadCapture" ("id", "email", "phone", "source", "consent")
      VALUES (${randomUUID()}, ${args.email}, ${args.phone ?? null}, ${args.source}, ${args.consent});
    `;
    return "saved";
  } catch {
    // Tabulka může chybět na starší DB bez migrace 010 → lead jen e-mailem.
    return "skipped";
  }
}

export type AdminLeadExportRow = {
  createdAt: Date;
  email: string;
  phone: string | null;
  source: string;
  consent: boolean;
};

export type LeadOverview = {
  total: number;
  last7Days: number;
  last30Days: number;
  topSource: string | null;
  ordersLast30Days: number;
  leadToOrderRate30Days: number;
};

export type LeadDailyTrendRow = {
  day: string;
  count: number;
};

export type LeadSourceStat = {
  source: string;
  count: number;
};

export async function getAdminLeadExportRows(): Promise<AdminLeadExportRow[]> {
  try {
    return await prisma.$queryRaw<AdminLeadExportRow[]>`
      SELECT "createdAt", "email", "phone", "source", "consent"
      FROM "LeadCapture"
      ORDER BY "createdAt" DESC;
    `;
  } catch {
    return [];
  }
}

export async function getLeadOverview(): Promise<LeadOverview> {
  try {
    const [totalRows, days7Rows, days30Rows, sourceRows, orders30Rows] = await Promise.all([
      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS "count"
        FROM "LeadCapture";
      `,
      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS "count"
        FROM "LeadCapture"
        WHERE "createdAt" >= NOW() - INTERVAL '7 days';
      `,
      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS "count"
        FROM "LeadCapture"
        WHERE "createdAt" >= NOW() - INTERVAL '30 days';
      `,
      prisma.$queryRaw<Array<{ source: string; count: number }>>`
        SELECT "source", COUNT(*)::int AS "count"
        FROM "LeadCapture"
        GROUP BY "source"
        ORDER BY COUNT(*) DESC, "source" ASC
        LIMIT 1;
      `,
      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS "count"
        FROM "Order"
        WHERE "createdAt" >= NOW() - INTERVAL '30 days';
      `,
    ]);

    const leads30 = days30Rows[0]?.count ?? 0;
    const orders30 = orders30Rows[0]?.count ?? 0;
    const rate = leads30 > 0 ? Number(((orders30 / leads30) * 100).toFixed(1)) : 0;

    return {
      total: totalRows[0]?.count ?? 0,
      last7Days: days7Rows[0]?.count ?? 0,
      last30Days: leads30,
      topSource: sourceRows[0]?.source ?? null,
      ordersLast30Days: orders30,
      leadToOrderRate30Days: rate,
    };
  } catch {
    return {
      total: 0,
      last7Days: 0,
      last30Days: 0,
      topSource: null,
      ordersLast30Days: 0,
      leadToOrderRate30Days: 0,
    };
  }
}

export async function getLeadDailyTrend(days = 14): Promise<LeadDailyTrendRow[]> {
  try {
    const safeDays = Math.max(1, Math.min(days, 90));
    const rows = await prisma.$queryRaw<Array<{ day: string; count: number }>>`
      SELECT TO_CHAR(d::date, 'YYYY-MM-DD') AS "day",
             COALESCE(x.cnt, 0)::int AS "count"
      FROM generate_series(
        date_trunc('day', NOW()) - (${safeDays}::int - 1) * INTERVAL '1 day',
        date_trunc('day', NOW()),
        INTERVAL '1 day'
      ) d
      LEFT JOIN (
        SELECT date_trunc('day', "createdAt") AS day, COUNT(*) AS cnt
        FROM "LeadCapture"
        WHERE "createdAt" >= NOW() - (${safeDays}::int * INTERVAL '1 day')
        GROUP BY 1
      ) x ON x.day = d
      ORDER BY d ASC;
    `;
    return rows;
  } catch {
    return [];
  }
}

export async function getRecentLeads(args?: {
  limit?: number;
  source?: string | null;
  sinceDays?: number | null;
}): Promise<AdminLeadExportRow[]> {
  try {
    const safeLimit = Math.max(1, Math.min(args?.limit ?? 20, 200));
    const source = (args?.source ?? "").trim();
    const safeSinceDays =
      args?.sinceDays && Number.isFinite(args.sinceDays)
        ? Math.max(1, Math.min(Math.round(args.sinceDays), 365))
        : null;

    if (source && safeSinceDays) {
      return await prisma.$queryRaw<AdminLeadExportRow[]>`
        SELECT "createdAt", "email", "phone", "source", "consent"
        FROM "LeadCapture"
        WHERE "source" = ${source}
          AND "createdAt" >= NOW() - (${safeSinceDays}::int * INTERVAL '1 day')
        ORDER BY "createdAt" DESC
        LIMIT ${safeLimit};
      `;
    }
    if (source) {
      return await prisma.$queryRaw<AdminLeadExportRow[]>`
        SELECT "createdAt", "email", "phone", "source", "consent"
        FROM "LeadCapture"
        WHERE "source" = ${source}
        ORDER BY "createdAt" DESC
        LIMIT ${safeLimit};
      `;
    }
    if (safeSinceDays) {
      return await prisma.$queryRaw<AdminLeadExportRow[]>`
        SELECT "createdAt", "email", "phone", "source", "consent"
        FROM "LeadCapture"
        WHERE "createdAt" >= NOW() - (${safeSinceDays}::int * INTERVAL '1 day')
        ORDER BY "createdAt" DESC
        LIMIT ${safeLimit};
      `;
    }
    return await prisma.$queryRaw<AdminLeadExportRow[]>`
      SELECT "createdAt", "email", "phone", "source", "consent"
      FROM "LeadCapture"
      ORDER BY "createdAt" DESC
      LIMIT ${safeLimit};
    `;
  } catch {
    return [];
  }
}

export async function getLeadSourceStats(limit = 8): Promise<LeadSourceStat[]> {
  try {
    const safeLimit = Math.max(1, Math.min(limit, 50));
    return await prisma.$queryRaw<LeadSourceStat[]>`
      SELECT "source", COUNT(*)::int AS "count"
      FROM "LeadCapture"
      GROUP BY "source"
      ORDER BY COUNT(*) DESC, "source" ASC
      LIMIT ${safeLimit};
    `;
  } catch {
    return [];
  }
}
