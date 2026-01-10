"use client"

import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { useState } from "react"

interface GoogleSignInButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
}

export function GoogleSignInButton({
  className,
  variant = "default",
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false)

  function handleSignIn() {
    setLoading(true)
    // 🔑 Start Google OAuth
    window.location.href =
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google?redirect_url=${window.location.origin}/auth/callback`
  }

  return (
    <Button
      className={className}
      variant={variant}
      onClick={handleSignIn}
      disabled={loading}
      aria-busy={loading}
      aria-label="Sign in with Google"
    >
      <span className="mr-2 inline-flex">
        <FcGoogle size={18} />
      </span>
      {loading ? "Connecting…" : "Continue with Google"}
    </Button>
  )
}
