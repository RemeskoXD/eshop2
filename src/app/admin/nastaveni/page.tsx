import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  async function saveSettings(formData: FormData) {
    "use server";
    const primaryColor = String(formData.get("primaryColor") || "#5D5754");
    const accentColor = String(formData.get("accentColor") || "#D9C5B2");
    const backgroundColor = String(formData.get("backgroundColor") || "#F9F8F6");
    const textColor = String(formData.get("textColor") || "#333333");

    await updateSiteSettings({ primaryColor, accentColor, backgroundColor, textColor });
    revalidatePath("/", "layout");
    redirect("/admin/nastaveni?success=1");
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Vzhled a barvy</h1>
      
      <form action={saveSettings} className="bg-white p-6 rounded-xl border border-black/10 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-black/70 mb-2">Hlavní barva (Primary)</label>
            <div className="flex gap-3">
              <input type="color" name="primaryColor" defaultValue={settings.primaryColor} className="h-10 w-10 rounded cursor-pointer" />
              <input type="text" name="primaryColor" defaultValue={settings.primaryColor} className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black/70 mb-2">Akcentní barva (Accent)</label>
            <div className="flex gap-3">
              <input type="color" name="accentColor" defaultValue={settings.accentColor} className="h-10 w-10 rounded cursor-pointer" />
              <input type="text" name="accentColor" defaultValue={settings.accentColor} className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-2">Barva pozadí (Background)</label>
            <div className="flex gap-3">
              <input type="color" name="backgroundColor" defaultValue={settings.backgroundColor} className="h-10 w-10 rounded cursor-pointer" />
              <input type="text" name="backgroundColor" defaultValue={settings.backgroundColor} className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-2">Barva textu (Text)</label>
            <div className="flex gap-3">
              <input type="color" name="textColor" defaultValue={settings.textColor} className="h-10 w-10 rounded cursor-pointer" />
              <input type="text" name="textColor" defaultValue={settings.textColor} className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-black/10 flex justify-end">
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition">
            Uložit nastavení
          </button>
        </div>
      </form>
    </div>
  );
}
