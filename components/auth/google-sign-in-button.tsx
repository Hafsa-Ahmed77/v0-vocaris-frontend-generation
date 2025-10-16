"use client"

import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { useState } from "react"
import { signInWithGoogle } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface GoogleSignInButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
}

export function GoogleSignInButton({ className, variant = "default" }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignIn() {
    try {
      setLoading(true)
      await signInWithGoogle()
      // TODO: Replace with actual redirect after Supabase integration
      toast.success("Signed in successfully!")
      router.push("/onboarding-chat")
    } catch (error) {
      console.error("[v0] Sign-in error:", error)
      toast.error("Failed to sign in. Please try again.")
    } finally {
      setLoading(false)
    }
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
