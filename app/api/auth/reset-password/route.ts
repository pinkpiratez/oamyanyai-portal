import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  SESSION_COOKIE_NAME,
  setStoredAdminPassword,
  verifyPasswordResetAuthority,
} from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-response";

const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const body = (await request.json()) as {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };

  const currentPassword = body.currentPassword?.trim() ?? "";
  const newPassword = body.newPassword?.trim() ?? "";
  const confirmPassword = body.confirmPassword?.trim() ?? "";

  if (!currentPassword || !newPassword || !confirmPassword) {
    return jsonError("กรุณากรอกข้อมูลให้ครบ");
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return jsonError(`รหัสผ่านใหม่ต้องมีอย่างน้อย ${MIN_PASSWORD_LENGTH} ตัวอักษร`);
  }

  if (newPassword !== confirmPassword) {
    return jsonError("รหัสผ่านใหม่และการยืนยันไม่ตรงกัน");
  }

  const authorized = await verifyPasswordResetAuthority(currentPassword, env);
  if (!authorized) {
    return jsonError("รหัสผ่านปัจจุบันหรือรหัสกู้คืนไม่ถูกต้อง", 401);
  }

  await setStoredAdminPassword(newPassword);

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  return jsonOk({ reset: true });
}
