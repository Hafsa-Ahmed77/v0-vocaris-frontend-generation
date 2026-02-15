import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")
        const res = await fetch(
            "https://vocaris-ztudf.ondigitalocean.app/api/v1/meeting/active",
            {
                method: "GET",
                headers: {
                    ...(authHeader ? { Authorization: authHeader } : {}),
                }
            }
        )
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
