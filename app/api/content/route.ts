import { getSiteContent, updateSiteContent } from "@/lib/queries";
import { requireAdminAuth } from "@/lib/auth-server";
import { jsonError, jsonOk } from "@/lib/api-response";
import type { UpdateSiteContentInput } from "@/lib/types";

export async function GET() {
  try {
    const content = await getSiteContent();
    return jsonOk(content);
  } catch (error) {
    console.error("GET /api/content failed:", error);
    return jsonError("ไม่สามารถดึงข้อมูลเนื้อหาได้", 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdminAuth();
    const body = (await request.json()) as UpdateSiteContentInput;
    const content = await updateSiteContent(body);
    return jsonOk(content);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return jsonError("Unauthorized", 401);
    }

    console.error("PUT /api/content failed:", error);
    return jsonError("ไม่สามารถอัปเดตข้อมูลเนื้อหาได้", 500);
  }
}
