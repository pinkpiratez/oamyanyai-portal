"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
        confirmPassword: confirmPassword.trim(),
      }),
    });

    const result = (await response.json()) as {
      success?: boolean;
      error?: string;
    };
    setIsSubmitting(false);

    if (!response.ok || !result.success) {
      setError(result.error ?? "รีเซ็ตรหัสผ่านไม่สำเร็จ");
      return;
    }

    setSuccess("เปลี่ยนรหัสผ่านสำเร็จแล้ว กรุณาเข้าสู่ระบบใหม่");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    window.setTimeout(() => {
      router.push("/admin/login");
      router.refresh();
    }, 1200);
  }

  const inputClassName =
    "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20";

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 shadow-[0_25px_50px_-12px_rgb(15_23_42_/_0.45)]">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Admin Access
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-slate-900">
            รีเซ็ตรหัสผ่าน
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            ใช้รหัสผ่านปัจจุบัน หรือรหัสกู้คืน (Cloudflare Secret) เพื่อตั้งรหัสใหม่
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-800">
              รหัสผ่านปัจจุบัน / รหัสกู้คืน
            </span>
            <input
              type="password"
              name="currentPassword"
              autoComplete="current-password"
              autoFocus
              placeholder="รหัสผ่านเดิมหรือรหัสกู้คืน"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className={inputClassName}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-800">
              รหัสผ่านใหม่
            </span>
            <input
              type="password"
              name="newPassword"
              autoComplete="new-password"
              placeholder="อย่างน้อย 8 ตัวอักษร"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className={inputClassName}
              minLength={8}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-800">
              ยืนยันรหัสผ่านใหม่
            </span>
            <input
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={inputClassName}
              minLength={8}
              required
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
          >
            {isSubmitting ? "กำลังบันทึก..." : "ตั้งรหัสผ่านใหม่"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link
            href="/admin/login"
            className="font-medium text-blue-600 transition hover:text-blue-700"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </main>
  );
}
