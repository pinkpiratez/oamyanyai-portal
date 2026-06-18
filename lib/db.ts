import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getDbAsync() {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}
