"use client";

import { useEffect, useState } from "react";

type MeResponse = {
  displayEmail?: string;
  actor?: string;
  roles?: string[];
};

export default function AdminSessionHint() {
  const [line, setLine] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/admin/auth/me", { credentials: "include" });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as MeResponse;
        if (!data.roles?.length) return;
        const roles = data.roles.join(", ");
        const who = data.displayEmail ?? data.actor ?? "";
        setLine(who ? `${who} · role: ${roles}` : `Role: ${roles}`);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!line) return null;
  return <p className="max-w-xl text-xs text-black/50">{line}</p>;
}
