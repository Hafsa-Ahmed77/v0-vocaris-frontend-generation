import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { botId, query } = await req.json()

  const res = await fetch(
    `https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/transcripts/${botId}/query`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }
  )

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
