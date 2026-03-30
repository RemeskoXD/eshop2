import { NextResponse } from "next/server";
import { resolveAdminAuth, unauthorizedJson } from "@/lib/admin-authz";

export async function GET(request: Request) {
  const auth = await resolveAdminAuth(request);
  if (!auth) return unauthorizedJson();

  const displayEmail = auth.actorLabel.startsWith("basic:")
    ? "(Basic Auth)"
    : auth.actorLabel;

  return NextResponse.json({
    displayEmail,
    actor: auth.actorLabel,
    roles: auth.roleCodes,
  });
}
