import { LandingExperience } from "@/components/home/LandingExperience";
import { getActiveLinks, getSiteContent } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [content, links] = await Promise.all([
    getSiteContent(),
    getActiveLinks(),
  ]);

  return (
    <main className="min-h-screen bg-black">
      <LandingExperience content={content} links={links} />
    </main>
  );
}
