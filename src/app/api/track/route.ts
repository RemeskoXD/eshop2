import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type TrackPayload = {
  event?: string;
  data?: Record<string, unknown>;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as TrackPayload;
    if (!payload.event) {
      return NextResponse.json({ error: "Missing event" }, { status: 400 });
    }

    const pathHeader = request.headers.get("x-pathname") ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0]?.trim() ?? null
      : null;

    try {
      await prisma.$executeRaw`
        INSERT INTO "AnalyticsEvent" ("id", "event", "dataJson", "path", "userAgent", "ipAddress", "createdAt")
        VALUES (
          ('ev_' || md5(random()::text || clock_timestamp()::text))::text,
          ${payload.event},
          ${JSON.stringify(payload.data ?? {})}::jsonb,
          ${pathHeader},
          ${userAgent},
          ${ipAddress},
          NOW()
        );
      `;
    } catch {
      // Fallback when analytics table is not created yet.
      console.log("[TRACK]", payload.event, payload.data ?? {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
