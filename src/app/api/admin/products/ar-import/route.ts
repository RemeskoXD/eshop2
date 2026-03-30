import { NextResponse } from "next/server";
import {
  assertAdminPermission,
  resolveAdminAuth,
  unauthorizedJson,
} from "@/lib/admin-authz";
import { prisma } from "@/lib/prisma";

type CsvRow = {
  slug: string;
  arModelGlbUrl: string;
  arModelUsdzUrl: string;
};

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      out.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  out.push(current);
  return out.map((value) => value.trim());
}

export async function POST(request: Request) {
  const auth = await resolveAdminAuth(request);
  if (!auth) return unauthorizedJson();
  const denied = assertAdminPermission(auth, "product_ar_write");
  if (denied) return denied;

  try {
    const body = await request.text();
    const lines = body.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV neobsahuje data." }, { status: 400 });
    }

    const header = parseCsvLine(lines[0]);
    const expected = ["slug", "arModelGlbUrl", "arModelUsdzUrl"];
    if (header.join(",") !== expected.join(",")) {
      return NextResponse.json(
        { error: "Neplatná hlavička CSV. Očekáváno: slug,arModelGlbUrl,arModelUsdzUrl" },
        { status: 400 },
      );
    }

    const rows: CsvRow[] = lines.slice(1).map((line) => {
      const [slug = "", arModelGlbUrl = "", arModelUsdzUrl = ""] = parseCsvLine(line);
      return { slug, arModelGlbUrl, arModelUsdzUrl };
    });

    let updated = 0;
    for (const row of rows) {
      if (!row.slug) continue;
      const count = await prisma.$executeRaw`
        UPDATE "Product"
        SET
          "arModelGlbUrl" = ${row.arModelGlbUrl || null},
          "arModelUsdzUrl" = ${row.arModelUsdzUrl || null}
        WHERE "slug" = ${row.slug};
      `;
      if (Number(count) > 0) updated += 1;
    }

    return NextResponse.json({ ok: true, updated, rows: rows.length });
  } catch {
    return NextResponse.json({ error: "CSV import selhal." }, { status: 500 });
  }
}
