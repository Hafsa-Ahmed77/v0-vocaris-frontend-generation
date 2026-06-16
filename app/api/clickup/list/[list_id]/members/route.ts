import { NextRequest, NextResponse } from "next/server"

const BASE = "https://vocaris-ztudf.ondigitalocean.app/api/v1"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ list_id: string }> }
) {
    try {
        const { searchParams } = new URL(req.url)
        const token = searchParams.get("token")
        const { list_id } = await params

        if (!token) {
            return NextResponse.json({ error: "token query parameter is required" }, { status: 400 })
        }

        const res = await fetch(`${BASE}/clickup/list/${list_id}/members?token=${token}`, {
            method: "GET",
            headers: {
                "User-Agent": "Vocaris-Server/1.0",
                "Accept": "application/json"
            },
            cache: "no-store"
        })
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
