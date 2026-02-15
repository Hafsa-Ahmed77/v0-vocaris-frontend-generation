import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")
        const { searchParams } = new URL(req.url)
        let botId = searchParams.get("bot_id") || searchParams.get("botId")
        const sessionId = searchParams.get("session_id") || searchParams.get("sessionId")
        const mode = searchParams.get("mode") || "simple"
        const format = searchParams.get("format") || "json"

        if (botId) {
            botId = botId.replace(/^\/+/, "").trim()
        }

        if (!botId) {
            return NextResponse.json({ error: "bot_id is required" }, { status: 400 })
        }

        // SWAGGER PRECISION VARIATIONS (Now with session_id support)
        const variations = [
            // 1. Path Pattern (Official Swagger)
            { url: `https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/transcripts/${botId}?mode=${mode}&format=${format}${sessionId ? `&session_id=${sessionId}` : ''}`, method: "GET" },
            // 2. Query Pattern
            { url: `https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/transcripts?bot_id=${botId}&mode=${mode}&format=${format}${sessionId ? `&session_id=${sessionId}` : ''}`, method: "GET" },
            // 3. Simple mode fallback (sometimes backend ignores mode in path)
            { url: `https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/transcripts?bot_id=${botId}&session_id=${sessionId}`, method: "GET" },
        ]

        const cb = Date.now()
        let lastRes: Response | null = null
        let lastBody = ""

        console.log(`Proxy Transcripts: [${mode}] for bot=${botId}, session=${sessionId}`)

        for (const v of variations) {
            const fullUrl = `${v.url}${v.url.includes('?') ? '&' : '?'}_cb=${cb}`
            try {
                const res = await fetch(fullUrl, {
                    method: "GET",
                    headers: {
                        "User-Agent": "Vocaris-Server/1.0",
                        ...(authHeader ? { Authorization: authHeader } : {}),
                    },
                    cache: "no-store",
                    signal: AbortSignal.timeout(10000)
                })

                const resText = await res.text()

                if (res.ok) {
                    console.log(`Proxy Transcripts: SUCCESS [200] at ${v.url}`)
                    try {
                        return NextResponse.json(JSON.parse(resText), { status: 200 })
                    } catch {
                        return NextResponse.json({ data: resText }, { status: 200 })
                    }
                }

                // If specialized "No transcripts found" message, we know ID is correct but data is pending
                if (resText.toLowerCase().includes("no transcripts found")) {
                    console.warn(`Proxy Transcripts: Backend returned "No transcripts found" (likely processing) at ${v.url}`)
                    return NextResponse.json({
                        tickets: [],
                        items: [],
                        transcript: "",
                        is_processing: true,
                        message: "Waiting for backend to process transcripts..."
                    }, { status: 200 })
                }

                lastRes = res
                lastBody = resText
            } catch (e: any) {
                console.error(`Proxy Transcripts Error: ${v.url}:`, e.message)
            }
        }

        console.error(`Proxy Transcripts: ALL FAIL. Status: ${lastRes ? (lastRes as any).status : 404}. Body: ${lastBody}`)
        return NextResponse.json({ error: "No variations succeeded", detail: lastBody }, { status: lastRes ? (lastRes as any).status : 404 })

    } catch (err: any) {
        return NextResponse.json({ error: "Internal server error", detail: err.message }, { status: 500 })
    }
}
