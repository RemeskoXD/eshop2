import { timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

function envCredentials(): { email: string | null; password: string | null } {
  const emailRaw =
    process.env.ADMIN_EMAIL?.trim() ||
    process.env.ADMIN_BASIC_USER?.trim() ||
    null;
  const password = process.env.ADMIN_PASSWORD || process.env.ADMIN_BASIC_PASSWORD || null;
  const email = emailRaw ? emailRaw.toLowerCase() : null;
  return { email, password: password ?? null };
}

function safeEqualString(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

/** Ověření proti .env (nebo legacy ADMIN_BASIC_*). */
export function verifyAdminEnvPassword(email: string, password: string): boolean {
  const { email: envEmail, password: envPassword } = envCredentials();
  console.log("envCredentials:", { envEmail, envPasswordLength: envPassword?.length });
  if (!envEmail || envPassword === null) return false;
  const emailMatch = email.trim().toLowerCase() === envEmail;
  const passwordMatch = safeEqualString(password, envPassword);
  console.log("verifyAdminEnvPassword match:", { emailMatch, passwordMatch });
  return emailMatch && passwordMatch;
}

/** Ověření proti tabulce AdminUser (bcrypt), pokud existuje a hash je platný. */
export async function verifyAdminDatabasePassword(email: string, password: string): Promise<boolean> {
  try {
    const rows = await prisma.$queryRaw<{ passwordHash: string }[]>`
      SELECT "passwordHash"
      FROM "AdminUser"
      WHERE LOWER("email") = LOWER(${email.trim()})
        AND "isActive" = TRUE
      LIMIT 1;
    `;
    const hash = rows[0]?.passwordHash;
    if (!hash || hash.includes("REPLACE_WITH_REAL")) return false;
    return bcrypt.compareSync(password, hash);
  } catch {
    return false;
  }
}

export async function verifyAdminLogin(email: string, password: string): Promise<boolean> {
  if (!email.trim() || !password) return false;
  if (await verifyAdminDatabasePassword(email, password)) return true;
  return verifyAdminEnvPassword(email, password);
}

export function getAdminSessionMaxAgeSeconds(): number {
  const raw = process.env.ADMIN_SESSION_MAX_AGE?.trim();
  const n = raw ? Number.parseInt(raw, 10) : NaN;
  if (Number.isFinite(n) && n > 60 && n < 60 * 60 * 24 * 60) return n;
  return 60 * 60 * 24 * 7;
}
