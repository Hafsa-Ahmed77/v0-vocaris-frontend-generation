import { NextRequest, NextResponse } from "next/server"

const BASE = "https://vocaris-ztudf.ondigitalocean.app/api/v1"

// DELETE /api/voice-meeting/[session_id]
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ session_id: string }> }
) {
    try {
        const authHeader = req.headers.get("Authorization")
        const { session_id } = await params
        const res = await fetch(`${BASE}/voice-meeting/${session_id}`, {
            method: "DELETE",
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

// GET /api/voice-meeting/[session_id] (if needed for fallback)
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ session_id: string }> }
) {
    try {
        const authHeader = req.headers.get("Authorization")
        const { session_id } = await params
        const res = await fetch(`${BASE}/voice-meeting/${session_id}`, {
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
