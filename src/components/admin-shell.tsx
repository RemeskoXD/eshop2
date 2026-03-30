"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import AdminSessionHint from "@/components/admin-session-hint";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const isLogin = pathname === "/admin/prihlaseni" || pathname?.startsWith("/admin/prihlaseni/");

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/admin/auth/logout", { method: "POST", credentials: "include" });
    router.push("/admin/prihlaseni");
    router.refresh();
    setLoggingOut(false);
  }

  if (isLogin) {
    return (
      <main id="main-content" className="min-h-screen outline-none" tabIndex={-1}>
        {children}
      </main>
    );
  }

  const navLinks = [
    { href: "/admin/objednavky", label: "Objednávky" },
    { href: "/admin/produkty/ar", label: "AR modely" },
    { href: "/admin/tym", label: "Tým" },
    { href: "/admin/stranky", label: "Stránky" },
    { href: "/admin/nastaveni", label: "Vzhled" },
  ];

  return (
    <div className="flex min-h-screen bg-muted">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-black/10 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-black/10">
          <span className="text-xl font-bold tracking-tight text-primary">QAPI Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-black/70 hover:bg-black/5 hover:text-black"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-black/10 space-y-3">
          <AdminSessionHint />
          <Link 
            href="/" 
            className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-black/70 bg-black/5 rounded-lg hover:bg-black/10 transition-colors"
          >
            Zobrazit web
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            disabled={loggingOut}
            className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {loggingOut ? "Odhlašuji…" : "Odhlásit"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="flex-1 outline-none relative overflow-y-auto" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
