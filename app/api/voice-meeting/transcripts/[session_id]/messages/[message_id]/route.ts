import { NextRequest, NextResponse } from "next/server"

const BASE = "https://vocaris-ztudf.ondigitalocean.app/api/v1"

// PATCH /api/voice-meeting/transcripts/[session_id]/messages/[message_id]
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ session_id: string, message_id: string }> }
) {
    try {
        const authHeader = req.headers.get("Authorization")
        const { session_id, message_id } = await params
        const body = await req.json()

        const res = await fetch(`${BASE}/voice-meeting/transcripts/${session_id}/messages/${message_id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
                "User-Agent": "Vocaris-Server/1.0",
            },
            body: JSON.stringify(body),
        })
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
