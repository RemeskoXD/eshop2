import { createHmac, timingSafeEqual } from "crypto";

/**
 * Sync ověření session tokenu (Node.js — API routes).
 */
export function verifyAdminSessionTokenSync(
  token: string | null | undefined,
  secret: string,
): { email: string } | null {
  if (!token || !secret || secret.length < 16) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(payloadB64).digest("base64url");
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;
  try {
    const json = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as Record<
      string,
      unknown
    >;
    if (json.v !== 1 || typeof json.email !== "string" || !json.email) return null;
    if (typeof json.exp !== "number" || json.exp < Date.now() / 1000) return null;
    return { email: json.email };
  } catch {
    return null;
  }
}

export function getCookieFromRequest(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  const parts = header.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed.startsWith(`${name}=`)) continue;
    const raw = trimmed.slice(name.length + 1);
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  return null;
}

/** E-mail přihlášeného admina z requestu (cookie session). */
export function getAdminSessionEmailFromRequest(request: Request): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret || secret.length < 16) return null;
  const token = getCookieFromRequest(request, "qapi_admin");
  const session = verifyAdminSessionTokenSync(token, secret);
  return session?.email ?? null;
}
