import { getPageBySlug } from "@/lib/pages";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/page-builder/block-renderer";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  
  if (!page || page.isDraft) {
    return { title: "Stránka nenalezena" };
  }

  return {
    title: `${page.title} | QAPI`,
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page || page.isDraft) {
    notFound();
  }

  return (
    <main className="min-h-screen pb-24">
      <BlockRenderer blocks={page.content} />
    </main>
  );
}
