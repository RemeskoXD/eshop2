function base64UrlToUtf8(b64url) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  const padded = pad ? b64 + "=".repeat(4 - pad) : b64;
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

const payload = { v: 1, email: "admin@qapi.cz", exp: 1775315886 };
const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
console.log("payloadB64:", payloadB64);
console.log("decoded:", base64UrlToUtf8(payloadB64));
