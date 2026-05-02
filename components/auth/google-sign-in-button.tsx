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
      <img
        src="https://www.google.com/favicon.ico"
        className={`size-5 sm:size-6 transition-all ${loading ? "" : "grayscale group-hover:grayscale-0"}`}
        alt="Google"
      />
      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-600">
        {loading ? "Connecting…" : "Google Workspace Sync"}
      </span>
    </Button>
  )
}
