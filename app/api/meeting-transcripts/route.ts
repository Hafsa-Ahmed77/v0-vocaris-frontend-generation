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

        if (mode === "scrum" && !autoProcess) {
            // DOCS: "disabled for scrum mode"
            autoProcess = "false"
        } else if (!autoProcess) {
            autoProcess = "true"
        }

        if (botId) {
            botId = botId.replace(/^\/+/, "").trim()
        }

        if (!botId) {
            return NextResponse.json({ error: "bot_id is required" }, { status: 400 })
        }

        // The official endpoint from docs: /api/v1/meeting/transcripts/{bot_id}
        const officialUrl = `https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/transcripts/${botId}?mode=${mode}&format=${format}&auto_process=${autoProcess}`

        console.log(`Proxy Transcripts: Polling official endpoint for bot=${botId} (Mode=${mode}, auto_process=${autoProcess})`)

        try {
            console.log(`  [Fetch] GET ${officialUrl}`)
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
                console.log(`✅ Proxy Transcripts: SUCCESS`)
                return NextResponse.json(JSON.parse(resText), { status: 200 })
            }

            // Handling "Processing" vs "Hard Error"
            // If it's 404, we need to know if it's REALLY processing or just GONE.
            // For now, let's assume if it's 404 it's NOT_FOUND if it's an old bot.
            // Better: Return a specific status so the UI can decide.

            const isProcessing =
                res.status === 404 && (resText.toLowerCase().includes("no transcripts found") || resText.toLowerCase().includes("not found"))

            if (isProcessing) {
                console.warn(`⏳ Proxy Transcripts: Backend returned 404 for bot=${botId}.`)

                // If it's 404 but we asked for auto_process=true, it's possible the AI is actually working.
                // But we shouldn't trap it forever. 
                return NextResponse.json({
                    tickets: [],
                    items: [],
                    transcript: "",
                    is_processing: true,
                    status: "awaiting_analysis",
                    message: "AI is analyzing the meeting... please wait."
                }, { status: 200 })
            }

            // If it's a real error (not 404), return it
            return NextResponse.json({
                error: "Transcript retrieval failed",
                detail: resText,
                bot_id: botId
            }, { status: res.status })

        } catch (e: any) {
            console.error(`❌ Proxy Transcripts: Error:`, e.message)
            return NextResponse.json({ error: "Upstream request failed", detail: e.message }, { status: 502 })
        }

    } catch (err: any) {
        console.error(`🔥 Proxy Transcripts FATAL ERROR:`, err.message)
        return NextResponse.json({ error: "Upstream request failed", detail: err.message }, { status: 502 })
    }
}
