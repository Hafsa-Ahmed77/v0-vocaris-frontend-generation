"use client"

import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { useState } from "react"
import { signInWithDemo } from "@/lib/auth"
import { toast } from "sonner"

interface DemoSignInButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
}

export function DemoSignInButton({ className, variant = "outline" }: DemoSignInButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleDemoSignIn() {
    try {
      setLoading(true)
      await signInWithDemo()
    } catch (error) {
      console.error("[v0] Demo sign-in error:", error)
      toast.error("Failed to sign in with demo account. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Button
      className={className}
      variant={variant}
      onClick={handleDemoSignIn}
      disabled={loading}
      aria-busy={loading}
      aria-label="Sign in with demo account"
    >
      <span className="mr-2 inline-flex">
        <Zap size={18} />
      </span>
      {loading ? "Connecting…" : "Try Demo"}
    </Button>
  )
}
