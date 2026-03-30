import { NextResponse } from "next/server";
import {
  assertAdminPermission,
  resolveAdminAuth,
  unauthorizedJson,
} from "@/lib/admin-authz";
import {
  getAdminOrdersExportLines,
  getAdminOrdersExportSummary,
  type AdminOrderExportLineRow,
  type AdminOrderExportSummaryRow,
} from "@/lib/admin-orders";
import { toCsvWithColumns } from "@/lib/csv";

function filenameDate(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function summaryToRow(r: AdminOrderExportSummaryRow): Record<string, unknown> {
  return {
    id: r.id,
    orderNumber: r.orderNumber ?? "",
    variableSymbol: r.variableSymbol ?? "",
    createdAt: r.createdAt,
    status: r.status,
    customerName: r.customerName,
    customerEmail: r.customerEmail,
    customerPhone: r.customerPhone,
    street: r.street,
    city: r.city,
    postalCode: r.postalCode,
    totalPrice: r.totalPrice,
    currency: r.currency ?? "CZK",
    itemsSummary: r.itemsSummary ?? "",
  };
}

function lineToRow(r: AdminOrderExportLineRow): Record<string, unknown> {
  return {
    orderId: r.orderId,
    orderNumber: r.orderNumber ?? "",
    variableSymbol: r.variableSymbol ?? "",
    createdAt: r.createdAt,
    status: r.status,
    customerName: r.customerName,
    customerEmail: r.customerEmail,
    customerPhone: r.customerPhone,
    street: r.street,
    city: r.city,
    postalCode: r.postalCode,
    orderTotal: r.orderTotal,
    currency: r.currency ?? "CZK",
    itemName: r.itemName,
    itemQuantity: r.itemQuantity,
    itemUnitPrice: r.itemUnitPrice,
    lineTotal: r.lineTotal,
    configSummary: r.configSummary ?? "",
  };
}

export async function GET(request: Request) {
  const auth = await resolveAdminAuth(request);
  if (!auth) return unauthorizedJson();
  const denied = assertAdminPermission(auth, "order_export");
  if (denied) return denied;

  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") === "lines" ? "lines" : "summary";
  const date = filenameDate();

  if (mode === "lines") {
    const rows = await getAdminOrdersExportLines();
    const csv = toCsvWithColumns(
      [
        { key: "orderId", header: "ID objednávky" },
        { key: "orderNumber", header: "Číslo objednávky" },
        { key: "variableSymbol", header: "Variabilní symbol" },
        { key: "createdAt", header: "Vytvořeno" },
        { key: "status", header: "Stav" },
        { key: "customerName", header: "Zákazník" },
        { key: "customerEmail", header: "E-mail" },
        { key: "customerPhone", header: "Telefon" },
        { key: "street", header: "Ulice" },
        { key: "city", header: "Město" },
        { key: "postalCode", header: "PSČ" },
        { key: "orderTotal", header: "Celkem objednávka (Kč)" },
        { key: "currency", header: "Měna" },
        { key: "itemName", header: "Položka" },
        { key: "itemQuantity", header: "Počet" },
        { key: "itemUnitPrice", header: "Jednotková cena (Kč)" },
        { key: "lineTotal", header: "Řádek celkem (Kč)" },
        { key: "configSummary", header: "Konfigurace" },
      ],
      rows.map(lineToRow) as Array<Record<string, unknown>>,
    );

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="objednavky-položky-${date}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const rows = await getAdminOrdersExportSummary();
  const csv = toCsvWithColumns(
    [
      { key: "orderNumber", header: "Číslo objednávky" },
      { key: "variableSymbol", header: "Variabilní symbol" },
      { key: "id", header: "ID (technické)" },
      { key: "createdAt", header: "Vytvořeno" },
      { key: "status", header: "Stav" },
      { key: "customerName", header: "Zákazník" },
      { key: "customerEmail", header: "E-mail" },
      { key: "customerPhone", header: "Telefon" },
      { key: "street", header: "Ulice" },
      { key: "city", header: "Město" },
      { key: "postalCode", header: "PSČ" },
      { key: "totalPrice", header: "Celkem (Kč)" },
      { key: "currency", header: "Měna" },
      { key: "itemsSummary", header: "Položky (souhrn)" },
    ],
    rows.map(summaryToRow) as Array<Record<string, unknown>>,
  );

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="objednavky-souhrn-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
