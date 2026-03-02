import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")
        const body = await req.json()
        const backendUrl = "https://vocaris-ztudf.ondigitalocean.app/api/v1/calendar/auto-join/enable"

        const backendRes = await fetch(backendUrl, {
            method: "POST",
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })

        const data = await backendRes.json().catch(() => ({}))
        return NextResponse.json(data, { status: backendRes.status })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 502 })
    }
}
