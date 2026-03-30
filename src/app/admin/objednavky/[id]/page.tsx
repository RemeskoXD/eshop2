import Link from "next/link";
import { notFound } from "next/navigation";
import AdminOrderStatusForm from "@/components/admin-order-status-form";
import { getAdminOrderById, getOrderStatuses } from "@/lib/admin-orders";
import { hintFromProductMap, loadProductsByNameMap } from "@/lib/order-config-delta-hints";

type AdminOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;
  const { order, items, configs, history } = await getAdminOrderById(id);
  const statusOptions = await getOrderStatuses();
  const productsByName = await loadProductsByNameMap();

  if (!order) notFound();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
      <p className="text-sm">
        <Link href="/admin/objednavky" className="font-medium text-primary hover:underline">
          ← Zpět na seznam objednávek
        </Link>
      </p>
      <h1 className="mt-4 text-3xl font-semibold">Detail objednávky</h1>
      <div className="mt-2 space-y-1 text-sm text-black/70">
        {order.orderNumber ? (
          <p>
            <span className="font-medium text-foreground">Číslo objednávky:</span> {order.orderNumber}
          </p>
        ) : null}
        {order.variableSymbol ? (
          <p>
            <span className="font-medium text-foreground">Variabilní symbol:</span> {order.variableSymbol}
          </p>
        ) : null}
        <p>
          <span className="font-medium text-foreground">ID (technické):</span> {order.id}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="space-y-4">
          <article className="rounded-xl border border-black/10 p-5">
            <h2 className="text-xl font-semibold">Zákazník</h2>
            <p className="mt-2">{order.customerName}</p>
            <p>{order.customerEmail}</p>
            <p>{order.customerPhone}</p>
            <p className="mt-2 text-black/70">
              {order.street}, {order.city}, {order.postalCode}
            </p>
            <p className="mt-2 text-sm">
              Vytvořeno: {new Date(order.createdAt).toLocaleString("cs-CZ")}
            </p>
          </article>

          <article className="rounded-xl border border-black/10 p-5">
            <h2 className="text-xl font-semibold">Položky objednávky</h2>
            <p className="mt-2 text-xs text-black/55">
              U vybraných voleb konfigurátoru může být doplněn orientační příplatek (podle katalogu z databáze / výchozích dat;
              finální cena po zaměření může být jiná).
            </p>
            <div className="mt-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-lg border border-black/10 p-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-black/70">
                    {item.quantity}x {item.unitPrice.toLocaleString("cs-CZ")} Kč
                  </p>
                  <dl className="mt-3 grid gap-1 text-sm">
                    {configs
                      .filter((config) => config.orderItemId === item.id)
                      .map((config) => {
                        const deltaHint = hintFromProductMap(productsByName, item.name, config.key, config.value);
                        return (
                          <div key={`${item.id}-${config.key}`} className="grid grid-cols-2 gap-2">
                            <dt className="text-black/60">{config.key}</dt>
                            <dd>
                              <span className="text-foreground">{config.value}</span>
                              {deltaHint ? (
                                <span className="mt-0.5 block text-xs text-black/50">{deltaHint}</span>
                              ) : null}
                            </dd>
                          </div>
                        );
                      })}
                  </dl>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-black/10 p-5">
            <h2 className="text-xl font-semibold">Historie stavů</h2>
            {history.length === 0 ? (
              <p className="mt-3 text-sm text-black/60">Zatím bez změn stavu.</p>
            ) : (
              <ul className="mt-4 space-y-3 text-sm">
                {history.map((entry) => (
                  <li key={entry.id} className="rounded-lg border border-black/10 p-3">
                    <p className="font-medium">
                      {entry.fromStatus ?? "bez stavu"} → {entry.toStatus}
                    </p>
                    <p className="text-black/70">
                      {new Date(entry.changedAt).toLocaleString("cs-CZ")}
                    </p>
                    {(() => {
                      const actorLabel =
                        entry.changedByName &&
                        entry.changedByEmail &&
                        !entry.changedByEmail.startsWith("basic:")
                          ? `${entry.changedByName} (${entry.changedByEmail})`
                          : (entry.changedByName ?? entry.changedByEmail);
                      return actorLabel ? (
                        <p className="mt-1 text-xs text-black/60">
                          Provedl(a):{" "}
                          <span className="font-medium text-black/80">{actorLabel}</span>
                        </p>
                      ) : null;
                    })()}
                    {entry.note ? <p className="mt-1 text-black/80">{entry.note}</p> : null}
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>

        <aside className="space-y-4">
          <article className="rounded-xl border border-black/10 p-5">
            <h2 className="text-xl font-semibold">Souhrn</h2>
            <p className="mt-2 text-sm">Stav: {order.status}</p>
            <p className="text-2xl font-semibold">{order.totalPrice.toLocaleString("cs-CZ")} Kč</p>
          </article>

          <AdminOrderStatusForm
            orderId={order.id}
            currentStatus={order.status}
            statusOptions={statusOptions}
          />
        </aside>
      </div>
    </main>
  );
}
