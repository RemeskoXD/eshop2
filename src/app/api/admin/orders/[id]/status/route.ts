import { NextResponse } from "next/server";
import { assertAdminPermission, resolveAdminAuth, unauthorizedJson } from "@/lib/admin-authz";
import { getAdminUserIdByEmail } from "@/lib/admin-audit";
import { loadOrderForStatusChange, sendOrderStatusChangeMails } from "@/lib/order-status-mail";
import { prisma } from "@/lib/prisma";

type UpdateStatusPayload = {
  status: string;
  note?: string;
};

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const auth = await resolveAdminAuth(request);
    if (!auth) return unauthorizedJson();
    const denied = assertAdminPermission(auth, "order_status");
    if (denied) return denied;
    const actorLabel = auth.actorLabel;

    const { id } = await params;
    const payload = (await request.json()) as UpdateStatusPayload;

    if (!payload.status?.trim()) {
      return NextResponse.json({ error: "Chybí nový stav objednávky." }, { status: 400 });
    }

    const orderRow = await loadOrderForStatusChange(id);
    if (!orderRow) {
      return NextResponse.json({ error: "Objednávka nebyla nalezena." }, { status: 404 });
    }

    const current = orderRow;

    let adminUserId: string | null = null;
    const changedByEmail = actorLabel;
    if (!actorLabel.startsWith("basic:")) {
      adminUserId = await getAdminUserIdByEmail(actorLabel);
    }

    await prisma.$executeRaw`
      UPDATE "Order"
      SET "status" = ${payload.status}, "updatedAt" = NOW()
      WHERE "id" = ${id};
    `;

    try {
      await prisma.$executeRaw`
        INSERT INTO "OrderStatusHistory"
          ("id", "orderId", "fromStatus", "toStatus", "note", "changedByAdminUserId", "changedByEmail", "changedAt")
        VALUES
          (
            ('osh_' || md5(random()::text || clock_timestamp()::text))::text,
            ${id},
            ${current.status},
            ${payload.status},
            ${payload.note ?? null},
            ${adminUserId},
            ${changedByEmail},
            NOW()
          );
      `;
    } catch {
      await prisma.$executeRaw`
        INSERT INTO "OrderStatusHistory"
          ("id", "orderId", "fromStatus", "toStatus", "note", "changedByAdminUserId", "changedAt")
        VALUES
          (
            ('osh_' || md5(random()::text || clock_timestamp()::text))::text,
            ${id},
            ${current.status},
            ${payload.status},
            ${payload.note ?? null},
            ${adminUserId},
            NOW()
          );
      `;
    }

    void sendOrderStatusChangeMails({
      orderId: id,
      orderNumber: orderRow.orderNumber,
      customerName: orderRow.customerName,
      customerEmail: orderRow.customerEmail,
      fromStatus: current.status,
      toStatus: payload.status,
      note: payload.note ?? null,
      changedBy: actorLabel,
    }).catch((err) => {
      console.error("[order-status] sendOrderStatusChangeMails:", err);
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Změna stavu se nepodařila." }, { status: 500 });
  }
}
