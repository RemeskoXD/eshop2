import { NextResponse } from "next/server";
import { getAdminSessionMaxAgeSeconds, verifyAdminLogin } from "@/lib/admin-auth";
import { signAdminSessionToken } from "@/lib/admin-session-sign";

const COOKIE_NAME = "qapi_admin";

export async function POST(request: Request) {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret || secret.length < 16) {
    return NextResponse.json(
      { error: "Chybí ADMIN_SESSION_SECRET (min. 16 znaků)." },
      { status: 503 },
    );
  }

  let email = "";
  let password = "";
  let nextUrl = "/admin/objednavky";

  const contentType = request.headers.get("content-type") || "";
  const isForm = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");
  
  if (isForm) {
    try {
      const fd = await request.formData();
      email = String(fd.get("email") ?? "").trim();
      password = String(fd.get("password") ?? "");
      const nextParam = String(fd.get("next") ?? "");
      if (nextParam.startsWith("/admin") && !nextParam.startsWith("//") && !nextParam.includes(":") && !nextParam.includes("..")) {
        nextUrl = nextParam;
      }
    } catch {
      return isForm 
        ? NextResponse.redirect(new URL("/admin/prihlaseni?error=Neplatný požadavek", request.url), 303)
        : NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
    }
  } else {
    try {
      const body = (await request.json()) as { email?: string; password?: string };
      email = String(body.email ?? "").trim();
      password = String(body.password ?? "");
    } catch {
      return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
    }
  }

  console.log("Login attempt:", { email, passwordLength: password.length });

  const ok = await verifyAdminLogin(email, password);
  console.log("verifyAdminLogin result:", ok);
  
  if (!ok) {
    if (isForm) {
      const errUrl = new URL("/admin/prihlaseni", request.url);
      errUrl.searchParams.set("error", "Neplatný e-mail nebo heslo");
      if (nextUrl !== "/admin/objednavky") errUrl.searchParams.set("next", nextUrl);
      return NextResponse.redirect(errUrl, 303);
    }
    return NextResponse.json({ error: "Neplatný e-mail nebo heslo." }, { status: 401 });
  }

  const maxAge = getAdminSessionMaxAgeSeconds();
  const exp = Math.floor(Date.now() / 1000) + maxAge;
  const token = signAdminSessionToken({ v: 1, email: email.toLowerCase(), exp }, secret);

  const res = isForm 
    ? NextResponse.redirect(new URL(nextUrl, request.url), 303)
    : NextResponse.json({ ok: true });

  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge,
  });

  return res;
}
