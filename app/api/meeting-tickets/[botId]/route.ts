import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ botId: string }> }
) {
    try {
        const authHeader = req.headers.get("Authorization")
        
        // In Next.js 15, params must be awaited
        const { botId } = await params

        const officialUrl = `https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/transcripts/meetings/${botId}/tickets`

        console.log(`[Proxy] GET Meeting Tickets: ${botId}`)

        const res = await fetch(officialUrl, {
            method: "GET",
            headers: {
                "User-Agent": "Vocaris-Server/1.0",
                "Accept": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            cache: "no-store",
            signal: AbortSignal.timeout(15000)
        })

        const resText = await res.text()

        if (res.ok) {
            return NextResponse.json(JSON.parse(resText), { status: 200 })
        }

        const isProcessing = res.status === 404 && (resText.toLowerCase().includes("no transcripts found") || resText.toLowerCase().includes("not found"))

        if (isProcessing) {
            return NextResponse.json({
                tickets: [],
                items: [],
                transcript: "",
                is_processing: true,
                status: "awaiting_analysis",
                message: "AI is analyzing the meeting... please wait."
            }, { status: 200 })
        }

        return NextResponse.json({ error: "Ticket retrieval failed", detail: resText }, { status: res.status })

    } catch (err: any) {
        return NextResponse.json({ error: "Upstream request failed", detail: err.message }, { status: 502 })
    }
}
