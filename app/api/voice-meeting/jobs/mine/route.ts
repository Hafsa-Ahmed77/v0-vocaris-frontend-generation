import { NextRequest, NextResponse } from "next/server"

const BASE = "https://vocaris-ztudf.ondigitalocean.app/api/v1"

// GET /api/voice-meeting/jobs/mine -> Get jobs for the current user
export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")
        const res = await fetch(`${BASE}/voice-meeting/jobs/mine`, {
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
                "User-Agent": "Vocaris-Server/1.0",
            },
            cache: "no-store"
        })
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
