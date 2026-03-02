import { NextRequest, NextResponse } from "next/server"

/**
 * Proxy for GET /api/v1/auth/me
 * Called by the auth callback page to fetch the logged-in user's profile.
 * This was the MISSING proxy causing the auth loop — token would be saved,
 * then /api/auth/me would 404, catch() would clear the token, and user
 * would be redirected back to /auth every single time.
 */
export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")

        if (!authHeader) {
            return NextResponse.json({ error: "No token provided" }, { status: 401 })
        }

        const backendRes = await fetch(
            "https://vocaris-ztudf.ondigitalocean.app/api/v1/auth/me",
            {
                method: "GET",
                headers: {
                    Authorization: authHeader,
                    "Content-Type": "application/json",
                },
                cache: "no-store",
                signal: AbortSignal.timeout(10000),
            }
        )

        const data = await backendRes.json().catch(() => ({}))

        return NextResponse.json(data, { status: backendRes.status })
    } catch (err: any) {
        console.error("[auth/me proxy] Error:", err.message)
        return NextResponse.json(
            { error: "Failed to fetch user profile", detail: err.message },
            { status: 502 }
        )
    }
}
