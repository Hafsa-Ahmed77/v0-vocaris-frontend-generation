import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs" // 🔥 MUST (same as meeting)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // directly forward whatever frontend sends
    const res = await fetch(
      "https://vocaris-ztudf.ondigitalocean.app/api/v1/form",
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
    console.error("Proxy form error:", err)
    return NextResponse.json(
      { error: err.message || "Form service failed" },
      { status: 500 }
    )
  }
}
