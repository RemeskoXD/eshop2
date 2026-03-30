import Link from "next/link";
import AdminLeadFollowUpActions from "@/components/admin-lead-followup-actions";
import { serverAdminCan } from "@/lib/admin-auth-server";
import { getLeadDailyTrend, getLeadOverview, getLeadSourceStats, getRecentLeads } from "@/lib/lead-capture";
import {
  getAdminOrders,
  getAdminRecentActivity,
  getAnalyticsOverview,
  getAnalyticsFunnelOverview,
} from "@/lib/admin-orders";

type AdminOrdersPageProps = {
  searchParams: Promise<{ source?: string; recentDays?: string }>;
};

function withLeadFilterQuery(args: { source?: string; recentDays?: string }): string {
  const qs = new URLSearchParams();
  if (args.source) qs.set("source", args.source);
  if (args.recentDays) qs.set("recentDays", args.recentDays);
  const q = qs.toString();
  return q ? `?${q}` : "";
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { source: sourceRaw, recentDays: recentDaysRaw } = await searchParams;
  const selectedSource = (sourceRaw ?? "").trim();
  const selectedRecentDays = recentDaysRaw === "7" ? "7" : "";
  const sinceDays = selectedRecentDays ? 7 : null;
  const orders = await getAdminOrders();
  const activity = await getAdminRecentActivity(14);
  const analytics = await getAnalyticsOverview();
  const funnel = await getAnalyticsFunnelOverview();
  const leads = await getLeadOverview();
  const leadTrend = await getLeadDailyTrend(14);
  const sourceStats = await getLeadSourceStats(8);
  const recentLeads = await getRecentLeads({ limit: 15, source: selectedSource || null, sinceDays });
  const canExport = await serverAdminCan("order_export");
  const trendMax = Math.max(1, ...leadTrend.map((d) => d.count));

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
      <h1 className="text-2xl font-semibold sm:text-3xl">Administrace – Objednávky</h1>
      <p className="mt-2 text-sm text-black/70">Přehled posledních objednávek z e-shopu.</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <Link href="/admin/produkty/ar" className="font-semibold text-primary hover:underline">
          Správa AR modelů produktů
        </Link>
        <span className="hidden text-black/30 sm:inline">|</span>
        {canExport ? (
          <div className="flex flex-wrap gap-3">
            <a
              href="/api/admin/orders/export"
              className="font-semibold text-primary hover:underline"
            >
              Export CSV (souhrn)
            </a>
            <a
              href="/api/admin/orders/export?mode=lines"
              className="font-semibold text-primary hover:underline"
            >
              Export CSV (položky)
            </a>
            <a
              href="/api/admin/leads/export"
              className="font-semibold text-primary hover:underline"
            >
              Export CSV (leady)
            </a>
          </div>
        ) : (
          <p className="text-xs text-black/55">
            Export CSV (osobní údaje) je dostupný rolím <strong>manager</strong> a <strong>owner</strong>.
          </p>
        )}
      </div>
      <p className="mt-2 text-xs text-black/55">
        Soubor CSV používá oddělovač „;“ a UTF-8 pro Excel. Přístup chrání přihlášení do administrace.
      </p>

      <section className="mt-6 rounded-xl border border-black/10 p-4">
        <h2 className="text-lg font-semibold">Lead přehled (měkké konverze)</h2>
        <p className="mt-1 text-xs text-black/55">Checklisty, konzultace a další kontaktní poptávky mimo objednávku.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-black/10 bg-muted p-3 text-sm">
            <p className="text-black/70">Celkem leadů</p>
            <p className="text-xl font-semibold">{leads.total}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-muted p-3 text-sm">
            <p className="text-black/70">Posledních 7 dní</p>
            <p className="text-xl font-semibold">{leads.last7Days}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-muted p-3 text-sm">
            <p className="text-black/70">Posledních 30 dní</p>
            <p className="text-xl font-semibold">{leads.last30Days}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-muted p-3 text-sm">
            <p className="text-black/70">Top zdroj</p>
            <p className="text-base font-semibold">{leads.topSource ?? "—"}</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-black/10 bg-card p-3">
          <p className="text-sm text-black/70">
            Lead → objednávka (30 dní):{" "}
            <span className="font-semibold text-foreground">{leads.leadToOrderRate30Days} %</span>
            {" "}({leads.ordersLast30Days} objednávek / {leads.last30Days} leadů)
          </p>
        </div>
        <div className="mt-4 rounded-lg border border-black/10 bg-card p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.11em] text-black/55">Trend leadů (14 dní)</p>
          {leadTrend.length === 0 ? (
            <p className="mt-2 text-sm text-black/55">Trend zatím není dostupný.</p>
          ) : (
            <div className="mt-3 grid gap-1">
              {leadTrend.map((row) => (
                <div key={row.day} className="grid grid-cols-[78px_1fr_36px] items-center gap-2 text-xs">
                  <span className="text-black/55">{new Date(row.day).toLocaleDateString("cs-CZ", { day: "2-digit", month: "2-digit" })}</span>
                  <div className="h-2 rounded bg-black/[0.06]">
                    <div
                      className="h-2 rounded bg-primary"
                      style={{ width: `${Math.max(6, Math.round((row.count / trendMax) * 100))}%` }}
                    />
                  </div>
                  <span className="text-right font-semibold text-foreground/85">{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-black/10 p-4">
        <h2 className="text-lg font-semibold">Poslední změny stavů objednávek</h2>
        <p className="mt-1 text-xs text-black/55">Rychlý přehled pro dispečink — posledních 14 záznamů.</p>
        {activity.length === 0 ? (
          <p className="mt-3 text-sm text-black/60">Zatím žádná historie stavů.</p>
        ) : (
          <ul className="mt-3 divide-y divide-black/10 text-sm">
            {activity.map((row) => (
              <li key={row.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Link
                    href={`/admin/objednavky/${row.orderId}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {row.orderNumber?.trim() ? row.orderNumber : `Objednávka ${row.orderId.slice(0, 8)}…`}
                  </Link>
                  <span className="text-black/70"> · {row.customerName}</span>
                  <p className="mt-0.5 text-black/65">
                    {row.fromStatus ?? "—"} → <strong>{row.toStatus}</strong>
                    {row.changedByEmail ? (
                      <span className="text-black/50"> · {row.changedByEmail}</span>
                    ) : null}
                  </p>
                  {row.note ? <p className="mt-1 text-xs text-black/55">{row.note}</p> : null}
                </div>
                <time className="shrink-0 text-xs text-black/50 sm:text-right">
                  {new Date(row.changedAt).toLocaleString("cs-CZ")}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-black/10 p-4">
        <h2 className="text-lg font-semibold">Poslední leady</h2>
        <p className="mt-1 text-xs text-black/55">Rychlý operativní seznam pro zpětné volání a follow-up.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-black/50">Zdroj:</span>
          <Link
            href={`/admin/objednavky${withLeadFilterQuery({ recentDays: selectedRecentDays || undefined })}`}
            className={`rounded-full border px-2.5 py-1 ${
              !selectedSource ? "border-primary/30 bg-primary/10 text-primary" : "border-black/15 bg-white text-foreground/75"
            }`}
          >
            Vše
          </Link>
          {sourceStats.map((s) => (
            <Link
              key={s.source}
              href={`/admin/objednavky${withLeadFilterQuery({ source: s.source, recentDays: selectedRecentDays || undefined })}`}
              className={`rounded-full border px-2.5 py-1 ${
                selectedSource === s.source
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-black/15 bg-white text-foreground/75"
              }`}
            >
              {s.source} ({s.count})
            </Link>
          ))}
          <span className="ml-2 font-semibold text-black/50">Období:</span>
          <Link
            href={`/admin/objednavky${withLeadFilterQuery({ source: selectedSource || undefined })}`}
            className={`rounded-full border px-2.5 py-1 ${
              !selectedRecentDays ? "border-primary/30 bg-primary/10 text-primary" : "border-black/15 bg-white text-foreground/75"
            }`}
          >
            Vše
          </Link>
          <Link
            href={`/admin/objednavky${withLeadFilterQuery({ source: selectedSource || undefined, recentDays: "7" })}`}
            className={`rounded-full border px-2.5 py-1 ${
              selectedRecentDays === "7"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-black/15 bg-white text-foreground/75"
            }`}
          >
            Posledních 7 dní
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <p className="mt-3 text-sm text-black/60">Zatím nejsou dostupné žádné leady.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border border-black/10">
            <table className="min-w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-3 py-2.5">Datum</th>
                  <th className="px-3 py-2.5">E-mail</th>
                  <th className="px-3 py-2.5">Telefon</th>
                  <th className="px-3 py-2.5">Zdroj</th>
                  <th className="px-3 py-2.5">Souhlas</th>
                  <th className="px-3 py-2.5">Akce</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead, idx) => (
                  <tr key={`${lead.email}-${lead.createdAt.toString()}-${idx}`} className="border-t border-black/5">
                    <td className="px-3 py-2.5 whitespace-nowrap">{new Date(lead.createdAt).toLocaleString("cs-CZ")}</td>
                    <td className="px-3 py-2.5">
                      <a className="font-medium text-primary hover:underline" href={`mailto:${lead.email}`}>
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-3 py-2.5">
                      {lead.phone ? (
                        <a className="font-medium text-primary hover:underline" href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}>
                          {lead.phone}
                        </a>
                      ) : (
                        <span className="text-black/45">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">{lead.source}</td>
                    <td className="px-3 py-2.5">{lead.consent ? "ano" : "ne"}</td>
                    <td className="px-3 py-2.5">
                      <AdminLeadFollowUpActions email={lead.email} source={lead.source} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-black/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Přehled analytiky (14 dní)</h2>
          <p className="text-sm text-black/70">Dnes: {analytics.todayEvents} událostí</p>
        </div>
        {analytics.topEvents.length === 0 ? (
          <p className="mt-3 text-sm text-black/60">Zatím nejsou dostupná data analytiky.</p>
        ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {analytics.topEvents.map((item) => (
              <div key={item.event} className="rounded-lg border border-black/10 bg-muted p-3 text-sm">
                <p className="font-medium">{item.event}</p>
                <p className="text-black/70">{item.count}x</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-black/10 p-4">
        <h2 className="text-lg font-semibold">Konverzní funnel (14 dní)</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-black/10 bg-muted p-3 text-sm">
            <p className="text-black/70">1. Zobrazení produktu</p>
            <p className="text-xl font-semibold">{funnel.viewProduct}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-muted p-3 text-sm">
            <p className="text-black/70">2. Přidání do košíku</p>
            <p className="text-xl font-semibold">{funnel.addToCart}</p>
            <p className="text-xs text-black/60">{funnel.viewToCartRate} % ze zobrazení</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-muted p-3 text-sm">
            <p className="text-black/70">3. Zahájení objednávky (pokladna)</p>
            <p className="text-xl font-semibold">{funnel.beginCheckout}</p>
            <p className="text-xs text-black/60">{funnel.cartToCheckoutRate} % z košíku</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-muted p-3 text-sm">
            <p className="text-black/70">4. Úspěšně odesláno</p>
            <p className="text-xl font-semibold">{funnel.checkoutSubmitSuccess}</p>
            <p className="text-xs text-black/60">{funnel.checkoutToSuccessRate} % z pokladny</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-black/70">
          Celková konverze zobrazení → objednávka: <span className="font-semibold">{funnel.overallRate} %</span>
        </p>
      </section>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/10">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-4 py-3">Číslo</th>
              <th className="px-4 py-3">Zákazník</th>
              <th className="hidden px-4 py-3 md:table-cell">Datum</th>
              <th className="hidden px-4 py-3 lg:table-cell">E-mail</th>
              <th className="px-4 py-3">Stav</th>
              <th className="hidden px-4 py-3 sm:table-cell">Položky</th>
              <th className="px-4 py-3">Celkem</th>
              <th className="px-4 py-3">Detail</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-black/60" colSpan={7}>
                  Zatím nejsou k dispozici žádné objednávky.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t border-black/5">
                  <td className="px-4 py-3">
                    {order.orderNumber?.trim() ? (
                      <span className="font-medium text-foreground">{order.orderNumber}</span>
                    ) : (
                      <span className="text-black/45" title={order.id}>
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="hidden px-4 py-3 md:table-cell">{new Date(order.createdAt).toLocaleString("cs-CZ")}</td>
                  <td className="hidden px-4 py-3 lg:table-cell">{order.customerEmail}</td>
                  <td className="px-4 py-3">{order.status}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">{order.itemsCount}</td>
                  <td className="px-4 py-3">{order.totalPrice.toLocaleString("cs-CZ")} Kč</td>
                  <td className="px-4 py-3">
                    <Link className="font-semibold text-primary hover:underline" href={`/admin/objednavky/${order.id}`}>
                      Otevřít
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
