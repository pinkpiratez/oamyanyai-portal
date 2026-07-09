import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const displayFont = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Oamyanyai Portal",
  description:
    "ศูนย์กลางบริการดิจิทัลสำหรับธุรกิจของคุณ เชื่อมต่อไปยังระบบงานย่อยทั้งหมดจากจุดเดียว",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${bodyFont.variable} ${displayFont.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
