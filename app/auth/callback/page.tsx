"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { setAuthCookie } from "@/lib/auth-cookies"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const token = params.get("token")

    if (!token) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      router.replace("/auth")
      return
    }

    // Save token for both client and server access
    localStorage.setItem("token", token)
    setAuthCookie(token)

    // 🔐 Fetch user info using proxy
    fetch(`/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized")
        return res.json()
      })
      .then(async (user) => {
        localStorage.setItem("user", JSON.stringify(user))

        // 🧠 Smart Redirection Logic: Check if they are a returning user
        console.log(`[AuthCallback] Checking onboarding status for ${user.email}...`)
        
        try {
          const { checkOnboardingStatus } = await import("@/lib/api")
          const isOnboarded = await checkOnboardingStatus()

          if (isOnboarded) {
            console.log("[AuthCallback] User has history/contexts. Routing to Dashboard.")
            router.replace("/dashboard")
          } else {
            console.log("[AuthCallback] New user. Routing to Onboarding Conversation.")
            router.replace("/onboarding-conversation")
          }
        } catch (err) {
          console.error("[AuthCallback] Error checking status, falling back to onboarding:", err)
          router.replace("/onboarding-conversation")
        }
      })
      .catch((err) => {
        console.error("[AuthCallback] Auth failed:", err)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.replace("/auth")
      })
  }, [params, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex items-center justify-center mb-8">
          {/* Outer rotating rings */}
          <div className="absolute w-20 h-20 border-t-2 border-r-2 border-blue-500/30 rounded-full animate-spin" />
          <div className="absolute w-16 h-16 border-b-2 border-l-2 border-cyan-400/50 rounded-full animate-[spin_2s_linear_reverse]" />
          
          {/* Inner core pulse */}
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-500/30">
            <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse" />
          </div>
        </div>
        
        <h2 className="text-xl font-black text-white tracking-widest uppercase mb-3">Authenticating</h2>
        
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
