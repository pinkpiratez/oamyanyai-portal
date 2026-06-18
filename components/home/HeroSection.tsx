import type { SiteContent } from "@/lib/types";

type HeroSectionProps = {
  content: SiteContent;
};

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-64 max-w-5xl rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft/70 px-4 py-2 text-sm font-medium text-accent-strong">
          <span className="h-2 w-2 rounded-full bg-accent" />
          ศูนย์กลางระบบงานดิจิทัล
        </div>

        <h1 className="animate-fade-up animate-delay-1 font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          {content.hero_title}
        </h1>

        <p className="animate-fade-up animate-delay-2 mt-5 text-lg font-medium text-slate-700 sm:text-2xl">
          {content.hero_subtitle}
        </p>

        <p className="animate-fade-up animate-delay-3 mx-auto mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          {content.hero_description}
        </p>
      </div>
    </section>
  );
}
