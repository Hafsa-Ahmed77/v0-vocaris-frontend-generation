import { NextRequest, NextResponse } from "next/server"

const BASE = "https://vocaris-ztudf.ondigitalocean.app/api/v1"

// PATCH /api/voice-meeting/sessions/[session_id]/messages/[message_index]
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ session_id: string, message_index: string }> }
) {
    try {
        const authHeader = req.headers.get("Authorization")
        const { session_id, message_index } = await params
        const body = await req.json()

        // Backend expects: PATCH /sessions/{session_id}/messages/{message_index}
        // Body: { "new_message": "string" }
        const res = await fetch(`${BASE}/voice-meeting/sessions/${session_id}/messages/${message_index}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
                "User-Agent": "Vocaris-Server/1.0",
            },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error(`[Proxy] PATCH ${session_id}/${message_index} failed:`, errorText)
            return NextResponse.json({ error: errorText || "Backend request failed" }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (err: any) {
        console.error(`[Proxy] Error in PATCH voice message:`, err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
