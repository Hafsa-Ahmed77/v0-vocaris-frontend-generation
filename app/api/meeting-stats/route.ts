import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")
        const url = "https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/stats"
        console.log(`Proxy Stats: Fetching from ${url}`)

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "Vocaris-Server/1.0",
                "Accept": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            cache: "no-store"
        })

        const data = await res.json()

        if (res.ok) {
            console.log("✅ Proxy Stats: SUCCESS", JSON.stringify(data))
        } else {
            console.error("❌ Proxy Stats: FAILED", res.status, JSON.stringify(data))
        }

        return NextResponse.json(data, { status: res.status })
    } catch (err: any) {
        console.error("🔥 Proxy Stats: FATAL ERROR", err.message)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
