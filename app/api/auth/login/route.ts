import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  createSessionToken,
  getAdminPasswordFromEnv,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function POST(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const adminPassword = getAdminPasswordFromEnv(env);

  if (!adminPassword) {
    return jsonError("Admin password is not configured", 500);
  }

  const body = (await request.json()) as { password?: string };
  const submittedPassword = body.password?.trim() ?? "";

  if (!submittedPassword || submittedPassword !== adminPassword.trim()) {
    return jsonError("รหัสผ่านไม่ถูกต้อง", 401);
  }

  const token = await createSessionToken(adminPassword);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

  return jsonOk({ authenticated: true });
}
