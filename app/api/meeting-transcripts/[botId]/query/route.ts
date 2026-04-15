import { NextRequest, NextResponse } from "next/server"

const BASE = "https://vocaris-ztudf.ondigitalocean.app/api/v1"

// POST /api/meeting-transcripts/[botId]/query -> Proxy to System A RAG Query
export async function POST(
    req: NextRequest,
    { params }: { params: { botId: string } }
) {
    try {
        // In Next.js 15, params must be awaited
        const { botId } = await params
        const authHeader = req.headers.get("Authorization")
        const body = await req.json()

        console.log(`[Proxy] RAG Query for bot: ${botId}`)
        
        const res = await fetch(`${BASE}/meeting/transcripts/${botId}/query`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Vocaris-Server/1.0",
                "Accept": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: JSON.stringify(body),
        })

        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (err: any) {
        console.error("POST /api/meeting-transcripts/[botId]/query error:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
