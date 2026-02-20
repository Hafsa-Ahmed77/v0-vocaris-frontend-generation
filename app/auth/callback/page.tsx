"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

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

    // Save token in localStorage (dev only)
    localStorage.setItem("token", token)

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
      .then((user) => {
        localStorage.setItem("user", JSON.stringify(user))

        // Always redirect to onboarding selection as per user request
        console.log(`[AuthCallback] User: ${user.email} authenticated. Routing to onboarding selection.`)
        router.replace("/onboarding-selection")
      })
      .catch(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.replace("/auth")
      })
  }, [params, router])

  return <p>Logging in…</p>
}
