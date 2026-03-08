import { NextRequest, NextResponse } from "next/server"

/**
 * Proxy for GET /api/v1/auth/config
 * Returns configuration for authentication providers (Google, Slack, etc.)
 */
export async function GET(req: NextRequest) {
    try {
        const backendUrl = "https://vocaris-ztudf.ondigitalocean.app/api/v1/auth/config"

        console.log("📡 Proxy Auth Config: Fetching from backend...")

        const res = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "User-Agent": "Vocaris-Server/1.0",
                "Accept": "application/json",
            },
            cache: "no-store",
            signal: AbortSignal.timeout(5000)
        })

        const data = await res.json().catch(() => ({}))

        if (res.ok) {
            console.log("✅ Proxy Auth Config: SUCCESS")
            return NextResponse.json(data, { status: 200 })
        }

        console.error(`❌ Proxy Auth Config: Backend returned ${res.status}`)
        return NextResponse.json(
            { error: "Failed to fetch auth config", detail: data },
            { status: res.status }
        )

    } catch (err: any) {
        console.error("🔥 Proxy Auth Config FATAL:", err.message)
        return NextResponse.json(
            { error: "Internal server error", detail: err.message },
            { status: 500 }
        )
    }
}
