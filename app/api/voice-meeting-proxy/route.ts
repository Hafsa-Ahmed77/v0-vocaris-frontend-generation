import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Directly forward the request to Vocaris API
    const res = await fetch(
      "https://vocaris-ztudf.ondigitalocean.app/api/v1/voice-meeting/ws/start",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Vocaris-Server/1.0",
        },
        body: JSON.stringify(body),
      }
    )

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    console.error("Voice Meeting Proxy error:", err)
    return NextResponse.json(
      { error: err.message || "Voice meeting service failed" },
      { status: 500 }
    )
  }
}
