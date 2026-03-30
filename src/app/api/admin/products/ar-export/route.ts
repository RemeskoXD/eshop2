import { NextResponse } from "next/server";
import {
  assertAdminPermission,
  resolveAdminAuth,
  unauthorizedJson,
} from "@/lib/admin-authz";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const auth = await resolveAdminAuth(request);
  if (!auth) return unauthorizedJson();
  const denied = assertAdminPermission(auth, "product_ar_export");
  if (denied) return denied;

  try {
    const rows = await prisma.$queryRaw<
      Array<{
        slug: string;
        arModelGlbUrl: string | null;
        arModelUsdzUrl: string | null;
      }>
    >`
      SELECT "slug", "arModelGlbUrl", "arModelUsdzUrl"
      FROM "Product"
      ORDER BY "slug" ASC;
    `;

    const header = "slug,arModelGlbUrl,arModelUsdzUrl";
    const lines = rows.map((row) =>
      [row.slug, row.arModelGlbUrl ?? "", row.arModelUsdzUrl ?? ""]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    );
    const csv = [header, ...lines].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="product-ar-models.csv"',
      },
    });
  } catch {
    return NextResponse.json({ error: "CSV export se nepodařil." }, { status: 500 });
  }
}
