import { NextResponse } from "next/server"

export async function POST() {
  const res = await fetch(
    "https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/end",
    { method: "POST" }
  )

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
