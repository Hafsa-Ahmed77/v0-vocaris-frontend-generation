import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token")?.value

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/meetings", "/scrum", "/settings", "/chatbot"]

  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // If accessing a protected route without a session, redirect to auth
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/meetings/:path*", "/scrum/:path*", "/settings/:path*", "/chatbot/:path*"],
}
