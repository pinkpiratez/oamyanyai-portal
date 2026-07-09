type SceneBackgroundProps = {
  accent?: string;
  gradientFrom?: string;
  gradientVia?: string;
};

export function SceneBackground({
  accent = "rgba(255, 255, 255, 0.09)",
  gradientFrom = "#14141a",
  gradientVia = "#09090d",
}: SceneBackgroundProps) {
  const glow = accent.replace(/,\s*0\.\d+\)/, ", 0.2)").replace("0.09", "0.12");
  const glowInner = accent.replace(/,\s*0\.\d+\)/, ", 0.18)").replace("0.09", "0.14");

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-b"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${gradientFrom}, ${gradientVia}, #030303)`,
        }}
      />
      <div
        className="absolute left-1/2 top-[36%] h-[min(85vw,640px)] w-[min(85vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 68%)` }}
      />
      <div
        className="absolute left-1/2 top-[40%] h-[min(42vw,280px)] w-[min(42vw,280px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px]"
        style={{ background: `radial-gradient(circle, ${glowInner} 0%, transparent 72%)` }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.04] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_24%,rgba(0,0,0,0.52)_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.04), transparent 28%), radial-gradient(circle at 82% 22%, rgba(255,255,255,0.03), transparent 24%)",
        }}
      />
    </div>
  );
}
