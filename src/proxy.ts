import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic route protection. The API sets a non-sensitive `ss_session` hint cookie (value = role)
 * next to the httpOnly auth cookies. Real authorisation is always enforced by the API.
 */
const SESSION_COOKIE = "ss_session";

const roleAreas: Record<string, string> = {
  "/creator": "creator",
  "/brand": "brand",
};
const privatePrefixes = [
  "/creator",
  "/brand",
  "/collabs",
  "/settings",
  "/checkout",
];
const authPages = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const role = request.cookies.get(SESSION_COOKIE)?.value;

  const isPrivate = privatePrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (isPrivate && !role) {
    console.log(role, "user role");
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  // Keep each role inside its own area
  for (const [prefix, requiredRole] of Object.entries(roleAreas)) {
    if (
      (pathname === prefix || pathname.startsWith(`${prefix}/`)) &&
      role &&
      role !== requiredRole
    ) {
      return NextResponse.redirect(
        new URL(role === "brand" ? "/brand" : "/creator", request.url)
      );
    }
  }

  if (role && authPages.includes(pathname)) {
    return NextResponse.redirect(
      new URL(role === "brand" ? "/brand" : "/creator", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/creator/:path*",
    "/brand/:path*",
    "/collabs/:path*",
    "/settings",
    "/checkout/:path*",
    "/login",
    "/register",
  ],
};
