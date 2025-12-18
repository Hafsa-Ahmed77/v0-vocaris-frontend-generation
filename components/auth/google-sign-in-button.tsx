"use client"

import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signIn } from "next-auth/react";


interface GoogleSignInButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
}

export function GoogleSignInButton({ className, variant = "default" }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignIn() {
  try {
    setLoading(true);
    await signIn("google", { callbackUrl: "/onboarding-chat" });
  } catch (error) {
    console.error("Sign-in error:", error);
    toast.error("Failed to sign in. Please try again.");
  } finally {
    setLoading(false);
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
