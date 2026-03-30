import { NextResponse } from "next/server";
import {
  assertAdminPermission,
  resolveAdminAuth,
  unauthorizedJson,
} from "@/lib/admin-authz";
import {
  generateAdminTempPassword,
  getAdminUserEmailById,
  setAdminUserActive,
  updateAdminUserPassword,
} from "@/lib/admin-team";

type PatchBody = {
  isActive?: boolean;
  newPassword?: string;
  generatePassword?: boolean;
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
  const targetEmail = await getAdminUserEmailById(userId);
  if (!targetEmail) {
    return NextResponse.json({ error: "Uživatel nebyl nalezen." }, { status: 404 });
  }

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Neplatný JSON." }, { status: 400 });
  }

  const hasActive = typeof body.isActive === "boolean";
  const hasPassword =
    body.generatePassword === true || (typeof body.newPassword === "string" && body.newPassword.length > 0);

  if (!hasActive && !hasPassword) {
    return NextResponse.json(
      { error: "Pošlete isActive a/nebo heslo (newPassword / generatePassword)." },
      { status: 400 },
    );
  }

  const actorEmail = auth.actorLabel.startsWith("basic:") ? null : auth.actorLabel.trim().toLowerCase();
  const targetLower = targetEmail.toLowerCase();

  if (hasActive && body.isActive === false && actorEmail && actorEmail === targetLower) {
    return NextResponse.json({ error: "Vlastní účet nemůžete deaktivovat." }, { status: 400 });
  }

  if (hasActive) {
    const r = await setAdminUserActive(userId, body.isActive as boolean);
    if (!r.ok) {
      return NextResponse.json({ error: r.error }, { status: 500 });
    }
  }

  let generatedPassword: string | undefined;

  if (body.generatePassword === true) {
    generatedPassword = generateAdminTempPassword();
    const pr = await updateAdminUserPassword(userId, generatedPassword);
    if (!pr.ok) {
      return NextResponse.json({ error: pr.error }, { status: 400 });
    }
  } else if (typeof body.newPassword === "string" && body.newPassword.length > 0) {
    const pr = await updateAdminUserPassword(userId, body.newPassword);
    if (!pr.ok) {
      return NextResponse.json({ error: pr.error }, { status: 400 });
    }
  }

  return NextResponse.json({
    ok: true,
    ...(generatedPassword ? { generatedPassword } : {}),
  });
}
