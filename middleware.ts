import { NextRequest, NextResponse } from "next/server";

/**
 * Configure which paths are PUBLIC (accessible without a token)
 * Note: '/auth' handles its own redirect to '/dashboard' via this middleware
 */
const PUBLIC_PATHS = [
  "/auth",
  "/auth/callback",
]

const PUBLIC_API_PREFIXES = [
  "/api/auth",
  "/api/public",
]

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  
  // 1. Static and Internal assets Bypass
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/favicon.ico") ||
    pathname.includes("/images/") ||
    pathname.includes("/icons/")
  ) {
    return NextResponse.next();
  }

  // 2. ClickUp Callback Relay
  const code = searchParams.get("code");
  if (pathname === "/" && code) {
    const callbackUrl = req.nextUrl.clone();
    callbackUrl.pathname = "/auth/clickup/callback";
    return NextResponse.redirect(callbackUrl);
  }

  // 3. Authentication Check
  const token = req.cookies.get("vocaris_token")?.value;
  const isPublicPath = PUBLIC_PATHS.some(path => pathname === path);
  const isPublicApi = PUBLIC_API_PREFIXES.some(prefix => pathname.startsWith(prefix));

  // A. Guest Guard: Redirect logged-in users away from /auth to /dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // B. Protect-by-Default Guard: Redirect unauthenticated users to /auth
  // Bypass for the auth pages themselves and public APIs
  if (!token && !isPublicPath && !isPublicApi) {
    // If it's an API request, return 401 instead of redirecting to HTML login page
    if (pathname.startsWith("/api")) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized", message: "Please login again." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const loginUrl = new URL("/auth", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api routes (except those we manually want to protect)
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
