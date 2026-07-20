import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  createSessionToken,
  getSessionCookieOptions,
  getSessionSecret,
  SESSION_COOKIE_NAME,
  verifyLoginPassword,
} from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function POST(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const sessionSecret = getSessionSecret(env);

  if (!sessionSecret) {
    return jsonError("Admin password is not configured", 500);
  }

  const body = (await request.json()) as { password?: string };
  const submittedPassword = body.password?.trim() ?? "";

  const valid = await verifyLoginPassword(submittedPassword, env);
  if (!valid) {
    return jsonError("รหัสผ่านไม่ถูกต้อง", 401);
  }

  const token = await createSessionToken(sessionSecret);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

  return jsonOk({ authenticated: true });
}
