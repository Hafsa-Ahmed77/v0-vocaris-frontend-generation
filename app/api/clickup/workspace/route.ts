import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const token = searchParams.get("token")

        if (!token) {
            return NextResponse.json({ error: "token is required" }, { status: 400 })
        }

        const backendUrl = `https://vocaris-ztudf.ondigitalocean.app/api/v1/clickup/workspace?token=${token}`

        const res = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "User-Agent": "Vocaris-Server/1.0",
            },
            cache: "no-store"
        })

        if (!res.ok) {
            const bodyText = await res.text()
            console.error(`ClickUp Workspace Proxy: Backend returned ${res.status}: ${bodyText}`)
            return NextResponse.json({ error: "Failed to fetch ClickUp workspace", detail: bodyText }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data, { status: 200 })
    } catch (err: any) {
        console.error("ClickUp Workspace Proxy EXCEPTION:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
