import { getAdminSessionEmailFromRequest } from "@/lib/admin-session-verify-node";

function getBasicAuthUsername(request: Request): string | null {
  const h = request.headers.get("authorization");
  if (!h?.startsWith("Basic ")) return null;
  try {
    const encoded = h.slice(6).trim();
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const idx = decoded.indexOf(":");
    if (idx < 0) return null;
    const user = decoded.slice(0, idx);
    return user || null;
  } catch {
    return null;
  }
}

/**
 * Identita pro audit: e-mail ze session, nebo basic:uživatel při legacy Basic Auth.
 */
export function getRequestActorLabel(request: Request): string | null {
  const sessionEmail = getAdminSessionEmailFromRequest(request);
  if (sessionEmail) return sessionEmail;
  if (process.env.ADMIN_ALLOW_BASIC_FALLBACK === "true") {
    const u = getBasicAuthUsername(request);
    if (u) return `basic:${u}`;
  }
  return null;
}
