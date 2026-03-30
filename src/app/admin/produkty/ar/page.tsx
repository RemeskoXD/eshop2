import Link from "next/link";
import AdminArBulkTools from "@/components/admin-ar-bulk-tools";
import AdminProductArForm from "@/components/admin-product-ar-form";
import { serverAdminCan } from "@/lib/admin-auth-server";
import { getAdminArCategoryProgress, getAdminProductsAr } from "@/lib/admin-orders";

type AdminProductsArPageProps = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function AdminProductsArPage({ searchParams }: AdminProductsArPageProps) {
  const { filter } = await searchParams;
  const mode: "all" | "missing" = filter === "missing" ? "missing" : "all";

  const products = await getAdminProductsAr(mode);
  const categoryProgress = await getAdminArCategoryProgress();
  const readyCount = products.filter((p) => p.arReady).length;
  const canArWrite = await serverAdminCan("product_ar_write");
  const canArExport = await serverAdminCan("product_ar_export");

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Administrace – AR modely produktů</h1>
          <p className="mt-2 text-sm text-black/70">
            Nastavení GLB/USDZ modelů pro 3D a AR zobrazení na produktech.
          </p>
          <p className="mt-1 text-xs text-black/60">
            Režim: {mode === "missing" ? "Jen chybějící modely" : "Všechny produkty"} | Připraveno v aktuálním výpisu: {readyCount}/{products.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href={mode === "missing" ? "/admin/produkty/ar" : "/admin/produkty/ar?filter=missing"} className="text-sm font-semibold text-primary hover:underline">
            {mode === "missing" ? "Zobrazit vše" : "Jen chybějící modely"}
          </Link>
          <Link href="/admin/objednavky" className="text-sm font-semibold text-primary hover:underline">
            Zpět na objednávky
          </Link>
        </div>
      </div>
      <section className="mt-6 rounded-xl border border-black/10 p-4">
        <h2 className="text-lg font-semibold">Připravenost AR podle kategorií</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {categoryProgress.map((item) => (
            <article key={item.categoryTitle} className="rounded-lg border border-black/10 bg-muted p-3">
              <p className="text-sm font-semibold">{item.categoryTitle}</p>
              <p className="mt-1 text-xs text-black/70">
                {item.readyProducts}/{item.totalProducts} ({item.readyRate}%)
              </p>
              <div className="mt-2 h-2 rounded bg-white">
                <div
                  className="h-2 rounded bg-primary"
                  style={{ width: `${item.readyRate}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
      <AdminArBulkTools allowExport={canArExport} allowImport={canArWrite} />

      {products.length === 0 ? (
        <p className="mt-6 text-sm text-black/60">Zatím nejsou dostupné žádné produkty.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {products.map((product) => (
            <AdminProductArForm
              key={product.id}
              productId={product.id}
              productName={product.name}
              productSlug={product.slug}
              categoryTitle={product.categoryTitle}
              initialGlbUrl={product.arModelGlbUrl}
              initialUsdzUrl={product.arModelUsdzUrl}
              arReady={product.arReady}
              readOnly={!canArWrite}
            />
          ))}
        </div>
      )}
    </main>
  );
}
