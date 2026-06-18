# Oamyanyai Portal

Portal / Landing Page ที่สร้างด้วย Next.js (App Router) + Tailwind CSS และเชื่อมต่อ Cloudflare D1 ผ่าน `@opennextjs/cloudflare` พร้อมหน้า Admin สำหรับจัดการเนื้อหาและลิงก์แอปพลิเคชัน

## ฟีเจอร์หลัก

- หน้าแรกดึง Hero text และลิงก์ Portal จาก Cloudflare D1 แบบ Dynamic
- หน้า Admin (`/admin`) สำหรับ CRUD เนื้อหาและลิงก์
- API RESTful: `/api/content`, `/api/links`, `/api/auth/*`
- ป้องกัน Admin ด้วยรหัสผ่าน (`ADMIN_PASSWORD`)
- Deploy บน Cloudflare Workers ผ่าน OpenNext

## โครงสร้างโปรเจกต์

```
app/
  page.tsx                 # Landing Page
  admin/                   # Admin Dashboard + Login
  api/                     # API Routes
components/
  layout/                  # Navbar
  home/                    # Hero, Link Cards
  admin/                   # Admin UI
lib/
  db.ts                    # D1 binding helper
  queries.ts               # Database queries
  auth.ts                  # Session cookie
migrations/
  0001_init.sql            # D1 schema + seed data
wrangler.jsonc             # Cloudflare bindings
open-next.config.ts        # OpenNext config
```

## ความต้องการของระบบ

- Node.js 20+
- npm
- บัญชี Cloudflare (สำหรับ deploy production)

## เริ่มต้นใช้งาน (Local)

### 1. ติดตั้ง dependencies

```bash
cd D:\Cloudflare\Web
npm install
```

### 2. ตั้งค่ารหัสผ่าน Admin

สร้างไฟล์ `.env.local` จากตัวอย่าง:

```bash
copy .env.example .env.local
```

แก้ไข `ADMIN_PASSWORD` ใน `.env.local` และ `.dev.vars` ให้ตรงกัน

> `.dev.vars` ใช้กับ Wrangler/OpenNext bindings  
> `.env.local` ใช้กับ Next.js middleware ตอน `npm run dev`

### 3. รัน Database Migration (Local D1)

```bash
npm run db:migrate:local
```

### 4. รันโปรเจกต์

```bash
npm run dev
```

เปิดเบราว์เซอร์:

- หน้าแรก: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)
- Login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

รหัสผ่านเริ่มต้น (ถ้ายังไม่ได้เปลี่ยน): `changeme`

### 5. ทดสอบก่อน Deploy (แนะนำ)

```bash
npm run preview
```

คำสั่งนี้ build และรันใน Workers runtime จริงผ่าน Wrangler

## Deploy Production

### 1. สร้าง D1 Database บน Cloudflare

```bash
npx wrangler d1 create oamyanyai-portal-db
```

คัดลอก `database_id` ที่ได้ แล้วอัปเดตใน `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "oamyanyai-portal-db",
    "database_id": "<DATABASE_ID จาก Cloudflare>"
  }
]
```

### 2. รัน Migration บน Production

```bash
npm run db:migrate:remote
```

### 3. ตั้งค่า Secret

```bash
npx wrangler secret put ADMIN_PASSWORD
```

### 4. Deploy

```bash
npm run deploy
```

### 5. ผูก Custom Domain

Cloudflare Dashboard → Workers & Pages → เลือก worker `oamyanyai-portal` → Custom Domains

ตัวอย่าง:

- `oamyanyai.com`
- `portal.oamyanyai.com`

## API Endpoints

| Endpoint | Method | Auth | คำอธิบาย |
|----------|--------|------|----------|
| `/api/content` | GET | ไม่ต้อง | ดึงข้อความ Hero |
| `/api/content` | PUT | Admin | อัปเดตข้อความ Hero |
| `/api/links` | GET | ไม่ต้อง | ดึงลิงก์ (`?all=1` สำหรับ admin) |
| `/api/links` | POST | Admin | เพิ่มลิงก์ |
| `/api/links/[id]` | GET/PUT/DELETE | Admin (ยกเว้น GET public) | CRUD ลิงก์ |
| `/api/auth/login` | POST | ไม่ต้อง | Login |
| `/api/auth/logout` | POST | - | Logout |

## หมายเหตุสำคัญ

- โปรเจกต์นี้ใช้ **`@opennextjs/cloudflare`** (แนะนำโดย Cloudflare ปัจจุบัน) แทน `@cloudflare/next-on-pages` ที่ deprecate แล้ว
- **ไม่ต้องใส่** `export const runtime = 'edge'` — OpenNext ใช้ Node.js runtime บน Workers
- D1 binding เข้าถึงผ่าน `getCloudflareContext().env.DB` ใน [`lib/db.ts`](lib/db.ts)
- รัน `npm run cf-typegen` หลังแก้ `wrangler.jsonc` เพื่ออัปเดต TypeScript types

## Scripts ที่ใช้บ่อย

```bash
npm run dev              # พัฒนา local
npm run build            # build Next.js
npm run preview          # preview บน Workers runtime
npm run deploy           # deploy ขึ้น Cloudflare
npm run db:migrate:local # migrate D1 local
npm run db:migrate:remote# migrate D1 production
npm run cf-typegen       # generate Cloudflare env types
```
