import { createHmac } from "crypto";

export type AdminSessionPayload = {
  v: 1;
  email: string;
  exp: number;
};

/** Podepsání session — pouze z Node runtime (API routes). */
export function signAdminSessionToken(payload: AdminSessionPayload, secret: string): string {
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return `${payloadB64}.${sig}`;
}
