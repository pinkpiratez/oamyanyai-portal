"use client";

import { useEffect, useState } from "react";
import type { CreateLinkInput, PortalLink } from "@/lib/types";

const iconOptions = [
  { value: "link", label: "ลิงก์ทั่วไป" },
  { value: "file-text", label: "เอกสาร / ใบเสนอราคา" },
  { value: "utensils", label: "อาหาร / บิล" },
  { value: "book-open", label: "บล็อก / บทความ" },
];

type LinkFormModalProps = {
  open: boolean;
  link: PortalLink | null;
  onClose: () => void;
  onSave: (input: CreateLinkInput, id?: number) => Promise<void>;
};

const emptyForm: CreateLinkInput = {
  title: "",
  description: "",
  url: "",
  icon: "link",
  sort_order: 0,
  is_active: true,
};

export function LinkFormModal({
  open,
  link,
  onClose,
  onSave,
}: LinkFormModalProps) {
  const [form, setForm] = useState<CreateLinkInput>(emptyForm);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (link) {
      setForm({
        title: link.title,
        description: link.description ?? "",
        url: link.url,
        icon: link.icon,
        sort_order: link.sort_order,
        is_active: link.is_active,
      });
      return;
    }

    setForm(emptyForm);
  }, [link, open]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await onSave(form, link?.id);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "บันทึกลิงก์ไม่สำเร็จ",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold text-foreground">
            {link ? "แก้ไขลิงก์" : "เพิ่มลิงก์ใหม่"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm text-muted transition hover:bg-slate-100"
          >
            ปิด
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">ชื่อระบบ</span>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-accent"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">คำอธิบาย</span>
            <textarea
              value={form.description ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={3}
              className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">URL</span>
            <input
              type="url"
              value={form.url}
              onChange={(event) =>
                setForm((current) => ({ ...current, url: event.target.value }))
              }
              className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-accent"
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">ไอคอน</span>
              <select
                value={form.icon}
                onChange={(event) =>
                  setForm((current) => ({ ...current, icon: event.target.value }))
                }
                className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-accent"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">ลำดับการแสดง</span>
              <input
                type="number"
                value={form.sort_order ?? 0}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sort_order: Number(event.target.value),
                  }))
                }
                className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-accent"
              />
            </label>
          </div>

          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.is_active ?? true}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  is_active: event.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
            />
            แสดงบนหน้าแรก
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-muted"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:opacity-60"
            >
              {isSaving ? "กำลังบันทึก..." : "บันทึกลิงก์"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
