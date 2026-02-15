import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")
        const { searchParams } = new URL(req.url)
        let botId = searchParams.get("botId") || searchParams.get("bot_id")

        if (botId) {
            botId = botId.replace(/^\/+/, "").trim()
        }

        if (!botId) {
            console.error("Proxy End-Meeting: bot_id is missing from request")
            return NextResponse.json({ error: "bot_id is required" }, { status: 400 })
        }

        const variations = [
            // 1. Official Swagger: POST /api/v1/meeting/end (Strict Body: bot_id)
            { url: "https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/end", method: "POST", body: { bot_id: botId } },
            // 2. Query Param Variation
            { url: `https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/end?bot_id=${botId}`, method: "POST", body: {} },
            // 3. Path Parameter Variation
            { url: `https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/end/${botId}`, method: "POST", body: {} },
            // 4. Voice Fallback
            { url: `https://vocaris-ztudf.ondigitalocean.app/api/v1/voice-meeting/${botId}`, method: "DELETE" }
        ]

        if (botId.toLowerCase() === "all" || botId === "cleanup") {
            console.log("Proxy End-Meeting: Triggering END-ALL cleanup")
            const res = await fetch("https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/end-all", {
                method: "POST",
                headers: { ...(authHeader ? { Authorization: authHeader } : {}) }
            })
            const text = await res.text()
            return NextResponse.json({ message: "End all triggered", detail: text }, { status: 200 })
        }

        let lastRes: Response | null = null
        let lastBody = ""

        console.log(`🚀 Proxy End-Meeting: Requesting termination for bot ${botId}`)

        for (const [index, v] of variations.entries()) {
            try {
                console.log(`  [Attempt ${index + 1}/${variations.length}] ${v.method} ${v.url}`)
                const res = await fetch(v.url, {
                    method: v.method,
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": "Vocaris-Server/1.0",
                        ...(authHeader ? { Authorization: authHeader } : {}),
                    },
                    body: v.body && Object.keys(v.body).length > 0 ? JSON.stringify(v.body) : (v.method === "POST" ? "{}" : undefined),
                    signal: AbortSignal.timeout(10000)
                })

                const resText = await res.text()
                console.log(`  [Result ${index + 1}] Status ${res.status}: ${resText.substring(0, 100)}${resText.length > 100 ? '...' : ''}`)

                if (res.ok) {
                    console.log(`✅ Proxy End-Meeting: SUCCESS at ${v.url}`)
                    try {
                        return NextResponse.json(JSON.parse(resText), { status: 200 })
                    } catch {
                        return NextResponse.json({ message: resText }, { status: 200 })
                    }
                }

                if (resText.toLowerCase().includes("session not found") || resText.toLowerCase().includes("bot not found")) {
                    console.warn(`⚠️ Proxy End-Meeting: Session already gone or not found. Treating as success.`)
                    return NextResponse.json({ message: "Meeting session not found or already ended", is_closed: true }, { status: 200 })
                }

                lastRes = res
                lastBody = resText
            } catch (e: any) {
                console.error(`❌ Proxy End-Meeting: Error at ${v.url}:`, e.message)
            }
        }

        console.error(`🛑 Proxy End-Meeting: ALL VARIATIONS FAILED for ${botId}. Last Status: ${lastRes ? (lastRes as any).status : 500}. Last Body: ${lastBody}`)
        return NextResponse.json({
            error: "Failed to end meeting after multiple variations",
            detail: lastBody,
            bot_id: botId
        }, { status: lastRes ? (lastRes as any).status : 500 })

    } catch (err: any) {
        console.error("🔥 Proxy End-Meeting: CRITICAL EXCEPTION:", err.message)
        return NextResponse.json({ error: "Internal Proxy Error", detail: err.message }, { status: 500 })
    }
}
