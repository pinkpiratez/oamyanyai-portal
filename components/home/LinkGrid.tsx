import type { PortalLink } from "@/lib/types";
import { LinkCard } from "@/components/home/LinkCard";

type LinkGridProps = {
  links: PortalLink[];
};

export function LinkGrid({ links }: LinkGridProps) {
  return (
    <section id="services" className="px-4 pb-20 pt-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Portal Links
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              เลือกระบบที่ต้องการใช้งาน
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted">
            รายการลิงก์ทั้งหมดถูกดึงจาก Cloudflare D1 แบบ Dynamic
            คุณสามารถเพิ่มหรือแก้ไขได้จากหน้า Admin ทันที
          </p>
        </div>

        {links.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-white/70 p-10 text-center text-muted">
            ยังไม่มีลิงก์ที่เปิดใช้งาน กรุณาเพิ่มรายการจากหน้า Admin
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {links.map((link, index) => (
              <LinkCard key={link.id} link={link} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
