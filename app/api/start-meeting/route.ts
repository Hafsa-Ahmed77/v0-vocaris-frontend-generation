import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")
        const body = await req.json()

        const payload = {
            meeting_url: body.meeting_url?.trim(),
            bot_name: body.bot_name?.trim() || "Vocaris AI",
            meeting_title: body.meeting_title || (body.is_scrum ? "Scrum Meeting" : "New Meeting"),
            is_scrum: body.is_scrum || false,
        }

        const backendUrl = "https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/start"
        console.log(`Proxy start-meeting: Sending request to backend (is_scrum: ${payload.is_scrum})`)
        console.log("Proxy start-meeting Payload:", JSON.stringify(payload, null, 2))

        let res = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
                "User-Agent": "Vocaris-Server/1.0",
            },
            body: JSON.stringify(payload),
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error(`Proxy start-meeting FAILED: ${res.status} ${res.statusText}`)
            console.error(`Proxy start-meeting Error Body: ${errorText}`)

            console.warn(`Proxy start-meeting: Backend returned ${res.status}`)

            // Fallback for 404
            if (res.status === 404) {
                const fallbackUrl = "https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting-start"
                console.log(`Proxy start-meeting: Attempting fallback to ${fallbackUrl}`)
                res = await fetch(fallbackUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(authHeader ? { Authorization: authHeader } : {}),
                        "User-Agent": "Vocaris-Server/1.0",
                    },
                    body: JSON.stringify(payload),
                })
            } else {
                // return error if not 404
                return NextResponse.json({ error: "Backend request failed", detail: errorText }, { status: res.status })
            }
        }

        const data = await res.json()
        if (data.bot_id) {
            console.log(`Proxy start-meeting: Received bot_id: ${data.bot_id} (Length: ${data.bot_id.length})`)
        }
        return NextResponse.json(data, { status: res.status })
    } catch (err: any) {
        console.error("Proxy start-meeting EXCEPTION:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
