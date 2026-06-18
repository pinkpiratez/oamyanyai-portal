import { createLink, getActiveLinks, getAllLinks } from "@/lib/queries";
import { requireAdminAuth } from "@/lib/auth-server";
import { jsonError, jsonOk } from "@/lib/api-response";
import type { CreateLinkInput } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("all") === "1";

    const links = includeInactive ? await getAllLinks() : await getActiveLinks();
    return jsonOk(links);
  } catch (error) {
    console.error("GET /api/links failed:", error);
    return jsonError("ไม่สามารถดึงรายการลิงก์ได้", 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminAuth();
    const body = (await request.json()) as CreateLinkInput;

    if (!body.title?.trim() || !body.url?.trim()) {
      return jsonError("กรุณากรอกชื่อและ URL ของลิงก์");
    }

    const link = await createLink({
      ...body,
      title: body.title.trim(),
      url: body.url.trim(),
    });

    return jsonOk(link, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return jsonError("Unauthorized", 401);
    }

    console.error("POST /api/links failed:", error);
    return jsonError("ไม่สามารถสร้างลิงก์ได้", 500);
  }
}
