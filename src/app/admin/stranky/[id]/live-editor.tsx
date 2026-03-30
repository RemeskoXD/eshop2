"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Page, PageBlock } from "@/lib/pages";
import { BlockRenderer } from "@/components/page-builder/block-renderer";

export default function LiveEditor({ initialPage }: { initialPage: Page }) {
  const router = useRouter();
  const [page, setPage] = useState<Page>(initialPage);
  const [saving, setSaving] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const addBlock = (type: PageBlock["type"]) => {
    const newBlock: PageBlock = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      content: type === "hero" 
        ? { title: "Nový Hero Nadpis", subtitle: "Podnadpis", buttonText: "Klikni zde" }
        : type === "text"
        ? { text: "Zde je váš textový blok." }
        : { src: "https://picsum.photos/seed/qapi/800/400", alt: "Obrázek" }
    };
    setPage(p => ({ ...p, content: [...p.content, newBlock] }));
    setActiveBlockId(newBlock.id);
  };

  const updateBlock = (id: string, newContent: any) => {
    setPage(p => ({
      ...p,
      content: p.content.map(b => b.id === id ? { ...b, content: newContent } : b)
    }));
  };

  const removeBlock = (id: string) => {
    setPage(p => ({ ...p, content: p.content.filter(b => b.id !== id) }));
    if (activeBlockId === id) setActiveBlockId(null);
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const newContent = [...page.content];
    if (index + direction < 0 || index + direction >= newContent.length) return;
    const temp = newContent[index];
    newContent[index] = newContent[index + direction];
    newContent[index + direction] = temp;
    setPage(p => ({ ...p, content: newContent }));
  };

  const savePage = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });
      if (!res.ok) throw new Error("Chyba při ukládání");
      router.refresh();
    } catch (e) {
      alert("Nepodařilo se uložit stránku.");
    } finally {
      setSaving(false);
    }
  };

  const activeBlock = page.content.find(b => b.id === activeBlockId);

  return (
    <div className="flex h-full w-full overflow-hidden bg-gray-100">
      {/* Editor Sidebar */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-black/10 flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-black/10 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="font-bold text-lg">Live Editor</h2>
          <button 
            onClick={savePage} 
            disabled={saving}
            className="bg-primary text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "Ukládám..." : "Uložit"}
          </button>
        </div>

        <div className="p-4 border-b border-black/10">
          <label className="block text-xs font-semibold text-black/60 uppercase tracking-wider mb-2">Nastavení stránky</label>
          <input 
            type="text" 
            value={page.title} 
            onChange={e => setPage(p => ({ ...p, title: e.target.value }))}
            className="w-full mb-2 rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30"
            placeholder="Název stránky"
          />
          <input 
            type="text" 
            value={page.slug} 
            onChange={e => setPage(p => ({ ...p, slug: e.target.value }))}
            className="w-full mb-2 rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30"
            placeholder="URL slug"
          />
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={page.isDraft} 
              onChange={e => setPage(p => ({ ...p, isDraft: e.target.checked }))}
            />
            Uložit jako koncept
          </label>
        </div>

        <div className="p-4 border-b border-black/10">
          <label className="block text-xs font-semibold text-black/60 uppercase tracking-wider mb-2">Přidat blok</label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => addBlock("hero")} className="border border-black/10 rounded-md py-2 text-sm font-medium hover:bg-black/5">Hero</button>
            <button onClick={() => addBlock("text")} className="border border-black/10 rounded-md py-2 text-sm font-medium hover:bg-black/5">Text</button>
            <button onClick={() => addBlock("image")} className="border border-black/10 rounded-md py-2 text-sm font-medium hover:bg-black/5">Obrázek</button>
          </div>
        </div>

        <div className="p-4 flex-1">
          <label className="block text-xs font-semibold text-black/60 uppercase tracking-wider mb-2">Struktura (Bloky)</label>
          {page.content.length === 0 && <p className="text-sm text-black/50">Zatím žádné bloky.</p>}
          <div className="space-y-2">
            {page.content.map((block, i) => (
              <div 
                key={block.id} 
                className={`p-3 rounded-md border text-sm cursor-pointer transition-colors ${activeBlockId === block.id ? 'border-primary bg-primary/5' : 'border-black/10 hover:border-black/30'}`}
                onClick={() => setActiveBlockId(block.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium capitalize">{block.type}</span>
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); moveBlock(i, -1); }} className="p-1 hover:bg-black/10 rounded">↑</button>
                    <button onClick={(e) => { e.stopPropagation(); moveBlock(i, 1); }} className="p-1 hover:bg-black/10 rounded">↓</button>
                    <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="p-1 text-red-600 hover:bg-red-50 rounded">✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Block Settings */}
        {activeBlock && (
          <div className="p-4 border-t border-black/10 bg-black/5">
            <label className="block text-xs font-semibold text-black/60 uppercase tracking-wider mb-3">Úprava bloku: {activeBlock.type}</label>
            
            {activeBlock.type === "hero" && (
              <div className="space-y-3">
                <input type="text" value={activeBlock.content.title} onChange={e => updateBlock(activeBlock.id, { ...activeBlock.content, title: e.target.value })} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none" placeholder="Nadpis" />
                <input type="text" value={activeBlock.content.subtitle} onChange={e => updateBlock(activeBlock.id, { ...activeBlock.content, subtitle: e.target.value })} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none" placeholder="Podnadpis" />
                <input type="text" value={activeBlock.content.buttonText} onChange={e => updateBlock(activeBlock.id, { ...activeBlock.content, buttonText: e.target.value })} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none" placeholder="Text tlačítka" />
              </div>
            )}

            {activeBlock.type === "text" && (
              <textarea 
                value={activeBlock.content.text} 
                onChange={e => updateBlock(activeBlock.id, { ...activeBlock.content, text: e.target.value })} 
                className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none min-h-[150px]" 
                placeholder="Váš text..." 
              />
            )}

            {activeBlock.type === "image" && (
              <div className="space-y-3">
                <input type="text" value={activeBlock.content.src} onChange={e => updateBlock(activeBlock.id, { ...activeBlock.content, src: e.target.value })} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none" placeholder="URL obrázku" />
                <input type="text" value={activeBlock.content.alt} onChange={e => updateBlock(activeBlock.id, { ...activeBlock.content, alt: e.target.value })} className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none" placeholder="Alternativní text" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Preview Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
        <div className="w-full max-w-5xl bg-white shadow-xl rounded-lg overflow-hidden min-h-[800px] flex flex-col">
          {/* Fake Browser Chrome */}
          <div className="h-10 bg-black/5 border-b border-black/10 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="ml-4 bg-white px-3 py-1 rounded text-xs text-black/50 flex-1 max-w-sm border border-black/5">
              qapi.cz/{page.slug}
            </div>
          </div>
          
          {/* Render Page Content */}
          <div className="flex-1">
            {page.content.length === 0 ? (
              <div className="h-full flex items-center justify-center text-black/30 text-lg font-medium">
                Prázdná stránka. Přidejte bloky vlevo.
              </div>
            ) : (
              <BlockRenderer blocks={page.content} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
