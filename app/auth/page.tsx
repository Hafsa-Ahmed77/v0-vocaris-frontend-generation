"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"
import { DemoSignInButton } from "@/components/auth/demo-sign-in-button"
import Link from "next/link"

export default function AuthPage() {
  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Logo/Branding */}
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text">Vocaris</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your intelligent meeting partner for seamless conversation
          </p>
        </div>

        {/* Sign-in Card */}
        <Card className="rounded-2xl border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Sign in to Vocaris</CardTitle>
            <CardDescription>
              AI-powered meeting assistant for seamless collaboration and smart insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <GoogleSignInButton className="w-full" />
              <DemoSignInButton className="w-full" />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="#" className="underline hover:text-foreground">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
              .
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/auth" className="font-medium text-secondary hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
