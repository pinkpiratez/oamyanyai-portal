"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: password.trim() }),
    });

    const result = (await response.json()) as {
      success?: boolean;
      error?: string;
    };
    setIsSubmitting(false);

    if (!response.ok || !result.success) {
      setError(result.error ?? "เข้าสู่ระบบไม่สำเร็จ");
      return;
    }

    const nextPath = searchParams.get("next") || "/admin";
    router.push(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-800">
          รหัสผ่าน
        </span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          autoFocus
          placeholder="กรอกรหัสผ่านผู้ดูแล"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          required
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
      >
        {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      <p className="text-center text-sm text-slate-500">
        <Link
          href="/admin/reset-password"
          className="font-medium text-blue-600 transition hover:text-blue-700"
        >
          ลืมรหัสผ่าน / รีเซ็ตรหัสผ่าน
        </Link>
      </p>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 shadow-[0_25px_50px_-12px_rgb(15_23_42_/_0.45)]">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Admin Access
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-slate-900">
            เข้าสู่ระบบผู้ดูแล
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            กรอกรหัสผ่านเพื่อจัดการเนื้อหาและลิงก์บนหน้าแรก
          </p>
        </div>

        <Suspense
          fallback={<p className="text-sm text-slate-500">กำลังโหลด...</p>}
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
