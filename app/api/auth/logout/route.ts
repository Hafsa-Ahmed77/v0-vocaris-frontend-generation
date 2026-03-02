import { NextRequest, NextResponse } from "next/server"

/**
 * Proxy for POST /api/v1/auth/logout
 * Note per API docs: JWT tokens are stateless, so this just confirms logout.
 * The real logout is done by the frontend discarding the token from localStorage.
 */
export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")

        const backendRes = await fetch(
            "https://vocaris-ztudf.ondigitalocean.app/api/v1/auth/logout",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(authHeader ? { Authorization: authHeader } : {}),
                },
                cache: "no-store",
                signal: AbortSignal.timeout(5000),
            }
        )

        // Even if backend fails, we return success — frontend will clear token regardless
        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err: any) {
        console.error("[auth/logout proxy] Error:", err.message)
        // Still return success — token will be cleared on frontend anyway
        return NextResponse.json({ success: true }, { status: 200 })
    }
}
