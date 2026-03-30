import { cookies } from "next/headers";
import {
  getRoleCodesForAdminSessionEmail,
  hasRolePermission,
  type AdminPermission,
} from "@/lib/admin-authz";
import { verifyAdminSessionTokenSync } from "@/lib/admin-session-verify-node";

/** E-mail z session cookie (pro porovnání „já“ na stránce Tým). */
export async function getServerAdminSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("qapi_admin")?.value;
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!token || !secret || secret.length < 16) return null;
  const session = verifyAdminSessionTokenSync(token, secret);
  return session?.email ?? null;
}

/**
 * Role aktuální session pro serverové komponenty (bez Request objektu).
 */
export async function getServerAdminRoleCodes(): Promise<string[] | null> {
  if (process.env.ADMIN_RBAC_DISABLED === "true") {
    return ["owner", "manager", "support"];
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("qapi_admin")?.value;
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!token || !secret || secret.length < 16) {
    /* Při Basic Auth fallbacku nemusí být cookie — UI zobrazíme jako plná oprávnění. */
    if (process.env.ADMIN_ALLOW_BASIC_FALLBACK === "true") {
      return ["owner", "manager", "support"];
    }
    return null;
  }

  const session = verifyAdminSessionTokenSync(token, secret);
  if (!session) {
    if (process.env.ADMIN_ALLOW_BASIC_FALLBACK === "true") {
      return ["owner", "manager", "support"];
    }
    return null;
  }

  return getRoleCodesForAdminSessionEmail(session.email);
}

export async function serverAdminCan(permission: AdminPermission): Promise<boolean> {
  const roles = await getServerAdminRoleCodes();
  if (!roles?.length) return false;
  return hasRolePermission(roles, permission);
}
