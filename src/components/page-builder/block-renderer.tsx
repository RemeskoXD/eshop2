import type { PageBlock } from "@/lib/pages";

export function BlockRenderer({ blocks }: { blocks: PageBlock[] }) {
  return (
    <div className="flex flex-col w-full">
      {blocks.map((block) => {
        switch (block.type) {
          case "hero":
            return (
              <div key={block.id} className="bg-primary text-white py-24 px-8 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading">{block.content.title}</h1>
                <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-8">{block.content.subtitle}</p>
                {block.content.buttonText && (
                  <button className="bg-accent text-primary px-8 py-3 rounded-full font-bold text-lg hover:bg-white transition-colors">
                    {block.content.buttonText}
                  </button>
                )}
              </div>
            );
          case "text":
            return (
              <div key={block.id} className="py-16 px-8 max-w-4xl mx-auto w-full">
                <div className="prose prose-lg max-w-none text-black/80" dangerouslySetInnerHTML={{ __html: block.content.text.replace(/\n/g, '<br/>') }} />
              </div>
            );
          case "image":
            return (
              <div key={block.id} className="py-12 px-8 max-w-5xl mx-auto w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={block.content.src} 
                  alt={block.content.alt || "Obrázek"} 
                  className="w-full h-auto rounded-2xl shadow-lg object-cover"
                />
              </div>
            );
          default:
            return <div key={block.id} className="p-4 bg-red-50 text-red-600">Neznámý blok: {block.type}</div>;
        }
      })}
    </div>
  );
}
