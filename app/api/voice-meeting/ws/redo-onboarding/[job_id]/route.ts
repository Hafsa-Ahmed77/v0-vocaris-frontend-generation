import { NextRequest, NextResponse } from "next/server"

const BASE = "https://vocaris-ztudf.ondigitalocean.app/api/v1"

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ job_id: string }> }
) {
    try {
        const authHeader = req.headers.get("Authorization")
        const { job_id } = await params
        const res = await fetch(`${BASE}/voice-meeting/ws/redo-onboarding/${job_id}`, {
            method: "POST",
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
                "User-Agent": "Vocaris-Server/1.0",
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
