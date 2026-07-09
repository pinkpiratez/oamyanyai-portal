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
    <section className="rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow)]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            รายการลิงก์แอปพลิเคชัน
          </h2>
          <p className="mt-2 text-sm text-muted">
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
        <p className="mb-4 text-sm font-medium text-accent-strong">{message}</p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-3 py-3 font-medium">ชื่อ</th>
              <th className="px-3 py-3 font-medium">URL</th>
              <th className="px-3 py-3 font-medium">ลำดับ</th>
              <th className="px-3 py-3 font-medium">สถานะ</th>
              <th className="px-3 py-3 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="border-b border-border/70">
                <td className="px-3 py-4 font-medium text-foreground">
                  {link.title}
                </td>
                <td className="px-3 py-4 text-muted">{link.url}</td>
                <td className="px-3 py-4">{link.sort_order}</td>
                <td className="px-3 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      link.is_active
                        ? "bg-accent-soft text-accent-strong"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {link.is_active ? "เปิดใช้งาน" : "ปิด"}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(link)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition hover:border-accent hover:text-accent"
                    >
                      แก้ไข
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(link.id)}
                      className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
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
