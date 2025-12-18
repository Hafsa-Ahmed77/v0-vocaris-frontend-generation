import { NextResponse } from "next/server"

export async function GET() {
  const res = await fetch(
    "https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/status",
    { cache: "no-store" }
  )

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
