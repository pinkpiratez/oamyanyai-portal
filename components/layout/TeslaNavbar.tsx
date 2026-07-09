import Link from "next/link";

export function TeslaNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/60 to-transparent transition-all duration-500">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
        <Link
          href="/"
          className="text-[13px] font-semibold uppercase tracking-[0.28em] text-white transition hover:text-white/70"
        >
          Oamyanyai
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#services"
            className="text-[13px] font-medium text-white/85 transition hover:text-white"
          >
            บริการ
          </Link>
          <Link
            href="/admin"
            className="rounded-md border border-white/50 bg-white/10 px-4 py-1.5 text-[12px] font-semibold text-white transition hover:bg-white/20"
          >
            Admin
          </Link>
        </nav>

        <Link
          href="/admin"
          className="rounded-md border border-white/50 bg-white/10 px-4 py-1.5 text-[12px] font-semibold text-white transition hover:bg-white/20 md:hidden"
        >
          Admin
        </Link>

        <div className="hidden w-[88px] md:block" aria-hidden="true" />
      </div>
    </header>
  );
}
