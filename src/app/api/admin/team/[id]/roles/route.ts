import { NextResponse } from "next/server";
import {
  assertAdminPermission,
  resolveAdminAuth,
  unauthorizedJson,
} from "@/lib/admin-authz";
import { getAdminUserEmailById, replaceAdminUserRoles } from "@/lib/admin-team";

type Body = {
  roles?: string[];
};

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await resolveAdminAuth(request);
  if (!auth) return unauthorizedJson();
  const denied = assertAdminPermission(auth, "admin_team_roles");
  if (denied) return denied;

  const { id: userId } = await params;
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Neplatný JSON." }, { status: 400 });
  }

  const roles = Array.isArray(body.roles) ? body.roles.map((r) => String(r)) : [];

  const targetEmail = await getAdminUserEmailById(userId);
  if (!targetEmail) {
    return NextResponse.json({ error: "Uživatel nebyl nalezen." }, { status: 404 });
  }

  const actorEmail = auth.actorLabel.startsWith("basic:") ? null : auth.actorLabel.trim().toLowerCase();
  const targetLower = targetEmail.toLowerCase();
  if (actorEmail && actorEmail === targetLower && !roles.includes("owner")) {
    return NextResponse.json(
      { error: "Nemůžete si sami odebrat roli owner." },
      { status: 400 },
    );
  }

  const result = await replaceAdminUserRoles(userId, roles);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
