import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { LinkGrid } from "@/components/home/LinkGrid";
import { getActiveLinks, getSiteContent } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [content, links] = await Promise.all([
    getSiteContent(),
    getActiveLinks(),
  ]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection content={content} />
      <LinkGrid links={links} />
      <footer className="border-t border-border/80 bg-white/70 px-4 py-8 text-center text-sm text-muted sm:px-6">
        © {new Date().getFullYear()} Oamyanyai Portal · Powered by Cloudflare D1
      </footer>
    </main>
  );
}
