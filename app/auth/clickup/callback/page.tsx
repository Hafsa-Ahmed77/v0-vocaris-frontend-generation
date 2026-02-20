"use client"

import { useEffect } from "react"

export default function ClickUpCallbackPage() {
    useEffect(() => {
        const handleAuth = async () => {
            // Extract token or code from URL
            const params = new URLSearchParams(window.location.search)
            console.log("🔗 Callback URL Params:", Object.fromEntries(params.entries()))

            let token = params.get("token") || params.get("access_token")
            const code = params.get("code")

            // If we only have a code, exchange it via our proxy
            if (!token && code) {
                console.log("🎟️ Code detected, exchanging for token via proxy...")
                try {
                    const res = await fetch(`/api/clickup/authorize?code=${code}`, {
                        headers: { "Accept": "application/json" }
                    })

                    const clone = res.clone()
                    const rawBody = await clone.text()
                    console.log("📡 CODE EXCHANGE RAW RESPONSE:", rawBody)

                    if (res.ok) {
                        const json = JSON.parse(rawBody)
                        token = json.data?.access_token || json.access_token || json.value
                    }
                } catch (e) {
                    console.error("❌ Failed to exchange code:", e)
                }
            }

            if (token) {
                console.log("🎯 ClickUp Token obtained!")
                console.log("📡 Full Callback Data:", token)

                // 1. Save to localStorage (The "Bridge" for Localhost)
                localStorage.setItem("clickup_active_token", token)
                // Save full response for debugging as requested by user
                localStorage.setItem("clickup_full_response", JSON.stringify({ token, code, source: "callback" }))

                // 2. Send back to opener (Standard way)
                if (window.opener) {
                    try {
                        window.opener.postMessage({
                            type: "CLICKUP_AUTH_SUCCESS",
                            token: token
                        }, "*")
                    } catch (e) {
                        console.warn("postMessage failed, relying on localStorage")
                    }

                    // Show success and close soon
                    setTimeout(() => {
                        window.close()
                    }, 1500)
                }
            }
        }

        handleAuth()
    }, [])

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white p-12 text-center">
            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                    <div className="relative z-10 w-24 h-24 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-blue-400">Authorization Successful</h2>
                    <p className="text-slate-400 font-medium">Connecting your ClickUp workspace to Vocaris...</p>
                </div>
                <div className="pt-4">
                    <p className="text-[10px] uppercase font-bold text-slate-600 tracking-widest">This window will close automatically</p>
                </div>
            </div>
        </div>
    )
}
