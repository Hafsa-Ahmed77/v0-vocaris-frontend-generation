import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs" // 🔥 MUST (same as start-meeting)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const botId = searchParams.get("botId")

    if (!botId) {
      return NextResponse.json([], { status: 200 })
    }

    const res = await fetch(
      `https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/transcripts/${botId}`,
      {
        method: "GET",
        headers: {
          "User-Agent": "Vocaris-Server/1.0",
        },
      }
    )

    // transcript abhi ready nahi → empty array return
    if (!res.ok) {
      return NextResponse.json([], { status: 200 })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })

  } catch (err: any) {
    console.error("Proxy meeting-transcripts error:", err)
    return NextResponse.json([], { status: 200 })
  }
}
