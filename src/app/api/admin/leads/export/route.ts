import { NextResponse } from "next/server";
import {
  assertAdminPermission,
  resolveAdminAuth,
  unauthorizedJson,
} from "@/lib/admin-authz";
import { toCsvWithColumns } from "@/lib/csv";
import { getAdminLeadExportRows } from "@/lib/lead-capture";

function filenameDate(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export async function GET(request: Request) {
  const auth = await resolveAdminAuth(request);
  if (!auth) return unauthorizedJson();
  const denied = assertAdminPermission(auth, "order_export");
  if (denied) return denied;

  const rows = await getAdminLeadExportRows();
  const csv = toCsvWithColumns(
    [
      { key: "createdAt", header: "Vytvořeno" },
      { key: "email", header: "E-mail" },
      { key: "phone", header: "Telefon" },
      { key: "source", header: "Zdroj" },
      { key: "consent", header: "Souhlas" },
    ],
    rows.map((r) => ({
      createdAt: new Date(r.createdAt).toLocaleString("cs-CZ"),
      email: r.email,
      phone: r.phone ?? "",
      source: r.source,
      consent: r.consent ? "ano" : "ne",
    })),
  );

  const date = filenameDate();
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leady-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
