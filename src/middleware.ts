import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseCanonicalSiteUrl, resolveCanonicalRedirect } from "@/lib/canonical-host";
import { verifyAdminSessionToken } from "@/lib/admin-session-verify";

const COOKIE_NAME = "qapi_admin";

function padBase64(s: string): string {
  const pad = s.length % 4;
  return pad ? s + "=".repeat(4 - pad) : s;
}

function decodeBasicAuth(encoded: string): { user: string; pass: string } | null {
  try {
    const decoded = atob(padBase64(encoded));
    const idx = decoded.indexOf(":");
    if (idx < 0) return null;
    return { user: decoded.slice(0, idx), pass: decoded.slice(idx + 1) };
  } catch {
    return null;
  }
}

function isBasicAuthOk(request: NextRequest): boolean {
  if (process.env.ADMIN_ALLOW_BASIC_FALLBACK !== "true") return false;
  const username = process.env.ADMIN_BASIC_USER?.trim();
  const password = process.env.ADMIN_BASIC_PASSWORD;
  if (!username || password === undefined || password === null) return false;
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) return false;
  const encoded = authHeader.slice(6).trim();
  const pair = decodeBasicAuth(encoded);
  if (!pair) return false;
  return pair.user === username && pair.pass === password;
}

export async function middleware(request: NextRequest) {
  // Canonical redirect disabled for Coolify deployment
  // const canonical = parseCanonicalSiteUrl();
  // if (canonical) {
  //   const decision = resolveCanonicalRedirect(request.headers.get("host"), request.nextUrl, canonical);
  //   if (decision.action === "redirect") {
  //     const nextUrl = request.nextUrl.clone();
  //     nextUrl.hostname = decision.hostname;
  //     nextUrl.protocol = decision.protocol;
  //     return NextResponse.redirect(nextUrl, 308);
  //   }
  // }

  const path = request.nextUrl.pathname;

  const isAdminApp = path.startsWith("/admin");
  const isAdminApi = path.startsWith("/api/admin");
  if (!isAdminApp && !isAdminApi) {
    return NextResponse.next();
  }

  if (path === "/admin" || path === "/admin/") {
    return NextResponse.redirect(new URL("/admin/objednavky", request.url));
  }

  if (path === "/admin/prihlaseni" || path.startsWith("/admin/prihlaseni/")) {
    const secret = process.env.ADMIN_SESSION_SECRET?.trim();
    if (secret && secret.length >= 16) {
      const token = request.cookies.get(COOKIE_NAME)?.value;
      const session = await verifyAdminSessionToken(token, secret);
      if (session) {
        const nextParam = request.nextUrl.searchParams.get("next");
        let target = "/admin/objednavky";
        if (
          nextParam?.startsWith("/admin") &&
          !nextParam.startsWith("//") &&
          !nextParam.includes(":") &&
          !nextParam.includes("..")
        ) {
          target = nextParam;
        }
        return NextResponse.redirect(new URL(target, request.url));
      }
    }
    return NextResponse.next();
  }

  if (path === "/api/admin/auth/login" || path === "/api/admin/auth/logout") {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  const allowBasic = process.env.ADMIN_ALLOW_BASIC_FALLBACK === "true";

  if (!secret || secret.length < 16) {
    if (allowBasic && isBasicAuthOk(request)) {
      return NextResponse.next();
    }
    if (isAdminApi) {
      return NextResponse.json(
        {
          error:
            "Chybí ADMIN_SESSION_SECRET (min. 16 znaků). Dočasně lze zapnout ADMIN_ALLOW_BASIC_FALLBACK=true.",
        },
        { status: 503 },
      );
    }
    return new NextResponse(
      "Admin: nastavte ADMIN_SESSION_SECRET (viz .env.example) nebo dočasně ADMIN_ALLOW_BASIC_FALLBACK=true.",
      { status: 503 },
    );
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await verifyAdminSessionToken(token, secret);
  if (session) {
    return NextResponse.next();
  }

  if (allowBasic && isBasicAuthOk(request)) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json({ error: "Neautorizováno" }, { status: 401 });
  }

  const login = new URL("/admin/prihlaseni", request.url);
  login.searchParams.set("next", path + request.nextUrl.search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
