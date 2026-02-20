"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"
import { SiteHeader } from "@/components/site-header"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()


  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative selection:bg-blue-500/30">

      {/* Background Gradients & Blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-700" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] z-0 pointer-events-none" />

      {/* Header */}
      <div className="relative z-50">
        <SiteHeader />
      </div>

      <main className="relative z-10 flex min-h-[calc(100vh-64px)]">

        {/* Left Section: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-sm"
          >
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-slate-400">
                Sign in to continue your intelligent meeting experience.
              </p>
            </div>

            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-200">
                  Authentication
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Connect securely with your Google account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <GoogleSignInButton className="w-full h-12 bg-white text-slate-900 hover:bg-slate-200 transition-all duration-300 font-semibold" />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-900 px-2 text-slate-500">
                      Secure Access
                    </span>
                  </div>
                </div>

                <p className="text-center text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                  By continuing, you agree to our <a href="#" className="underline hover:text-blue-400 transition-colors">Terms</a> and <a href="#" className="underline hover:text-blue-400 transition-colors">Privacy Policy</a>.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Section: Visuals / Waves */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-900/20 to-slate-900 border-l border-slate-800 items-center justify-center relative overflow-hidden">

          {/* Animated Waves */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute w-[800px] h-[800px] border border-blue-500/20 rounded-[40%]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute w-[700px] h-[700px] border border-indigo-500/20 rounded-[35%]"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
              className="absolute w-[600px] h-[600px] border border-purple-500/20 rounded-[45%]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 text-center p-12 max-w-lg"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20 rotate-3 hover:rotate-6 transition-transform duration-500">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">Join the future of meetings</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Vocaris transforms your voice conversations into actionable insights with real-time AI analysis.
            </p>
          </motion.div>

        </div>

      </main>
    </div>
  )
}
