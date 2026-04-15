import { NextRequest, NextResponse } from "next/server"

const BASE = "https://vocaris-ztudf.ondigitalocean.app/api/v1"

// POST /api/voice-meeting/ws/start-with-job -> Proxy to backend
export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")
        const { searchParams } = new URL(req.url)
        
        const res = await fetch(`${BASE}/voice-meeting/ws/start-with-job?${searchParams.toString()}`, {
            method: "POST",
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
                "User-Agent": "Vocaris-Server/1.0",
            }
        })
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
