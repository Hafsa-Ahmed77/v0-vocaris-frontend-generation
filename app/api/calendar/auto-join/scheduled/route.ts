import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")
        const backendUrl = "https://vocaris-ztudf.ondigitalocean.app/api/v1/calendar/auto-join/scheduled"

        const backendRes = await fetch(backendUrl, {
            method: "GET",
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
                "Content-Type": "application/json",
            },
            cache: "no-store",
        })

        const data = await backendRes.json().catch(() => ({}))
        return NextResponse.json(data, { status: backendRes.status })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 502 })
    }
}
