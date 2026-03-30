import { prisma } from "@/lib/prisma";

/**
 * Najde AdminUser.id podle e-mailu (pro FK v OrderStatusHistory).
 */
export async function getAdminUserIdByEmail(email: string): Promise<string | null> {
  try {
    const rows = await prisma.$queryRaw<{ id: string }[]>`
      SELECT "id"
      FROM "AdminUser"
      WHERE LOWER("email") = LOWER(${email.trim()})
        AND "isActive" = TRUE
      LIMIT 1;
    `;
    return rows[0]?.id ?? null;
  } catch {
    return null;
  }
}
