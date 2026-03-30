import { NextResponse } from "next/server";
import {
  assertAdminPermission,
  resolveAdminAuth,
  unauthorizedJson,
} from "@/lib/admin-authz";
import {
  createAdminUser,
  generateAdminTempPassword,
  listAdminTeamMembers,
} from "@/lib/admin-team";

type CreateBody = {
  email?: string;
  fullName?: string;
  password?: string;
  roles?: string[];
  generatePassword?: boolean;
};

export async function GET(request: Request) {
  const auth = await resolveAdminAuth(request);
  if (!auth) return unauthorizedJson();
  const denied = assertAdminPermission(auth, "admin_team_view");
  if (denied) return denied;

  const members = await listAdminTeamMembers();
  return NextResponse.json({ members });
}

export async function POST(request: Request) {
  const auth = await resolveAdminAuth(request);
  if (!auth) return unauthorizedJson();
  const denied = assertAdminPermission(auth, "admin_team_roles");
  if (denied) return denied;

  let body: CreateBody;
  try {
    body = (await request.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "Neplatný JSON." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const fullName = String(body.fullName ?? "").trim();
  const generatePassword = Boolean(body.generatePassword);
  const roles = Array.isArray(body.roles) ? body.roles.map((r) => String(r)) : [];

  let passwordPlain = String(body.password ?? "");
  let generatedPassword: string | undefined;

  if (generatePassword) {
    generatedPassword = generateAdminTempPassword();
    passwordPlain = generatedPassword;
  } else if (passwordPlain.length < 8) {
    return NextResponse.json(
      { error: "Heslo musí mít alespoň 8 znaků, nebo zapněte vygenerování hesla." },
      { status: 400 },
    );
  }

  const result = await createAdminUser({
    email,
    fullName,
    passwordPlain,
    roleCodes: roles,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    userId: result.id,
    ...(generatedPassword ? { generatedPassword } : {}),
  });
}
