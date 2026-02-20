import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl

    // If ClickUp redirects to root with ?code=, relay to the callback page
    // (ClickUp's OAuth app only accepts "localhost:3000", not paths)
    const code = searchParams.get("code")
    if (pathname === "/" && code) {
        const callbackUrl = req.nextUrl.clone()
        callbackUrl.pathname = "/auth/clickup/callback"
        console.log("🔀 Relaying ClickUp code from root to callback:", callbackUrl.toString())
        return NextResponse.redirect(callbackUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        // Only run on root path to avoid affecting all routes
        "/",
    ],
}
