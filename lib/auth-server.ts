import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cookies } from "next/headers";
import {
  isAuthenticatedRequest,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const { env } = await getCloudflareContext({ async: true });

  const authenticated = await isAuthenticatedRequest(token, env);
  if (!authenticated) {
    throw new Error("Unauthorized");
  }
}
