-- ข้อความหน้าแรก (Hero, คำอธิบาย)
CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ลิงก์ Portal ไปยัง Subdomain อื่น
CREATE TABLE IF NOT EXISTS portal_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  icon TEXT DEFAULT 'link',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed ข้อมูลเริ่มต้น
INSERT OR IGNORE INTO site_content (key, value) VALUES
  ('hero_title', 'Oamyanyai Portal'),
  ('hero_subtitle', 'ศูนย์กลางบริการดิจิทัลสำหรับธุรกิจของคุณ'),
  ('hero_description', 'เข้าถึงระบบงานทั้งหมดได้จากจุดเดียว ปลอดภัย รวดเร็ว และพร้อมใช้งาน');

INSERT INTO portal_links (title, description, url, icon, sort_order)
SELECT 'ระบบใบเสนอราคา', 'จัดการและออกใบเสนอราคา', 'https://quotation.oamyanyai.com', 'file-text', 1
WHERE NOT EXISTS (SELECT 1 FROM portal_links LIMIT 1);

INSERT INTO portal_links (title, description, url, icon, sort_order)
SELECT 'ระบบสั่งอาหาร/บิล', 'สั่งอาหารและจัดการบิล', 'https://billfood.oamyanyai.com', 'utensils', 2
WHERE (SELECT COUNT(*) FROM portal_links) < 2;

INSERT INTO portal_links (title, description, url, icon, sort_order)
SELECT 'บล็อก/ทดสอบ', 'บทความและพื้นที่ทดสอบ', 'https://blog.oamyanyai.com', 'book-open', 3
WHERE (SELECT COUNT(*) FROM portal_links) < 3;
