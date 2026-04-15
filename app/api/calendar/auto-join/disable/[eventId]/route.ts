import { NextRequest, NextResponse } from "next/server"

export async function POST(
    req: NextRequest,
    { params }: { params: { eventId: string } }
) {
    try {
        const authHeader = req.headers.get("Authorization")
        // In Next.js 15, params must be awaited
        const { eventId } = await params
        const backendUrl = `https://vocaris-ztudf.ondigitalocean.app/api/v1/calendar/auto-join/disable/${eventId}`

        const backendRes = await fetch(backendUrl, {
            method: "POST",
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
                "Content-Type": "application/json",
            },
        })

        const data = await backendRes.json().catch(() => ({}))
        return NextResponse.json(data, { status: backendRes.status })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 502 })
    }
}
