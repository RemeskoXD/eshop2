import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { ADMIN_ROLE_OPTIONS } from "@/lib/admin-team-constants";
import { prisma } from "@/lib/prisma";

export function generateAdminTempPassword(): string {
  return randomBytes(14).toString("base64url").slice(0, 20);
}

export async function adminEmailExists(email: string): Promise<boolean> {
  try {
    const rows = await prisma.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*)::int AS "count"
      FROM "AdminUser"
      WHERE LOWER("email") = LOWER(${email.trim()});
    `;
    return (rows[0]?.count ?? 0) > 0;
  } catch {
    return false;
  }
}

/**
 * Vytvoří řádek v AdminUser + role v jedné transakci (owner operace).
 */
export async function createAdminUser(input: {
  email: string;
  fullName: string;
  passwordPlain: string;
  roleCodes: string[];
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim().slice(0, 200) || email.split("@")[0] || "Admin";

  if (!email || !email.includes("@") || email.length > 254) {
    return { ok: false, error: "Zadejte platný e-mail." };
  }

  if (input.passwordPlain.length < 8) {
    return { ok: false, error: "Heslo musí mít alespoň 8 znaků." };
  }

  const allowed = new Set<string>([...ADMIN_ROLE_OPTIONS]);
  let roles = [...new Set(input.roleCodes.filter((c) => allowed.has(c)))];
  if (roles.length === 0) roles = ["support"];

  if (await adminEmailExists(email)) {
    return { ok: false, error: "Uživatel s tímto e-mailem už existuje." };
  }

  const id = `adm_${randomBytes(8).toString("hex")}`;
  const passwordHash = bcrypt.hashSync(input.passwordPlain, 12);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        INSERT INTO "AdminUser" ("id", "email", "fullName", "passwordHash", "isActive")
        VALUES (${id}, ${email}, ${fullName}, ${passwordHash}, TRUE);
      `;

      for (const code of roles) {
        const roleRows = await tx.$queryRaw<{ id: string }[]>`
          SELECT "id" FROM "AdminRole" WHERE "code" = ${code} LIMIT 1;
        `;
        const roleId = roleRows[0]?.id;
        if (!roleId) continue;

        const linkId = `aur_${randomBytes(10).toString("hex")}`;
        await tx.$executeRaw`
          INSERT INTO "AdminUserRole" ("id", "adminUserId", "adminRoleId")
          VALUES (${linkId}, ${id}, ${roleId});
        `;
      }
    });
    return { ok: true, id };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: message };
  }
}

export type AdminTeamMember = {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roleCodes: string[];
};

export async function listAdminTeamMembers(): Promise<AdminTeamMember[]> {
  try {
    const users = await prisma.$queryRaw<
      Array<{ id: string; email: string; fullName: string; isActive: boolean }>
    >`
      SELECT "id", "email", "fullName", "isActive"
      FROM "AdminUser"
      ORDER BY LOWER("email") ASC;
    `;

    const links = await prisma.$queryRaw<Array<{ adminUserId: string; code: string }>>`
      SELECT ur."adminUserId", r."code"
      FROM "AdminUserRole" ur
      INNER JOIN "AdminRole" r ON r."id" = ur."adminRoleId";
    `;

    const byUser = new Map<string, string[]>();
    for (const row of links) {
      const list = byUser.get(row.adminUserId) ?? [];
      list.push(row.code);
      byUser.set(row.adminUserId, list);
    }

    return users.map((u) => ({
      ...u,
      roleCodes: byUser.get(u.id) ?? [],
    }));
  } catch {
    return [];
  }
}

export async function getAdminUserEmailById(userId: string): Promise<string | null> {
  try {
    const rows = await prisma.$queryRaw<{ email: string }[]>`
      SELECT "email" FROM "AdminUser" WHERE "id" = ${userId} LIMIT 1;
    `;
    return rows[0]?.email ?? null;
  } catch {
    return null;
  }
}

/**
 * Nahradí role uživatele (owner-only operace). Prázdné pole = žádná role v DB → v aplikaci se chová jako support.
 */
export async function setAdminUserActive(
  userId: string,
  isActive: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await prisma.$executeRaw`
      UPDATE "AdminUser"
      SET "isActive" = ${isActive}, "updatedAt" = NOW()
      WHERE "id" = ${userId};
    `;
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: message };
  }
}

export async function updateAdminUserPassword(
  userId: string,
  passwordPlain: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (passwordPlain.length < 8) {
    return { ok: false, error: "Heslo musí mít alespoň 8 znaků." };
  }
  const passwordHash = bcrypt.hashSync(passwordPlain, 12);
  try {
    await prisma.$executeRaw`
      UPDATE "AdminUser"
      SET "passwordHash" = ${passwordHash}, "updatedAt" = NOW()
      WHERE "id" = ${userId};
    `;
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: message };
  }
}

export async function replaceAdminUserRoles(
  adminUserId: string,
  roleCodes: string[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  const allowed = new Set<string>([...ADMIN_ROLE_OPTIONS]);
  const filtered = [...new Set(roleCodes.filter((c) => allowed.has(c)))];

  try {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        DELETE FROM "AdminUserRole"
        WHERE "adminUserId" = ${adminUserId};
      `;

      for (const code of filtered) {
        const roleRows = await tx.$queryRaw<{ id: string }[]>`
          SELECT "id" FROM "AdminRole" WHERE "code" = ${code} LIMIT 1;
        `;
        const roleId = roleRows[0]?.id;
        if (!roleId) continue;

        const linkId = `aur_${randomBytes(10).toString("hex")}`;
        await tx.$executeRaw`
          INSERT INTO "AdminUserRole" ("id", "adminUserId", "adminRoleId")
          VALUES (${linkId}, ${adminUserId}, ${roleId});
        `;
      }
    });
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: message };
  }
}
