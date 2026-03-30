import { prisma } from "@/lib/prisma";

export type AdminOrderListItem = {
  id: string;
  orderNumber: string | null;
  createdAt: string;
  status: string;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  itemsCount: number;
};

export type AdminOrderDetail = {
  id: string;
  createdAt: string;
  status: string;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  city: string;
  postalCode: string;
  orderNumber: string | null;
  variableSymbol: string | null;
};

export type AdminOrderItem = {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

export type AdminOrderConfig = {
  orderItemId: string;
  key: string;
  value: string;
};

export type AdminOrderStatusHistoryItem = {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  changedAt: string;
  changedByEmail: string | null;
  changedByName: string | null;
};

async function loadAdminOrderHistory(orderId: string): Promise<AdminOrderStatusHistoryItem[]> {
  try {
    return await prisma.$queryRaw<AdminOrderStatusHistoryItem[]>`
      SELECT
        h."id",
        h."fromStatus",
        h."toStatus",
        h."note",
        h."changedAt"::text AS "changedAt",
        h."changedByEmail",
        u."fullName" AS "changedByName"
      FROM "OrderStatusHistory" h
      LEFT JOIN "AdminUser" u ON u."id" = h."changedByAdminUserId"
      WHERE h."orderId" = ${orderId}
      ORDER BY h."changedAt" DESC;
    `;
  } catch {
    try {
      const rows = await prisma.$queryRaw<
        Array<{
          id: string;
          fromStatus: string | null;
          toStatus: string;
          note: string | null;
          changedAt: string;
        }>
      >`
        SELECT "id", "fromStatus", "toStatus", "note", "changedAt"::text AS "changedAt"
        FROM "OrderStatusHistory"
        WHERE "orderId" = ${orderId}
        ORDER BY "changedAt" DESC;
      `;
      return rows.map((r) => ({
        ...r,
        changedByEmail: null,
        changedByName: null,
      }));
    } catch {
      return [];
    }
  }
}

export type AdminRecentActivityItem = {
  id: string;
  changedAt: string;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  changedByEmail: string | null;
  orderId: string;
  orderNumber: string | null;
  customerName: string;
  orderTotal: number;
};

export async function getAdminRecentActivity(limit = 15): Promise<AdminRecentActivityItem[]> {
  try {
    return await prisma.$queryRaw<AdminRecentActivityItem[]>`
      SELECT
        h."id",
        h."changedAt"::text AS "changedAt",
        h."fromStatus",
        h."toStatus",
        h."note",
        h."changedByEmail",
        o."id" AS "orderId",
        o."orderNumber" AS "orderNumber",
        o."customerName" AS "customerName",
        o."totalPrice"::int AS "orderTotal"
      FROM "OrderStatusHistory" h
      INNER JOIN "Order" o ON o."id" = h."orderId"
      ORDER BY h."changedAt" DESC
      LIMIT ${limit};
    `;
  } catch {
    try {
      return await prisma.$queryRaw<AdminRecentActivityItem[]>`
        SELECT
          h."id",
          h."changedAt"::text AS "changedAt",
          h."fromStatus",
          h."toStatus",
          h."note",
          h."changedByEmail",
          o."id" AS "orderId",
          NULL::text AS "orderNumber",
          o."customerName" AS "customerName",
          o."totalPrice"::int AS "orderTotal"
        FROM "OrderStatusHistory" h
        INNER JOIN "Order" o ON o."id" = h."orderId"
        ORDER BY h."changedAt" DESC
        LIMIT ${limit};
      `;
    } catch {
      try {
        return await prisma.$queryRaw<AdminRecentActivityItem[]>`
          SELECT
            h."id",
            h."changedAt"::text AS "changedAt",
            h."fromStatus",
            h."toStatus",
            h."note",
            NULL::text AS "changedByEmail",
            o."id" AS "orderId",
            NULL::text AS "orderNumber",
            o."customerName" AS "customerName",
            o."totalPrice"::int AS "orderTotal"
          FROM "OrderStatusHistory" h
          INNER JOIN "Order" o ON o."id" = h."orderId"
          ORDER BY h."changedAt" DESC
          LIMIT ${limit};
        `;
      } catch {
        return [];
      }
    }
  }
}

export async function getAdminOrders(): Promise<AdminOrderListItem[]> {
  try {
    return await prisma.$queryRaw<AdminOrderListItem[]>`
      SELECT
        o."id",
        o."orderNumber",
        o."createdAt"::text AS "createdAt",
        o."status",
        o."customerName",
        o."customerEmail",
        o."totalPrice",
        COUNT(oi."id")::int AS "itemsCount"
      FROM "Order" o
      LEFT JOIN "OrderItem" oi ON oi."orderId" = o."id"
      GROUP BY
        o."id",
        o."orderNumber",
        o."createdAt",
        o."status",
        o."customerName",
        o."customerEmail",
        o."totalPrice"
      ORDER BY o."createdAt" DESC
      LIMIT 200;
    `;
  } catch {
    try {
      const rows = await prisma.$queryRaw<
        Array<{
          id: string;
          createdAt: string;
          status: string;
          customerName: string;
          customerEmail: string;
          totalPrice: number;
          itemsCount: number;
        }>
      >`
        SELECT
          o."id",
          o."createdAt"::text AS "createdAt",
          o."status",
          o."customerName",
          o."customerEmail",
          o."totalPrice",
          (SELECT COUNT(*)::int FROM "OrderItem" oi WHERE oi."orderId" = o."id") AS "itemsCount"
        FROM "Order" o
        ORDER BY o."createdAt" DESC
        LIMIT 200;
      `;
      return rows.map((r) => ({ ...r, orderNumber: null }));
    } catch {
      return [];
    }
  }
}

export async function getAdminOrderById(orderId: string): Promise<{
  order: AdminOrderDetail | null;
  items: AdminOrderItem[];
  configs: AdminOrderConfig[];
  history: AdminOrderStatusHistoryItem[];
}> {
  try {
    let order: AdminOrderDetail | null = null;

    try {
      const orders = await prisma.$queryRaw<AdminOrderDetail[]>`
        SELECT
          "id",
          "createdAt"::text AS "createdAt",
          "status",
          "totalPrice",
          "customerName",
          "customerEmail",
          "customerPhone",
          "street",
          "city",
          "postalCode",
          "orderNumber",
          "variableSymbol"
        FROM "Order"
        WHERE "id" = ${orderId}
        LIMIT 1;
      `;
      order = orders[0] ?? null;
    } catch {
      const minimal = await prisma.$queryRaw<
        Array<{
          id: string;
          createdAt: string;
          status: string;
          totalPrice: number;
          customerName: string;
          customerEmail: string;
          customerPhone: string;
          street: string;
          city: string;
          postalCode: string;
        }>
      >`
        SELECT
          "id",
          "createdAt"::text AS "createdAt",
          "status",
          "totalPrice",
          "customerName",
          "customerEmail",
          "customerPhone",
          "street",
          "city",
          "postalCode"
        FROM "Order"
        WHERE "id" = ${orderId}
        LIMIT 1;
      `;
      const m = minimal[0];
      order = m ? { ...m, orderNumber: null, variableSymbol: null } : null;
    }

    if (!order) {
      return { order: null, items: [], configs: [], history: [] };
    }

    const items = await prisma.$queryRaw<AdminOrderItem[]>`
      SELECT "id", "name", "unitPrice", "quantity"
      FROM "OrderItem"
      WHERE "orderId" = ${orderId}
      ORDER BY "id" ASC;
    `;

    const configs = await prisma.$queryRaw<AdminOrderConfig[]>`
      SELECT "orderItemId", "key", "value"
      FROM "OrderItemConfig"
      WHERE "orderItemId" IN (SELECT "id" FROM "OrderItem" WHERE "orderId" = ${orderId})
      ORDER BY "id" ASC;
    `;

    const history = await loadAdminOrderHistory(orderId);

    return { order, items, configs, history };
  } catch {
    return { order: null, items: [], configs: [], history: [] };
  }
}

export async function getOrderStatuses(): Promise<Array<{ code: string; label: string }>> {
  try {
    return await prisma.$queryRaw<Array<{ code: string; label: string }>>`
      SELECT "code", "label"
      FROM "OrderStatusType"
      ORDER BY "sortOrder" ASC;
    `;
  } catch {
    return [
      { code: "new", label: "Nová" },
      { code: "completed", label: "Dokončeno" },
      { code: "cancelled", label: "Zrušeno" },
    ];
  }
}

export type AdminAnalyticsEventRow = {
  event: string;
  count: number;
};

export async function getAnalyticsOverview(): Promise<{
  topEvents: AdminAnalyticsEventRow[];
  todayEvents: number;
}> {
  try {
    const topEvents = await prisma.$queryRaw<AdminAnalyticsEventRow[]>`
      SELECT "event", COUNT(*)::int AS "count"
      FROM "AnalyticsEvent"
      WHERE "createdAt" >= NOW() - INTERVAL '14 days'
      GROUP BY "event"
      ORDER BY COUNT(*) DESC
      LIMIT 8;
    `;

    const today = await prisma.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*)::int AS "count"
      FROM "AnalyticsEvent"
      WHERE "createdAt" >= date_trunc('day', NOW());
    `;

    return { topEvents, todayEvents: today[0]?.count ?? 0 };
  } catch {
    return { topEvents: [], todayEvents: 0 };
  }
}

export type AnalyticsFunnelOverview = {
  viewProduct: number;
  addToCart: number;
  beginCheckout: number;
  checkoutSubmitSuccess: number;
  viewToCartRate: number;
  cartToCheckoutRate: number;
  checkoutToSuccessRate: number;
  overallRate: number;
};

function toRate(numerator: number, denominator: number): number {
  if (!denominator) return 0;
  return Number(((numerator / denominator) * 100).toFixed(1));
}

export async function getAnalyticsFunnelOverview(): Promise<AnalyticsFunnelOverview> {
  try {
    const rows = await prisma.$queryRaw<Array<{ event: string; count: number }>>`
      SELECT "event", COUNT(*)::int AS "count"
      FROM "AnalyticsEvent"
      WHERE "createdAt" >= NOW() - INTERVAL '14 days'
        AND "event" IN ('view_product', 'add_to_cart', 'begin_checkout', 'checkout_submit_success')
      GROUP BY "event";
    `;

    const byEvent = new Map(rows.map((row) => [row.event, row.count]));
    const viewProduct = byEvent.get("view_product") ?? 0;
    const addToCart = byEvent.get("add_to_cart") ?? 0;
    const beginCheckout = byEvent.get("begin_checkout") ?? 0;
    const checkoutSubmitSuccess = byEvent.get("checkout_submit_success") ?? 0;

    return {
      viewProduct,
      addToCart,
      beginCheckout,
      checkoutSubmitSuccess,
      viewToCartRate: toRate(addToCart, viewProduct),
      cartToCheckoutRate: toRate(beginCheckout, addToCart),
      checkoutToSuccessRate: toRate(checkoutSubmitSuccess, beginCheckout),
      overallRate: toRate(checkoutSubmitSuccess, viewProduct),
    };
  } catch {
    return {
      viewProduct: 0,
      addToCart: 0,
      beginCheckout: 0,
      checkoutSubmitSuccess: 0,
      viewToCartRate: 0,
      cartToCheckoutRate: 0,
      checkoutToSuccessRate: 0,
      overallRate: 0,
    };
  }
}

export type AdminProductArItem = {
  id: string;
  slug: string;
  name: string;
  categoryTitle: string;
  categorySlug: string;
  arModelGlbUrl: string | null;
  arModelUsdzUrl: string | null;
  arReady: boolean;
};

export async function getAdminProductsAr(filter: "all" | "missing" = "all"): Promise<AdminProductArItem[]> {
  try {
    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        slug: string;
        name: string;
        categoryTitle: string;
        categorySlug: string;
        arModelGlbUrl: string | null;
        arModelUsdzUrl: string | null;
      }>
    >`
      SELECT
        p."id",
        p."slug",
        p."name",
        c."title" AS "categoryTitle",
        c."slug" AS "categorySlug",
        p."arModelGlbUrl",
        p."arModelUsdzUrl"
      FROM "Product" p
      LEFT JOIN "Category" c ON c."id" = p."categoryId"
      ORDER BY "name" ASC;
    `;

    const mapped = rows.map((row) => ({
      ...row,
      categoryTitle: row.categoryTitle ?? "Bez kategorie",
      categorySlug: row.categorySlug ?? "",
      arReady: Boolean(row.arModelGlbUrl && row.arModelUsdzUrl),
    }));

    if (filter === "missing") {
      return mapped.filter((row) => !row.arReady);
    }

    return mapped;
  } catch {
    return [];
  }
}

export type AdminArCategoryProgress = {
  categoryTitle: string;
  totalProducts: number;
  readyProducts: number;
  readyRate: number;
};

export async function getAdminArCategoryProgress(): Promise<AdminArCategoryProgress[]> {
  try {
    const rows = await prisma.$queryRaw<
      Array<{ categoryTitle: string; totalProducts: number; readyProducts: number }>
    >`
      SELECT
        c."title" AS "categoryTitle",
        COUNT(p."id")::int AS "totalProducts",
        COUNT(p."id") FILTER (
          WHERE p."arModelGlbUrl" IS NOT NULL
            AND p."arModelGlbUrl" <> ''
            AND p."arModelUsdzUrl" IS NOT NULL
            AND p."arModelUsdzUrl" <> ''
        )::int AS "readyProducts"
      FROM "Category" c
      LEFT JOIN "Product" p ON p."categoryId" = c."id"
      GROUP BY c."title"
      ORDER BY c."title" ASC;
    `;

    return rows.map((row) => ({
      ...row,
      readyRate: toRate(row.readyProducts, row.totalProducts),
    }));
  } catch {
    return [];
  }
}

/** Export CSV: jeden řádek = jedna objednávka */
export type AdminOrderExportSummaryRow = {
  id: string;
  createdAt: string;
  status: string;
  orderNumber: string | null;
  variableSymbol: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  city: string;
  postalCode: string;
  totalPrice: number;
  currency: string | null;
  itemsSummary: string | null;
};

/** Export CSV: jeden řádek = jedna položka objednávky */
export type AdminOrderExportLineRow = {
  orderId: string;
  orderNumber: string | null;
  variableSymbol: string | null;
  createdAt: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  city: string;
  postalCode: string;
  orderTotal: number;
  currency: string | null;
  itemName: string;
  itemQuantity: number;
  itemUnitPrice: number;
  lineTotal: number;
  configSummary: string | null;
};

export async function getAdminOrdersExportSummary(): Promise<AdminOrderExportSummaryRow[]> {
  try {
    return await prisma.$queryRaw<AdminOrderExportSummaryRow[]>`
      SELECT
        o."id",
        o."createdAt"::text AS "createdAt",
        o."status",
        o."orderNumber",
        o."variableSymbol",
        o."customerName",
        o."customerEmail",
        o."customerPhone",
        o."street",
        o."city",
        o."postalCode",
        o."totalPrice"::int AS "totalPrice",
        o."currency",
        (
          SELECT STRING_AGG(
            i."name" || ' ×' || i."quantity"::text || ' @ ' || i."unitPrice"::text || ' Kč',
            ' | '
            ORDER BY i."id"
          )
          FROM "OrderItem" i
          WHERE i."orderId" = o."id"
        ) AS "itemsSummary"
      FROM "Order" o
      ORDER BY o."createdAt" DESC
      LIMIT 2000;
    `;
  } catch {
    return await prisma.$queryRaw<AdminOrderExportSummaryRow[]>`
      SELECT
        o."id",
        o."createdAt"::text AS "createdAt",
        o."status",
        NULL::text AS "orderNumber",
        NULL::text AS "variableSymbol",
        o."customerName",
        o."customerEmail",
        o."customerPhone",
        o."street",
        o."city",
        o."postalCode",
        o."totalPrice"::int AS "totalPrice",
        o."currency",
        (
          SELECT STRING_AGG(
            i."name" || ' ×' || i."quantity"::text || ' @ ' || i."unitPrice"::text || ' Kč',
            ' | '
            ORDER BY i."id"
          )
          FROM "OrderItem" i
          WHERE i."orderId" = o."id"
        ) AS "itemsSummary"
      FROM "Order" o
      ORDER BY o."createdAt" DESC
      LIMIT 2000;
    `;
  }
}

export async function getAdminOrdersExportLines(): Promise<AdminOrderExportLineRow[]> {
  try {
    return await prisma.$queryRaw<AdminOrderExportLineRow[]>`
      SELECT
        o."id" AS "orderId",
        o."orderNumber",
        o."variableSymbol",
        o."createdAt"::text AS "createdAt",
        o."status",
        o."customerName",
        o."customerEmail",
        o."customerPhone",
        o."street",
        o."city",
        o."postalCode",
        o."totalPrice"::int AS "orderTotal",
        o."currency",
        oi."name" AS "itemName",
        oi."quantity"::int AS "itemQuantity",
        oi."unitPrice"::int AS "itemUnitPrice",
        (oi."unitPrice" * oi."quantity")::int AS "lineTotal",
        (
          SELECT STRING_AGG(c."key" || '=' || REPLACE(c."value", E'\n', ' '), '; ' ORDER BY c."id")
          FROM "OrderItemConfig" c
          WHERE c."orderItemId" = oi."id"
        ) AS "configSummary"
      FROM "Order" o
      INNER JOIN "OrderItem" oi ON oi."orderId" = o."id"
      ORDER BY o."createdAt" DESC, o."id", oi."id"
      LIMIT 10000;
    `;
  } catch {
    return await prisma.$queryRaw<AdminOrderExportLineRow[]>`
      SELECT
        o."id" AS "orderId",
        NULL::text AS "orderNumber",
        NULL::text AS "variableSymbol",
        o."createdAt"::text AS "createdAt",
        o."status",
        o."customerName",
        o."customerEmail",
        o."customerPhone",
        o."street",
        o."city",
        o."postalCode",
        o."totalPrice"::int AS "orderTotal",
        o."currency",
        oi."name" AS "itemName",
        oi."quantity"::int AS "itemQuantity",
        oi."unitPrice"::int AS "itemUnitPrice",
        (oi."unitPrice" * oi."quantity")::int AS "lineTotal",
        (
          SELECT STRING_AGG(c."key" || '=' || REPLACE(c."value", E'\n', ' '), '; ' ORDER BY c."id")
          FROM "OrderItemConfig" c
          WHERE c."orderItemId" = oi."id"
        ) AS "configSummary"
      FROM "Order" o
      INNER JOIN "OrderItem" oi ON oi."orderId" = o."id"
      ORDER BY o."createdAt" DESC, o."id", oi."id"
      LIMIT 10000;
    `;
  }
}
