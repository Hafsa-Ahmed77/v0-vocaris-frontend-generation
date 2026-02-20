import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { botId, query } = await req.json()

  const authHeader = req.headers.get("Authorization")

  // Try variations for the query endpoint
  const base = "https://vocaris-ztudf.ondigitalocean.app/api/v1"
  const variations = [
    // 1. Official slash plural
    `${base}/meeting/transcripts/${botId}/query`,
    // 2. Hyphenated plural
    `${base}/meeting-transcripts/${botId}/query`,
    // 3. Singular hyphen
    `${base}/meeting-transcript/${botId}/query`,
    // 4. Direct query
    `${base}/meeting/${botId}/query`,
    // 5. Without v1
    `https://vocaris-ztudf.ondigitalocean.app/api/meeting/transcripts/${botId}/query`,
    // 6. Plural hyphen without v1
    `https://vocaris-ztudf.ondigitalocean.app/api/meeting-transcripts/${botId}/query`
  ]

  let lastRes: Response | null = null
  let lastBody = ""

  for (const url of variations) {
    try {
      console.log(`[Attempt Query] POST ${url}`)
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Vocaris-Server/1.0",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify({
          query,
          top_k: 5,
          include_sources: true
        }),
        signal: AbortSignal.timeout(10000)
      })

      const resText = await res.text()
      console.log(`  [Response] ${res.status} - ${resText.substring(0, 100)}...`)

      if (res.ok) {
        console.log(`✅ Proxy Query: SUCCESS at ${url}`)
        return NextResponse.json(JSON.parse(resText), { status: 200 })
      }

      // Unauthenticated fallback
      if ((res.status === 401 || res.status === 403) && authHeader) {
        console.warn(`⚠️ Proxy Query: Auth failed, retrying unauthenticated...`)
        const retryRes = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Vocaris-Server/1.0",
          },
          body: JSON.stringify({ query, top_k: 5, include_sources: true }),
          signal: AbortSignal.timeout(10000)
        })
        const retryText = await retryRes.text()
        if (retryRes.ok) {
          console.log(`✅ Proxy Query: SUCCESS (unauthenticated) at ${url}`)
          return NextResponse.json(JSON.parse(retryText), { status: 200 })
        }
      }

      lastRes = res
      lastBody = resText
    } catch (e: any) {
      console.error(`❌ Query Error at ${url}:`, e.message)
    }
  }

  return NextResponse.json({
    error: "Query failed",
    detail: lastBody,
    bot_id: botId
  }, { status: lastRes?.status || 502 })
}
