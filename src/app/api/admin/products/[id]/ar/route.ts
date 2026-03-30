import { NextResponse } from "next/server";
import {
  assertAdminPermission,
  resolveAdminAuth,
  unauthorizedJson,
} from "@/lib/admin-authz";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ id: string }>;
};

type Payload = {
  arModelGlbUrl?: string | null;
  arModelUsdzUrl?: string | null;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await resolveAdminAuth(request);
  if (!auth) return unauthorizedJson();
  const denied = assertAdminPermission(auth, "product_ar_write");
  if (denied) return denied;

  try {
    const { id } = await params;
    const payload = (await request.json()) as Payload;

    const glb = payload.arModelGlbUrl?.trim() || null;
    const usdz = payload.arModelUsdzUrl?.trim() || null;

    await prisma.$executeRaw`
      UPDATE "Product"
      SET "arModelGlbUrl" = ${glb}, "arModelUsdzUrl" = ${usdz}
      WHERE "id" = ${id};
    `;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Uložení AR URL selhalo." }, { status: 500 });
  }
}
