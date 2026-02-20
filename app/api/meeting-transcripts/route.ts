import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")
        const { searchParams } = new URL(req.url)

        // Extract parameters strictly as per definition
        let botId = searchParams.get("bot_id") || searchParams.get("botId")
        const mode = searchParams.get("mode") || "simple"
        const format = searchParams.get("format") || "json"

        // Handle auto_process
        // Documentation says: "Automatically run RAG chunking pipeline (disabled for scrum mode)"
        // So if mode is scrum, we MUST enforce auto_process=false unless explicitly overridden? 
        // Docs say "Default value : true", but "disabled for scrum mode".
        // Let's force it to 'false' if mode is 'scrum' to be safe, or respect user input if provided, but default to false for scrum.

        let autoProcess = searchParams.get("auto_process")

        if (mode === "scrum") {
            // DOCS: "disabled for scrum mode"
            autoProcess = "false"
        } else if (!autoProcess) {
            // Default to true for other modes if not specified
            autoProcess = "true"
        }

        if (botId) {
            botId = botId.replace(/^\/+/, "").trim()
        }

        if (!botId) {
            return NextResponse.json({ error: "bot_id is required" }, { status: 400 })
        }

        // Construct strict variations based on docs + common patterns
        const base = "https://vocaris-ztudf.ondigitalocean.app/api/v1"
        const variations = [
            // 1. Official Swagger: plural 'transcripts', with v1
            `${base}/meeting/transcripts/${botId}?mode=${mode}&format=${format}&auto_process=${autoProcess}`,
            // 2. Singular 'transcript'
            `${base}/meeting/transcript/${botId}?mode=${mode}&format=${format}&auto_process=${autoProcess}`,
            // 3. Hyphenated plural
            `${base}/meeting-transcripts/${botId}?mode=${mode}&format=${format}&auto_process=${autoProcess}`,
            // 4. No 'v1' variation (just in case)
            `https://vocaris-ztudf.ondigitalocean.app/api/meeting/transcripts/${botId}?mode=${mode}&format=${format}&auto_process=${autoProcess}`
        ]

        console.log(`Proxy Transcripts: Polling variations for bot=${botId} (Mode=${mode})`)

        let lastRes: Response | null = null
        let lastBody = ""

        // Try variations with Authorization first
        for (const url of variations) {
            try {
                console.log(`  [Attempt] GET ${url}`)
                const res = await fetch(url, {
                    method: "GET",
                    headers: {
                        "User-Agent": "Vocaris-Server/1.0",
                        "Accept": "application/json",
                        ...(authHeader ? { Authorization: authHeader } : {}),
                    },
                    cache: "no-store",
                    signal: AbortSignal.timeout(10000)
                })

                const resText = await res.text()

                if (res.ok) {
                    console.log(`✅ Proxy Transcripts: SUCCESS at ${url}`)
                    return NextResponse.json(JSON.parse(resText), { status: 200 })
                }

                // If 401/403, it might be a public endpoint that rejects invalid tokens
                if ((res.status === 401 || res.status === 403) && authHeader) {
                    console.warn(`⚠️ Proxy Transcripts: Auth failed. Retrying WITHOUT Authorization...`)
                    const retryRes = await fetch(url, {
                        method: "GET",
                        headers: {
                            "User-Agent": "Vocaris-Server/1.0",
                            "Accept": "application/json",
                        },
                        cache: "no-store",
                        signal: AbortSignal.timeout(10000)
                    })
                    const retryText = await retryRes.text()
                    if (retryRes.ok) {
                        console.log(`✅ Proxy Transcripts: SUCCESS (unauthenticated) at ${url}`)
                        return NextResponse.json(JSON.parse(retryText), { status: 200 })
                    }
                }

                // Handle "No transcripts found" - often 404 but contains specific text
                if (resText.toLowerCase().includes("no transcripts found")) {
                    console.warn(`⏳ Proxy Transcripts: Backend says "No transcripts found" (Still processing)`)
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
                console.error(`❌ Proxy Transcripts: Error at ${url}:`, e.message)
            }
        }

        const fallbackStatus = (lastRes as any)?.status || 502
        return NextResponse.json({
            error: "Transcript retrieval failed",
            detail: lastBody || "No response received from backend",
            bot_id: botId
        }, { status: fallbackStatus })

    } catch (err: any) {
        console.error(`🔥 Proxy Transcripts FATAL ERROR:`, err.message)
        return NextResponse.json({ error: "Upstream request failed", detail: err.message }, { status: 502 })
    }
}
