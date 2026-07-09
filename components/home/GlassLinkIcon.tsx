import type { ReactNode } from "react";

const iconMap: Record<string, ReactNode> = {
  link: (
    <path
      d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  ),
  "file-text": (
    <>
      <path
        d="M8 4h6l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M14 4v4h4M10 13h8M10 17h8M10 9h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </>
  ),
  utensils: (
    <path
      d="M6 4v8M8 4v5a2 2 0 0 1-4 0V4M10 12v8M14 4v16M18 4v6a2 2 0 0 1-4 0V4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  ),
  "book-open": (
    <path
      d="M4 7a3 3 0 0 1 3-3h4v16H7a3 3 0 0 1-3-3V7ZM16 4h4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-4V4Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  ),
};

type GlassLinkIconProps = {
  name: string;
  accent: string;
  size?: "sm" | "md" | "lg" | "xl";
};

export function GlassLinkIcon({
  name,
  accent,
  size = "xl",
}: GlassLinkIconProps) {
  const rgb = accent;

  return (
    <div
      className={`glass-link-icon glass-link-icon-${size}`}
      data-icon={name}
      aria-hidden="true"
    >
      <div
        className="glass-link-icon-plate"
        style={{
          background: `linear-gradient(145deg, ${rgb}, rgba(255,255,255,0.03))`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.24), 0 12px 32px rgba(0,0,0,0.28), 0 0 24px ${rgb}`,
        }}
      >
        <span className="glass-link-icon-shine" />
        <svg viewBox="0 0 24 24" fill="none" className="glass-link-icon-svg">
          {iconMap[name] ?? iconMap.link}
        </svg>
      </div>
    </div>
  );
}
