import { NextRequest, NextResponse } from "next/server"

const BASE = "https://vocaris-ztudf.ondigitalocean.app/api/v1"

// GET /api/voice-meeting/jobs/[job_id] -> Get Job Details
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ job_id: string }> }
) {
    try {
        const authHeader = req.headers.get("Authorization")
        const { job_id } = await params
        const res = await fetch(`${BASE}/voice-meeting/jobs/${job_id}`, {
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
                "User-Agent": "Vocaris-Server/1.0",
            },
            cache: "no-store"
        })
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

// PATCH /api/voice-meeting/jobs/[job_id] -> Update Job
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ job_id: string }> }
) {
    try {
        const authHeader = req.headers.get("Authorization")
        const { job_id } = await params
        const body = await req.json()
        const res = await fetch(`${BASE}/voice-meeting/jobs/${job_id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
                "User-Agent": "Vocaris-Server/1.0",
            },
            body: JSON.stringify(body),
        })
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

// DELETE /api/voice-meeting/jobs/[job_id] -> Delete Job
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ job_id: string }> }
) {
    try {
        const authHeader = req.headers.get("Authorization")
        const { job_id } = await params
        const res = await fetch(`${BASE}/voice-meeting/jobs/${job_id}`, {
            method: "DELETE",
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
                "User-Agent": "Vocaris-Server/1.0",
            }
        })
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
