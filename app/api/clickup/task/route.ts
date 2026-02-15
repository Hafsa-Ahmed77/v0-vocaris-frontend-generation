import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const token = searchParams.get("token")

        if (!token) {
            return NextResponse.json({ error: "token is required" }, { status: 400 })
        }

        const body = await req.json()
        const backendUrl = `https://vocaris-ztudf.ondigitalocean.app/api/v1/clickup/task?token=${token}`

        const res = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Vocaris-Server/1.0",
            },
            body: JSON.stringify(body)
        })

        if (!res.ok) {
            const bodyText = await res.text()
            console.error(`ClickUp Task Proxy: Backend returned ${res.status}: ${bodyText}`)
            return NextResponse.json({ error: "Failed to create ClickUp task", detail: bodyText }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data, { status: 200 })
    } catch (err: any) {
        console.error("ClickUp Task Proxy EXCEPTION:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
