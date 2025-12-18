"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"
import {SiteHeader} from "@/components/site-header"


export default function AuthPage() {
  return (
    <div className="relative flex flex-col min-h-screen  bg-gradient-to-b
        from-blue-100
        via-white
        to-blue-200

">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_70%)]

" />

      {/* Header */}
      <SiteHeader />

      {/* Main content */}
      <main className="flex-1 grid place-items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-6"
        >
      
          {/* Sign-in / Sign-up Card */}
          <Card className="rounded-2xl border bg-white/12
border-white/15
backdrop-blur-xl
shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]

">
  
            <CardHeader className="text-center space-y-2">
  <CardTitle
  className="
    text-2xl font-bold
    bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500
    bg-clip-text text-transparent
  "
>
  Create your account
</CardTitle>
</CardHeader>

            <CardContent className="space-y-5">
  <GoogleSignInButton className="w-full h-11" />


              {/* Terms */}
              <p className="text-center text-xs text-slate-900 font-medium">
                By continuing, you agree to our{" "}
                <a href="#" className="underline hover:text-white">Terms of Service</a> and{" "}
                <a href="#" className="underline hover:text-white">Privacy Policy</a>.
              </p>
            </CardContent>
          </Card>

          {/* Footer info */}
          <p className="text-center text-sm text-blue-800 font-semibold">
            Already have a Google account? Just click "Continue with Google" to sign in.
          </p>
        </motion.div>
      </main>

    </div>
  )
}
