import { getPages, createPage, deletePage } from "@/lib/pages";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminPagesList() {
  const pages = await getPages();

  async function handleCreate(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "Nová stránka");
    const slug = String(formData.get("slug") || "nova-stranka-" + Math.floor(Math.random() * 1000));
    await createPage({ title, slug });
    revalidatePath("/admin/stranky");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    await deletePage(id);
    revalidatePath("/admin/stranky");
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Stránky (Live Editor)</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-black/10 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">Vytvořit novou stránku</h2>
        <form action={handleCreate} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-black/70 mb-1">Název stránky</label>
            <input type="text" name="title" required placeholder="Např. O nás" className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-black/70 mb-1">URL adresa (slug)</label>
            <input type="text" name="slug" required placeholder="Např. o-nas" className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30" />
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition">
            Vytvořit
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-black/10 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/5 border-b border-black/10">
            <tr>
              <th className="px-6 py-3 font-semibold text-black/70">Název</th>
              <th className="px-6 py-3 font-semibold text-black/70">URL</th>
              <th className="px-6 py-3 font-semibold text-black/70">Stav</th>
              <th className="px-6 py-3 font-semibold text-black/70 text-right">Akce</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {pages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-black/50">Zatím nemáte žádné stránky.</td>
              </tr>
            ) : (
              pages.map(page => (
                <tr key={page.id} className="hover:bg-black/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{page.title}</td>
                  <td className="px-6 py-4 text-black/60">/{page.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${page.isDraft ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                      {page.isDraft ? 'Koncept' : 'Publikováno'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link href={`/admin/stranky/${page.id}`} className="text-primary font-medium hover:underline">
                      Upravit (Live Editor)
                    </Link>
                    <form action={handleDelete} className="inline-block">
                      <input type="hidden" name="id" value={page.id} />
                      <button type="submit" className="text-red-600 font-medium hover:underline" onClick={(e) => { if(!confirm('Opravdu smazat?')) e.preventDefault(); }}>
                        Smazat
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
