import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs" // 🔥 MUST

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const payload: any = {
      meeting_url: body.meeting_url?.trim(),
    }

    if (body.bot_name?.trim()) {
      payload.bot_name = body.bot_name.trim()
    }

    const res = await fetch(
      "https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/start",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Vocaris-Server/1.0",
        },
        body: JSON.stringify(payload),
      }
    )

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })

  } catch (err: any) {
    console.error("Proxy start-meeting error:", err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
