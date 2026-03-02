import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")

        if (!authHeader) {
            return NextResponse.json({ valid: false, error: "No token provided" }, { status: 401 })
        }

        const backendRes = await fetch(
            "https://vocaris-ztudf.ondigitalocean.app/api/v1/auth/verify",
            {
                method: "GET",
                headers: {
                    Authorization: authHeader,
                    "Content-Type": "application/json",
                },
                cache: "no-store",
                signal: AbortSignal.timeout(8000),
            }
        )

        const data = await backendRes.json().catch(() => ({}))

        if (backendRes.ok) {
            return NextResponse.json({ valid: true, ...data }, { status: 200 })
        }

        // Token is expired / invalid
        return NextResponse.json({ valid: false, ...data }, { status: backendRes.status })
    } catch (err: any) {
        console.error("[auth-verify proxy] Error:", err.message)
        // Network issue — don't log out the user, just skip validation
        return NextResponse.json({ valid: true, skipped: true }, { status: 200 })
    }
}
