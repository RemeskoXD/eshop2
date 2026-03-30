import Link from "next/link";
import AdminCreateAdminForm from "@/components/admin-create-admin-form";
import AdminTeamRolesForm from "@/components/admin-team-roles-form";
import AdminUserAccountActions from "@/components/admin-user-account-actions";
import { getServerAdminSessionEmail, serverAdminCan } from "@/lib/admin-auth-server";
import { listAdminTeamMembers } from "@/lib/admin-team";

export default async function AdminTymPage() {
  const canView = await serverAdminCan("admin_team_view");
  const canEditRoles = await serverAdminCan("admin_team_roles");

  if (!canView) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        <h1 className="text-2xl font-semibold">Tým</h1>
        <p className="mt-4 text-sm text-black/70">
          Tuto sekci mohou zobrazit jen role <strong>owner</strong> a <strong>manager</strong>.
        </p>
        <Link href="/admin/objednavky" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
          ← Zpět na objednávky
        </Link>
      </main>
    );
  }

  const members = await listAdminTeamMembers();
  const sessionEmail = (await getServerAdminSessionEmail())?.trim().toLowerCase() ?? null;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-8">
      <p className="text-sm">
        <Link href="/admin/objednavky" className="font-medium text-primary hover:underline">
          ← Objednávky
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">Tým administrace</h1>
      <p className="mt-2 text-sm text-black/70">
        Uživatelé z tabulky <code className="rounded bg-black/5 px-1">AdminUser</code>. Úpravu rolí a vytvoření účtu
        může provést pouze <strong>owner</strong>.
      </p>
      <p className="mt-2 text-xs text-black/55">
        Přihlášení: stejný e-mail jako v <code className="rounded bg-black/5 px-1">AdminUser</code> + heslo z
        formuláře nebo vygenerované.
      </p>

      {canEditRoles ? (
        <div className="mt-8">
          <AdminCreateAdminForm />
        </div>
      ) : null}

      {members.length === 0 ? (
        <p className="mt-8 text-sm text-black/60">
          Zatím žádný záznam v <code className="text-xs">AdminUser</code>. Jako owner můžete účet vytvořit výše, nebo
          použít SQL skript <code className="text-xs">003_admin_and_order_status.sql</code>.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {members.map((m) => (
            <li key={m.id} className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{m.fullName}</p>
                  <p className="text-sm text-black/70">{m.email}</p>
                  <p className="mt-1 text-xs text-black/50">ID: {m.id}</p>
                </div>
                <div className="w-full max-w-md shrink-0">
                  <AdminUserAccountActions
                    userId={m.id}
                    email={m.email}
                    isActive={m.isActive}
                    isSelf={sessionEmail !== null && m.email.trim().toLowerCase() === sessionEmail}
                    readOnly={!canEditRoles}
                  />
                </div>
              </div>
              <div className="mt-3 border-t border-black/5 pt-3">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-black/50">Role</p>
                <AdminTeamRolesForm userId={m.id} initialRoles={m.roleCodes} readOnly={!canEditRoles} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
