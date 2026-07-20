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

const fieldClassName =
  "w-full rounded-xl border-2 border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/15";

const labelClassName = "mb-2 block text-sm font-semibold text-slate-800";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <h3 className="font-display text-2xl font-bold text-slate-900">
            {link ? "แก้ไขลิงก์" : "เพิ่มลิงก์ใหม่"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            ปิด
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className={labelClassName}>ชื่อระบบ</span>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="เช่น ระบบใบเสนอราคา"
              className={fieldClassName}
              required
            />
          </label>

          <label className="block">
            <span className={labelClassName}>คำอธิบาย</span>
            <textarea
              value={form.description ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="สรุปสั้น ๆ ว่าลิงก์นี้ใช้ทำอะไร"
              rows={3}
              className={`${fieldClassName} resize-y`}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>URL</span>
            <input
              type="url"
              value={form.url}
              onChange={(event) =>
                setForm((current) => ({ ...current, url: event.target.value }))
              }
              placeholder="https://example.oamyanyai.com"
              className={fieldClassName}
              required
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className={labelClassName}>ไอคอน</span>
              <select
                value={form.icon}
                onChange={(event) =>
                  setForm((current) => ({ ...current, icon: event.target.value }))
                }
                className={fieldClassName}
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClassName}>ลำดับการแสดง</span>
              <input
                type="number"
                value={form.sort_order ?? 0}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sort_order: Number(event.target.value),
                  }))
                }
                placeholder="0"
                className={fieldClassName}
              />
            </label>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={form.is_active ?? true}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  is_active: event.target.checked,
                }))
              }
              className="h-5 w-5 rounded border-slate-400 text-blue-600 accent-blue-600 focus:ring-blue-600"
            />
            แสดงบนหน้าแรก
          </label>

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border-2 border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {isSaving ? "กำลังบันทึก..." : "บันทึกลิงก์"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
