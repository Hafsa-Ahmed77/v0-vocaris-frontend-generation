import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")
        const { searchParams } = new URL(req.url)
        let botId = searchParams.get("botId") || searchParams.get("bot_id")
        if (botId) {
            botId = botId.replace(/^\/+/, "").trim()
        }

        if (!botId) {
            return NextResponse.json({ error: "bot_id is required" }, { status: 400 })
        }

        const variations = [
            `https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/status?bot_id=${botId}`,
            `https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/status/${botId}`,
            `https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/status?session_id=${botId}`,
            `https://vocaris-ztudf.ondigitalocean.app/api/meeting/status?bot_id=${botId}`,
        ]

        let lastRes: Response | null = null
        let lastBody = ""

        for (const url of variations) {
            try {
                const res = await fetch(url, {
                    method: "GET",
                    headers: {
                        "User-Agent": "Vocaris-Server/1.0",
                        ...(authHeader ? { Authorization: authHeader } : {}),
                    },
                    cache: "no-store",
                    signal: AbortSignal.timeout(5000)
                })

                const resText = await res.text()

                if (res.ok) {
                    console.log(`Proxy status: SUCCESS [${res.status}] at ${url}`)
                    return NextResponse.json(JSON.parse(resText), { status: 200 })
                }

                lastRes = res
                lastBody = resText
            } catch (e) {
                console.error(`Proxy status error for ${url}:`, e)
            }
        }

        // Special handling for 404 - map to inactive if it looks like "No session found"
        if (lastBody.toLowerCase().includes("no session found") || lastBody.toLowerCase().includes("not found")) {
            console.log(`Proxy status: Mapping 404/No session found to { is_active: false }`)
            return NextResponse.json({
                is_active: false,
                status: "not_found",
                message: "Bot not found or session ended",
                bot_in_call: false
            }, { status: 200 })
        }

        return NextResponse.json({ error: "Backend error", detail: lastBody }, { status: lastRes?.status || 500 })

    } catch (err: any) {
        console.error("Proxy status FATAL:", err)
        return NextResponse.json({ error: "Internal server error", detail: err.message }, { status: 500 })
    }
}
