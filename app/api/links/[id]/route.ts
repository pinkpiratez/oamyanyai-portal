import { deleteLink, getLinkById, updateLink } from "@/lib/queries";
import { requireAdminAuth } from "@/lib/auth-server";
import { jsonError, jsonOk } from "@/lib/api-response";
import type { UpdateLinkInput } from "@/lib/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseId(rawId: string) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    if (!id) {
      return jsonError("รหัสลิงก์ไม่ถูกต้อง");
    }

    const link = await getLinkById(id);
    if (!link) {
      return jsonError("ไม่พบลิงก์", 404);
    }

    return jsonOk(link);
  } catch (error) {
    console.error("GET /api/links/[id] failed:", error);
    return jsonError("ไม่สามารถดึงข้อมูลลิงก์ได้", 500);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await requireAdminAuth();
    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    if (!id) {
      return jsonError("รหัสลิงก์ไม่ถูกต้อง");
    }

    const body = (await request.json()) as UpdateLinkInput;
    const link = await updateLink(id, body);

    if (!link) {
      return jsonError("ไม่พบลิงก์", 404);
    }

    return jsonOk(link);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return jsonError("Unauthorized", 401);
    }

    console.error("PUT /api/links/[id] failed:", error);
    return jsonError("ไม่สามารถอัปเดตลิงก์ได้", 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdminAuth();
    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    if (!id) {
      return jsonError("รหัสลิงก์ไม่ถูกต้อง");
    }

    const deleted = await deleteLink(id);
    if (!deleted) {
      return jsonError("ไม่พบลิงก์", 404);
    }

    return jsonOk({ deleted: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return jsonError("Unauthorized", 401);
    }

    console.error("DELETE /api/links/[id] failed:", error);
    return jsonError("ไม่สามารถลบลิงก์ได้", 500);
  }
}
