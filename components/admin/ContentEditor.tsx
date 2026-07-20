"use client";

import { useState } from "react";
import type { SiteContent, ApiResult } from "@/lib/types";

type ContentEditorProps = {
  initialContent: SiteContent;
};

const fieldClassName =
  "w-full rounded-xl border-2 border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/15";

const labelClassName = "mb-2 block text-sm font-semibold text-slate-800";

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
    <section className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-[var(--shadow)]">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          ข้อความ Hero Section
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          แก้ไขหัวข้อและคำอธิบายบนหน้าแรก ระบบจะอัปเดตทันทีหลังบันทึก
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className={labelClassName}>ชื่อหัวข้อหลัก</span>
          <input
            value={content.hero_title}
            onChange={(event) =>
              setContent((current) => ({
                ...current,
                hero_title: event.target.value,
              }))
            }
            className={fieldClassName}
            required
          />
        </label>

        <label className="block">
          <span className={labelClassName}>คำบรรยายรอง</span>
          <input
            value={content.hero_subtitle}
            onChange={(event) =>
              setContent((current) => ({
                ...current,
                hero_subtitle: event.target.value,
              }))
            }
            className={fieldClassName}
            required
          />
        </label>

        <label className="block">
          <span className={labelClassName}>คำอธิบายเพิ่มเติม</span>
          <textarea
            value={content.hero_description}
            onChange={(event) =>
              setContent((current) => ({
                ...current,
                hero_description: event.target.value,
              }))
            }
            rows={4}
            className={`${fieldClassName} resize-y`}
            required
          />
        </label>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {isSaving ? "กำลังบันทึก..." : "บันทึกเนื้อหา"}
          </button>
          {message ? (
            <p className="text-sm font-medium text-emerald-700">{message}</p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
