import { NextRequest, NextResponse } from "next/server"

const CLICKUP_CLIENT_ID = "4KPIR7QHYZ1D61QEQT1EOUP5WDL0ADK8"
const CLICKUP_CLIENT_SECRET = process.env.CLICKUP_CLIENT_SECRET || ""

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const code = searchParams.get("code")

        if (!code) {
            return NextResponse.json({ error: "No code provided" }, { status: 400 })
        }

        console.log("🔗 Exchanging ClickUp OAuth code for token directly with ClickUp API...")

        // First try: exchange directly with ClickUp
        const tokenRes = await fetch("https://api.clickup.com/api/v2/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: CLICKUP_CLIENT_ID,
                client_secret: CLICKUP_CLIENT_SECRET,
                code: code,
            }),
            cache: "no-store",
        })

        const rawText = await tokenRes.text()
        console.log(`📡 ClickUp Token Exchange (status ${tokenRes.status}):`, rawText)

        if (tokenRes.ok) {
            let data: any
            try { data = JSON.parse(rawText) } catch { }
            if (data?.access_token) {
                console.log("✅ Token obtained:", data.access_token)
                return NextResponse.json({ access_token: data.access_token, data })
            }
        }

        // Fallback: try the DigitalOcean backend
        console.log("↩️ Falling back to DigitalOcean backend for code exchange...")
        const backendRes = await fetch(
            `https://vocaris-ztudf.ondigitalocean.app/api/v1/auth/clickup/authorize?code=${code}`,
            {
                headers: {
                    "User-Agent": "Vocaris-Server/1.0",
                    "Accept": "application/json",
                    "Cookie": req.headers.get("cookie") || "",
                },
                cache: "no-store",
            }
        )

        const backendBody = await backendRes.text()
        console.log(`📡 Backend Response (status ${backendRes.status}):`, backendBody.substring(0, 200))

        const contentType = backendRes.headers.get("content-type") || ""
        if (contentType.includes("application/json")) {
            const json = JSON.parse(backendBody)
            return NextResponse.json(json)
        }

        return NextResponse.json(
            { error: "Could not exchange code for token", raw: backendBody.substring(0, 500) },
            { status: 400 }
        )

    } catch (err: any) {
        console.error("ClickUp Auth Proxy EXCEPTION:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
