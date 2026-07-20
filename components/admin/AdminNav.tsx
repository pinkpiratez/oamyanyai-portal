"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminNav() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-slate-200 bg-white text-slate-900 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Admin Dashboard
          </p>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            จัดการเนื้อหาหน้าแรก
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <Link
            href="/"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            ดูหน้าเว็บ
          </Link>
          <Link
            href="/admin/reset-password"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            เปลี่ยนรหัสผ่าน
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </header>
  );
}
