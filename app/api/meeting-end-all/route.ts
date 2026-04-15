import { NextRequest, NextResponse } from "next/server"

const BASE = "https://vocaris-ztudf.ondigitalocean.app/api/v1"

// POST /api/meeting-end-all -> Proxy to System A End All
export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")

        const res = await fetch(`${BASE}/meeting/end-all`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Vocaris-Server/1.0",
                "Accept": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
        })

        const data = await res.json().catch(() => ({}))
        return NextResponse.json(data, { status: res.status })
    } catch (err: any) {
        console.error("POST /api/meeting-end-all error:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
