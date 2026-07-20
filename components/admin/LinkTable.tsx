"use client";

import { useState } from "react";
import type { CreateLinkInput, PortalLink, ApiResult } from "@/lib/types";
import { LinkFormModal } from "@/components/admin/LinkFormModal";

type LinkTableProps = {
  initialLinks: PortalLink[];
};

export function LinkTable({ initialLinks }: LinkTableProps) {
  const [links, setLinks] = useState(initialLinks);
  const [message, setMessage] = useState("");
  const [editingLink, setEditingLink] = useState<PortalLink | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openCreateModal() {
    setEditingLink(null);
    setIsModalOpen(true);
  }

  function openEditModal(link: PortalLink) {
    setEditingLink(link);
    setIsModalOpen(true);
  }

  async function refreshLinks() {
    const response = await fetch("/api/links?all=1");
    const result = (await response.json()) as ApiResult<PortalLink[]>;
    if (result.success && result.data) {
      setLinks(result.data);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("ต้องการลบลิงก์นี้ใช่หรือไม่?")) {
      return;
    }

    const response = await fetch(`/api/links/${id}`, { method: "DELETE" });
    const result = (await response.json()) as ApiResult<PortalLink[]>;

    if (!response.ok || !result.success) {
      setMessage(result.error ?? "ลบลิงก์ไม่สำเร็จ");
      return;
    }

    setMessage("ลบลิงก์เรียบร้อยแล้ว");
    await refreshLinks();
  }

  async function handleSave(input: CreateLinkInput, id?: number) {
    const response = await fetch(id ? `/api/links/${id}` : "/api/links", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const result = (await response.json()) as ApiResult<PortalLink[]>;
    if (!response.ok || !result.success) {
      throw new Error(result.error ?? "บันทึกลิงก์ไม่สำเร็จ");
    }

    setMessage(id ? "อัปเดตลิงก์เรียบร้อยแล้ว" : "เพิ่มลิงก์ใหม่เรียบร้อยแล้ว");
    setIsModalOpen(false);
    setEditingLink(null);
    await refreshLinks();
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-[var(--shadow)]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            รายการลิงก์แอปพลิเคชัน
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            จัดการลิงก์ Portal ที่จะแสดงบนหน้าแรก
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          + เพิ่มลิงก์ใหม่
        </button>
      </div>

      {message ? (
        <p className="mb-4 text-sm font-medium text-emerald-700">{message}</p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-full text-left text-sm text-slate-800">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">ชื่อ</th>
              <th className="px-4 py-3 font-semibold">URL</th>
              <th className="px-4 py-3 font-semibold">ลำดับ</th>
              <th className="px-4 py-3 font-semibold">สถานะ</th>
              <th className="px-4 py-3 font-semibold">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="border-b border-slate-100 last:border-b-0">
                <td className="px-4 py-4 font-semibold text-slate-900">
                  {link.title}
                </td>
                <td className="px-4 py-4 text-slate-600">{link.url}</td>
                <td className="px-4 py-4 font-medium text-slate-800">
                  {link.sort_order}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      link.is_active
                        ? "bg-blue-50 text-blue-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {link.is_active ? "เปิดใช้งาน" : "ปิด"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(link)}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
                    >
                      แก้ไข
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(link.id)}
                      className="rounded-full border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LinkFormModal
        open={isModalOpen}
        link={editingLink}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLink(null);
        }}
        onSave={handleSave}
      />
    </section>
  );
}
