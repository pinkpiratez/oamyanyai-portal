"use client";

import type { PortalLink, SiteContent } from "@/lib/types";
import { TeslaNavbar } from "@/components/layout/TeslaNavbar";
import { SceneBackground } from "@/components/home/SceneBackground";
import { GlassLinkIcon } from "@/components/home/GlassLinkIcon";
import { PortalButton } from "@/components/home/PortalButton";
import { FadeInSection } from "@/components/home/FadeInSection";

type LandingExperienceProps = {
  content: SiteContent;
  links: PortalLink[];
};

const sectionThemes = [
  {
    accent: "rgba(255, 255, 255, 0.09)",
    iconAccent: "rgba(255, 255, 255, 0.14)",
    glow: "rgba(255, 255, 255, 0.12)",
    from: "#14141a",
    via: "#09090d",
  },
  {
    accent: "rgba(56, 189, 248, 0.2)",
    iconAccent: "rgba(56, 189, 248, 0.18)",
    glow: "rgba(56, 189, 248, 0.2)",
    from: "#10141c",
    via: "#080a10",
  },
  {
    accent: "rgba(52, 211, 153, 0.2)",
    iconAccent: "rgba(52, 211, 153, 0.18)",
    glow: "rgba(52, 211, 153, 0.2)",
    from: "#12101a",
    via: "#09080f",
  },
  {
    accent: "rgba(167, 139, 250, 0.2)",
    iconAccent: "rgba(167, 139, 250, 0.18)",
    glow: "rgba(167, 139, 250, 0.2)",
    from: "#0f1412",
    via: "#080c0a",
  },
];

function getTheme(index: number) {
  return sectionThemes[index % sectionThemes.length];
}

export function LandingExperience({ content, links }: LandingExperienceProps) {
  return (
    <div className="tesla-page bg-black text-white">
      <TeslaNavbar />

      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <SceneBackground />
        <FadeInSection className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6 text-center">
          <p className="mb-6 inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.35em] text-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            Digital Portal
          </p>
          <h1 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-white drop-shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            {content.hero_title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[clamp(1rem,2.5vw,1.35rem)] font-light leading-relaxed text-white/75">
            {content.hero_subtitle}
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-7 text-white/55">
            {content.hero_description}
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <PortalButton href="#services">เลือกระบบ</PortalButton>
            <PortalButton href="/admin" variant="secondary">
              จัดการเนื้อหา
            </PortalButton>
          </div>
        </FadeInSection>

        <a
          href="#services"
          className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/55 transition hover:text-white/85"
          aria-label="เลื่อนลง"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="block h-8 w-px animate-pulse bg-gradient-to-b from-white/70 to-transparent" />
        </a>
      </section>

      {links.length === 0 ? (
        <section
          id="services"
          className="relative flex min-h-screen snap-start items-center justify-center overflow-hidden"
        >
          <SceneBackground />
          <FadeInSection
            delay={80}
            className="relative z-10 mx-auto max-w-lg px-6 py-20 text-center"
          >
            <p className="text-base font-light text-white/65">
              ยังไม่มีลิงก์ที่เปิดใช้งาน กรุณาเพิ่มรายการจากหน้า Admin
            </p>
          </FadeInSection>
        </section>
      ) : (
        links.map((link, index) => {
          const theme = getTheme(index);
          const sectionId = index === 0 ? "services" : undefined;

          return (
            <section
              key={link.id}
              id={sectionId}
              className="relative flex min-h-screen snap-start items-center justify-center overflow-hidden"
            >
              <SceneBackground
                accent={theme.accent}
                gradientFrom={theme.from}
                gradientVia={theme.via}
              />
              <FadeInSection
                delay={80}
                className="relative z-10 mx-auto flex w-full max-w-[900px] flex-col items-center justify-center px-6 py-20 text-center"
              >
                <div className="relative mb-8 flex justify-center">
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                    style={{ background: theme.glow }}
                    aria-hidden="true"
                  />
                  <GlassLinkIcon
                    name={link.icon}
                    accent={theme.iconAccent}
                  />
                </div>

                <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.45em] text-white/55">
                  {String(index + 1).padStart(2, "0")} · System
                </p>
                <h2 className="font-display text-[clamp(2.2rem,6vw,4.2rem)] font-semibold tracking-[-0.02em] text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
                  {link.title}
                </h2>
                {link.description ? (
                  <p className="mx-auto mt-5 max-w-lg text-base font-light leading-relaxed text-white/65">
                    {link.description}
                  </p>
                ) : null}
                <div className="mt-10">
                  <PortalButton href={link.url} external>
                    เปิดระบบ
                  </PortalButton>
                </div>
              </FadeInSection>
            </section>
          );
        })
      )}

      <footer className="border-t border-white/10 bg-black px-6 py-10 text-center">
        <p className="text-[12px] font-light tracking-wide text-white/35">
          © {new Date().getFullYear()} Oamyanyai Portal
        </p>
        <p className="mt-1 text-[11px] text-white/20">Powered by Cloudflare D1</p>
      </footer>
    </div>
  );
}
