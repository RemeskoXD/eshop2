import { getPage } from "@/lib/pages";
import { notFound } from "next/navigation";
import LiveEditor from "./live-editor";

export default async function AdminPageEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getPage(id);

  if (!page) {
    notFound();
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden">
      <LiveEditor initialPage={page} />
    </div>
  );
}
