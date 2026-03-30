const { createHmac } = require("crypto");

const secret = "29253f9511009272f8dde593eb5cb488d5b3b9d7b59ab8fc3c715ed2d946cded";
const payload = { v: 1, email: "admin@qapi.cz", exp: 1775315886 };
const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
const sig = createHmac("sha256", secret).update(payloadB64).digest("base64url");
console.log("Node crypto sig:", sig);

async function testSubtle() {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
  const bytes = new Uint8Array(sigBuf);
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  const b64 = btoa(bin);
  const expected = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
  console.log("Web Crypto sig:", expected);
  console.log("Match:", sig === expected);
}

testSubtle();
