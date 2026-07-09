"use client";

import { useState } from "react";
import type { SiteContent, ApiResult } from "@/lib/types";

type ContentEditorProps = {
  initialContent: SiteContent;
};

export function ContentEditor({ initialContent }: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const response = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });

    const result = (await response.json()) as ApiResult<SiteContent>;
    setIsSaving(false);

    if (!response.ok || !result.success) {
      setMessage(result.error ?? "บันทึกไม่สำเร็จ");
      return;
    }

    setContent(result.data ?? content);
    setMessage("บันทึกเนื้อหาหน้าแรกเรียบร้อยแล้ว");
  }

  return (
    <section className="rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow)]">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          ข้อความ Hero Section
        </h2>
        <p className="mt-2 text-sm text-muted">
          แก้ไขหัวข้อและคำอธิบายบนหน้าแรก ระบบจะอัปเดตทันทีหลังบันทึก
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">
            ชื่อหัวข้อหลัก
          </span>
          <input
            value={content.hero_title}
            onChange={(event) =>
              setContent((current) => ({
                ...current,
                hero_title: event.target.value,
              }))
            }
            className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-accent"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">
            คำบรรยายรอง
          </span>
          <input
            value={content.hero_subtitle}
            onChange={(event) =>
              setContent((current) => ({
                ...current,
                hero_subtitle: event.target.value,
              }))
            }
            className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-accent"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">
            คำอธิบายเพิ่มเติม
          </span>
          <textarea
            value={content.hero_description}
            onChange={(event) =>
              setContent((current) => ({
                ...current,
                hero_description: event.target.value,
              }))
            }
            rows={4}
            className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-accent"
            required
          />
        </label>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:opacity-60"
          >
            {isSaving ? "กำลังบันทึก..." : "บันทึกเนื้อหา"}
          </button>
          {message ? (
            <p className="text-sm font-medium text-accent-strong">{message}</p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
