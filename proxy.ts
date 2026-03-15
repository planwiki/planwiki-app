import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

const AUTH_ONLY_PATHS = ["/welcome", "/new", "/workspaces"];
const AUTH_REDIRECT_PATHS = ["/login"];
const PUBLIC_ROUTES = ["/", "/auth/callback", "/privacy", "/terms"];
const PUBLIC_PATH_PREFIXES = ["/api", "/_next", "/favicon.ico"];
const PUBLIC_WORKSPACE_SEGMENTS = ["/shared/", "/public/"];
const METADATA_ROUTES = ["/sitemap.xml", "/robots.txt"];

const isProtectedPath = (pathname: string) =>
  AUTH_ONLY_PATHS.some((route) => pathname === route);

const isAuthRedirectPath = (pathname: string) =>
  AUTH_REDIRECT_PATHS.some((route) => pathname === route);

const isPublicPath = (pathname: string) => {
  if (PUBLIC_ROUTES.includes(pathname) || METADATA_ROUTES.includes(pathname)) {
    return true;
  }

  if (PUBLIC_PATH_PREFIXES.some((route) => pathname.startsWith(route))) {
    return true;
  }

  if (pathname.startsWith("/workspaces/")) {
    return PUBLIC_WORKSPACE_SEGMENTS.some((segment) => pathname.includes(segment));
  }

  return false;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = SESSION_COOKIE_NAMES.find((name) => request.cookies.get(name));
  const isAuthenticated = Boolean(token);

  if (!isAuthenticated && isProtectedPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isAuthRedirectPath(pathname)) {
    return NextResponse.redirect(new URL("/workspaces", request.url));
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  return isAuthenticated
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
