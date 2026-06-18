import { getDbAsync } from "@/lib/db";
import type {
  CreateLinkInput,
  PortalLink,
  PortalLinkRow,
  SiteContent,
  SiteContentRow,
  UpdateLinkInput,
  UpdateSiteContentInput,
} from "@/lib/types";

const DEFAULT_SITE_CONTENT: SiteContent = {
  hero_title: "Oamyanyai Portal",
  hero_subtitle: "ศูนย์กลางบริการดิจิทัลสำหรับธุรกิจของคุณ",
  hero_description:
    "เข้าถึงระบบงานทั้งหมดได้จากจุดเดียว ปลอดภัย รวดเร็ว และพร้อมใช้งาน",
};

function mapLinkRow(row: PortalLinkRow): PortalLink {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    icon: row.icon,
    sort_order: row.sort_order,
    is_active: row.is_active === 1,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function rowsToSiteContent(rows: SiteContentRow[]): SiteContent {
  const map = new Map(rows.map((row) => [row.key, row.value]));
  return {
    hero_title: map.get("hero_title") ?? DEFAULT_SITE_CONTENT.hero_title,
    hero_subtitle:
      map.get("hero_subtitle") ?? DEFAULT_SITE_CONTENT.hero_subtitle,
    hero_description:
      map.get("hero_description") ?? DEFAULT_SITE_CONTENT.hero_description,
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  const db = await getDbAsync();
  const result = await db
    .prepare("SELECT key, value, updated_at FROM site_content")
    .all<SiteContentRow>();

  return rowsToSiteContent(result.results ?? []);
}

export async function updateSiteContent(
  input: UpdateSiteContentInput,
): Promise<SiteContent> {
  const db = await getDbAsync();
  const entries = Object.entries(input).filter(
    ([, value]) => typeof value === "string",
  ) as [keyof SiteContent, string][];

  for (const [key, value] of entries) {
    await db
      .prepare(
        `INSERT INTO site_content (key, value, updated_at)
         VALUES (?, ?, datetime('now'))
         ON CONFLICT(key) DO UPDATE SET
           value = excluded.value,
           updated_at = datetime('now')`,
      )
      .bind(key, value)
      .run();
  }

  return getSiteContent();
}

export async function getActiveLinks(): Promise<PortalLink[]> {
  const db = await getDbAsync();
  const result = await db
    .prepare(
      `SELECT id, title, description, url, icon, sort_order, is_active, created_at, updated_at
       FROM portal_links
       WHERE is_active = 1
       ORDER BY sort_order ASC, id ASC`,
    )
    .all<PortalLinkRow>();

  return (result.results ?? []).map(mapLinkRow);
}

export async function getAllLinks(): Promise<PortalLink[]> {
  const db = await getDbAsync();
  const result = await db
    .prepare(
      `SELECT id, title, description, url, icon, sort_order, is_active, created_at, updated_at
       FROM portal_links
       ORDER BY sort_order ASC, id ASC`,
    )
    .all<PortalLinkRow>();

  return (result.results ?? []).map(mapLinkRow);
}

export async function getLinkById(id: number): Promise<PortalLink | null> {
  const db = await getDbAsync();
  const row = await db
    .prepare(
      `SELECT id, title, description, url, icon, sort_order, is_active, created_at, updated_at
       FROM portal_links WHERE id = ?`,
    )
    .bind(id)
    .first<PortalLinkRow>();

  return row ? mapLinkRow(row) : null;
}

export async function createLink(input: CreateLinkInput): Promise<PortalLink> {
  const db = await getDbAsync();
  const result = await db
    .prepare(
      `INSERT INTO portal_links (title, description, url, icon, sort_order, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    )
    .bind(
      input.title,
      input.description ?? null,
      input.url,
      input.icon ?? "link",
      input.sort_order ?? 0,
      input.is_active === false ? 0 : 1,
    )
    .run();

  const created = await getLinkById(Number(result.meta.last_row_id));
  if (!created) {
    throw new Error("Failed to create link");
  }

  return created;
}

export async function updateLink(
  id: number,
  input: UpdateLinkInput,
): Promise<PortalLink | null> {
  const existing = await getLinkById(id);
  if (!existing) {
    return null;
  }

  const db = await getDbAsync();
  await db
    .prepare(
      `UPDATE portal_links
       SET title = ?, description = ?, url = ?, icon = ?, sort_order = ?, is_active = ?, updated_at = datetime('now')
       WHERE id = ?`,
    )
    .bind(
      input.title ?? existing.title,
      input.description !== undefined
        ? input.description
        : existing.description,
      input.url ?? existing.url,
      input.icon ?? existing.icon,
      input.sort_order ?? existing.sort_order,
      (input.is_active ?? existing.is_active) ? 1 : 0,
      id,
    )
    .run();

  return getLinkById(id);
}

export async function deleteLink(id: number): Promise<boolean> {
  const db = await getDbAsync();
  const result = await db
    .prepare("DELETE FROM portal_links WHERE id = ?")
    .bind(id)
    .run();

  return result.meta.changes > 0;
}
