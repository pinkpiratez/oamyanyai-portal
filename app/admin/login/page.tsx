"use client";

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
        <span className="mb-2 block text-sm font-medium text-foreground">
          รหัสผ่าน
        </span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-accent"
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
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-[var(--shadow)]">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Admin Access
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-foreground">
            เข้าสู่ระบบผู้ดูแล
          </h1>
          <p className="mt-3 text-sm text-muted">
            กรอกรหัสผ่านเพื่อจัดการเนื้อหาและลิงก์บนหน้าแรก
          </p>
        </div>

        <Suspense fallback={<p className="text-sm text-muted">กำลังโหลด...</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
