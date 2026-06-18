import { AdminNav } from "@/components/admin/AdminNav";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { LinkTable } from "@/components/admin/LinkTable";
import { getAllLinks, getSiteContent } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [content, links] = await Promise.all([getSiteContent(), getAllLinks()]);

  return (
    <div className="min-h-screen">
      <AdminNav />
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
        <ContentEditor initialContent={content} />
        <LinkTable initialLinks={links} />
      </div>
    </div>
  );
}
