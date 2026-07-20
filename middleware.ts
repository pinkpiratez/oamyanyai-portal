import { NextRequest, NextResponse } from "next/server";
import {
  getAdminPasswordFromEnv,
  isAuthenticatedRequest,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

const PROTECTED_ADMIN_PATHS = ["/admin"];
const PROTECTED_API_MUTATIONS = [
  { method: "PUT", prefix: "/api/content" },
  { method: "POST", prefix: "/api/links" },
  { method: "PUT", prefix: "/api/links/" },
  { method: "DELETE", prefix: "/api/links/" },
];

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/reset-password"];

function isPublicAdminPath(pathname: string) {
  return PUBLIC_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function isProtectedAdminPath(pathname: string) {
  return PROTECTED_ADMIN_PATHS.some((path) => {
    if (pathname === path) {
      return true;
    }

    return pathname.startsWith(`${path}/`) && !isPublicAdminPath(pathname);
  });
}

function isProtectedApiMutation(request: NextRequest) {
  const { pathname } = request.nextUrl;

  return PROTECTED_API_MUTATIONS.some(
    ({ method, prefix }) =>
      request.method === method && pathname.startsWith(prefix),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth =
    isProtectedAdminPath(pathname) || isProtectedApiMutation(request);

  if (!needsAuth) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const secret = getAdminPasswordFromEnv();
  const authenticated = await isAuthenticatedRequest(token, {
    ADMIN_PASSWORD: secret,
  });

  if (authenticated) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/content", "/api/links/:path*"],
};
