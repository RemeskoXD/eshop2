import type { Metadata } from "next";
import Link from "next/link";
import AdminLoginForm from "@/components/admin-login-form";

export const metadata: Metadata = {
  title: "Přihlášení | QAPI administrace",
  robots: { index: false, follow: false },
};

function sanitizeNextParam(next: string | undefined): string {
  if (!next || !next.startsWith("/admin")) return "/admin/objednavky";
  if (next.startsWith("//") || next.includes(":") || next.includes("..")) return "/admin/objednavky";
  return next;
}

export default async function AdminPrihlaseniPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const defaultNext = sanitizeNextParam(next);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-muted px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">Admin</p>
        <h1 className="mt-2 text-center text-2xl font-semibold">Přihlášení</h1>
        <p className="mt-2 text-center text-sm text-black/65">
          Zadejte přihlašovací údaje pro správu objednávek a AR modelů.
        </p>
        <AdminLoginForm defaultNext={defaultNext} />
        <p className="mt-6 text-center text-xs text-black/50">
          <Link href="/" className="font-medium text-primary hover:underline">
            ← Zpět na e-shop
          </Link>
        </p>
      </div>
    </main>
  );
}
