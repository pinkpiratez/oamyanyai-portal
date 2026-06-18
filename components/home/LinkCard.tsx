import type { ReactNode } from "react";
import type { PortalLink } from "@/lib/types";

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
    <>
      <path
        d="M6 4v8M8 4v5a2 2 0 0 1-4 0V4M10 12v8M14 4v16M18 4v6a2 2 0 0 1-4 0V4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </>
  ),
  "book-open": (
    <>
      <path
        d="M4 7a3 3 0 0 1 3-3h4v16H7a3 3 0 0 1-3-3V7ZM16 4h4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-4V4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </>
  ),
};

function LinkIcon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      aria-hidden="true"
    >
      {iconMap[name] ?? iconMap.link}
    </svg>
  );
}

type LinkCardProps = {
  link: PortalLink;
  index: number;
};

export function LinkCard({ link, index }: LinkCardProps) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-full flex-col rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow)] transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/10"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong transition group-hover:bg-accent group-hover:text-white">
          <LinkIcon name={link.icon} />
        </span>
        <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted transition group-hover:border-accent/30 group-hover:text-accent">
          เปิดระบบ
        </span>
      </div>

      <div className="flex-1">
        <h3 className="font-display text-2xl font-semibold text-foreground">
          {link.title}
        </h3>
        {link.description ? (
          <p className="mt-3 text-sm leading-7 text-muted">{link.description}</p>
        ) : null}
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-accent">
        <span className="truncate">{link.url.replace(/^https?:\/\//, "")}</span>
        <span aria-hidden="true" className="transition group-hover:translate-x-1">
          →
        </span>
      </div>
    </a>
  );
}
