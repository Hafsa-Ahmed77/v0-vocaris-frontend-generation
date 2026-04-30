"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { setAuthCookie } from "@/lib/auth-cookies"
import { PremiumLoader } from "@/components/ui/premium-loader"

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

  return <PremiumLoader message="Initializing Dashboard" subtext="Finalizing Authentication" />
}
