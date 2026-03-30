import { NextResponse } from "next/server";
import {
  assertAdminPermission,
  resolveAdminAuth,
  unauthorizedJson,
} from "@/lib/admin-authz";

type Payload = {
  glbUrl?: string;
  usdzUrl?: string;
};

function hasValidExtension(url: string, ext: ".glb" | ".usdz") {
  return url.toLowerCase().includes(ext);
}

function resolveUrl(url: string, origin: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${origin}${url}`;
  return `${origin}/${url}`;
}

async function isReachable(url: string, origin: string): Promise<boolean> {
  try {
    const response = await fetch(resolveUrl(url, origin), { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const auth = await resolveAdminAuth(request);
  if (!auth) return unauthorizedJson();
  const denied = assertAdminPermission(auth, "product_ar_validate");
  if (denied) return denied;

  try {
    const payload = (await request.json()) as Payload;
    const origin = new URL(request.url).origin;
    const glbUrl = (payload.glbUrl ?? "").trim();
    const usdzUrl = (payload.usdzUrl ?? "").trim();

    if (!glbUrl || !usdzUrl) {
      return NextResponse.json(
        { ok: false, error: "Vyplňte GLB i USDZ URL." },
        { status: 400 },
      );
    }

    if (!hasValidExtension(glbUrl, ".glb")) {
      return NextResponse.json(
        { ok: false, error: "GLB URL musí obsahovat .glb" },
        { status: 400 },
      );
    }

    if (!hasValidExtension(usdzUrl, ".usdz")) {
      return NextResponse.json(
        { ok: false, error: "USDZ URL musí obsahovat .usdz" },
        { status: 400 },
      );
    }

    const [glbReachable, usdzReachable] = await Promise.all([
      isReachable(glbUrl, origin),
      isReachable(usdzUrl, origin),
    ]);

    return NextResponse.json({
      ok: glbReachable && usdzReachable,
      glbReachable,
      usdzReachable,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Neplatný požadavek." }, { status: 400 });
  }
}
