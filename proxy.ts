import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

const PUBLIC_ROUTES = new Set([
  "/",
  "/login",
  "/auth/callback",
  "/privacy",
  "/terms",
  "/sitemap.xml",
  "/robots.txt",
]);

const isPublic = (pathname: string) => {
  if (PUBLIC_ROUTES.has(pathname)) return true;
  if (pathname.startsWith("/api/auth")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (
    pathname.startsWith("/workspaces/") &&
    (pathname.includes("/shared/") || pathname.includes("/public/"))
  )
    return true;
  return false;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = SESSION_COOKIE_NAMES.some((name) =>
    request.cookies.get(name),
  );

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (isPublic(pathname)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/workspaces", request.url));
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
