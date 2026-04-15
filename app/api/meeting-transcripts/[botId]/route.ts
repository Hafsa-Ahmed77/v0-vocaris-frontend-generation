import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req: NextRequest,
    { params }: { params: { botId: string } }
) {
    try {
        const authHeader = req.headers.get("Authorization")
        const { searchParams } = new URL(req.url)
        
        // In Next.js 15, params must be awaited
        const { botId } = await params
        const mode = searchParams.get("mode") || "simple"
        const format = searchParams.get("format") || "json"
        let autoProcess = searchParams.get("auto_process")

        if (mode === "scrum" && !autoProcess) {
            autoProcess = "false"
        } else if (!autoProcess) {
            autoProcess = "true"
        }

        const officialUrl = `https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/transcripts/${botId}?mode=${mode}&format=${format}&auto_process=${autoProcess}`

        console.log(`[Proxy] GET Transcripts: ${botId} (Path Param)`)

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

        return NextResponse.json({ error: "Transcript retrieval failed", detail: resText }, { status: res.status })

    } catch (err: any) {
        return NextResponse.json({ error: "Upstream request failed", detail: err.message }, { status: 502 })
    }
}
