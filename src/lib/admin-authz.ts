import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestActorLabel } from "@/lib/admin-request-actor";

export type AdminAuthContext = {
  /** Hodnota pro audit (e-mail nebo basic:uživatel). */
  actorLabel: string;
  roleCodes: string[];
};

const PERMISSION_ROLES: Record<AdminPermission, string[]> = {
  order_status: ["owner", "manager", "support"],
  order_export: ["owner", "manager"],
  product_ar_write: ["owner", "manager"],
  product_ar_export: ["owner", "manager"],
  product_ar_validate: ["owner", "manager", "support"],
  admin_team_view: ["owner", "manager"],
  admin_team_roles: ["owner"],
};

export type AdminPermission =
  | "order_status"
  | "order_export"
  | "product_ar_write"
  | "product_ar_export"
  | "product_ar_validate"
  | "admin_team_view"
  | "admin_team_roles";

async function loadRoleCodesFromDatabase(email: string): Promise<string[] | null> {
  try {
    const roleRows = await prisma.$queryRaw<{ code: string }[]>`
      SELECT r."code"
      FROM "AdminUser" u
      INNER JOIN "AdminUserRole" ur ON ur."adminUserId" = u."id"
      INNER JOIN "AdminRole" r ON r."id" = ur."adminRoleId"
      WHERE LOWER(u."email") = LOWER(${email})
        AND u."isActive" = TRUE;
    `;
    if (roleRows.length > 0) {
      return roleRows.map((r) => r.code);
    }

    const userRows = await prisma.$queryRaw<{ id: string }[]>`
      SELECT "id"
      FROM "AdminUser"
      WHERE LOWER("email") = LOWER(${email})
        AND "isActive" = TRUE
      LIMIT 1;
    `;
    if (userRows[0]) {
      return ["support"];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Role pro přihlášený e-mail (RSC / API). Nevolat pro basic:* — tam použijte vlastní logiku.
 */
export async function getRoleCodesForAdminSessionEmail(email: string): Promise<string[]> {
  if (process.env.ADMIN_RBAC_DISABLED === "true") {
    return ["owner", "manager", "support"];
  }
  const fromDb = await loadRoleCodesFromDatabase(email.trim());
  if (fromDb !== null) return fromDb;
  return ["owner"];
}

export function hasRolePermission(roleCodes: string[], permission: AdminPermission): boolean {
  const allowed = PERMISSION_ROLES[permission];
  return roleCodes.some((r) => allowed.includes(r));
}

/**
 * Vyřeší přihlášeného admina a jeho role z DB (AdminUser + AdminUserRole).
 * - `basic:*` (legacy Basic Auth) → plná práva jako owner.
 * - e-mail v .env, ale bez řádku v AdminUser → owner (jednouživatelská instalace).
 * - řádek v AdminUser bez přiřazených rolí → support (opatrný výchozí stav).
 */
export async function resolveAdminAuth(request: Request): Promise<AdminAuthContext | null> {
  const actorLabel = getRequestActorLabel(request);
  if (!actorLabel) return null;

  if (process.env.ADMIN_RBAC_DISABLED === "true") {
    return {
      actorLabel,
      roleCodes: ["owner", "manager", "support"],
    };
  }

  if (actorLabel.startsWith("basic:")) {
    return { actorLabel, roleCodes: ["owner"] };
  }

  const roleCodes = await getRoleCodesForAdminSessionEmail(actorLabel);
  return { actorLabel, roleCodes };
}

export function hasAdminPermission(auth: AdminAuthContext, permission: AdminPermission): boolean {
  return hasRolePermission(auth.roleCodes, permission);
}

export function assertAdminPermission(
  auth: AdminAuthContext,
  permission: AdminPermission,
): NextResponse | null {
  if (hasAdminPermission(auth, permission)) return null;
  return NextResponse.json(
    { error: "K této akci nemáte dostatečné oprávnění (role v administraci)." },
    { status: 403 },
  );
}

export function unauthorizedJson(): NextResponse {
  return NextResponse.json({ error: "Neautorizováno" }, { status: 401 });
}
