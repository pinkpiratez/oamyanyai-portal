import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-sm font-bold text-white shadow-lg shadow-accent/20 transition group-hover:scale-105">
            OA
          </span>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-foreground">
              Oamyanyai
            </p>
            <p className="text-sm text-muted">Digital Services Portal</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="#services"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-slate-100 hover:text-foreground sm:inline-flex"
          >
            บริการทั้งหมด
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-accent hover:text-accent"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
