/**
 * Ověření session tokenu — pouze Web Crypto (kompatibilní s Edge / proxy).
 */
export type VerifiedAdminSession = {
  email: string;
};

function arrayBufferToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]!);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}

function base64UrlToUtf8(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  const padded = pad ? b64 + "=".repeat(4 - pad) : b64;
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i)! ^ b.charCodeAt(i)!;
  return diff === 0;
}

export async function verifyAdminSessionToken(
  token: string | null | undefined,
  secret: string,
): Promise<VerifiedAdminSession | null> {
  if (!token || !secret || secret.length < 16) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!payloadB64 || !sig) return null;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
  const expected = arrayBufferToBase64Url(sigBuf);
  if (!timingSafeEqualStr(sig, expected)) return null;

  let json: unknown;
  try {
    json = JSON.parse(base64UrlToUtf8(payloadB64));
  } catch {
    return null;
  }
  if (!json || typeof json !== "object") return null;
  const rec = json as Record<string, unknown>;
  if (rec.v !== 1) return null;
  if (typeof rec.email !== "string" || !rec.email) return null;
  if (typeof rec.exp !== "number" || rec.exp < Date.now() / 1000) return null;
  return { email: rec.email };
}
