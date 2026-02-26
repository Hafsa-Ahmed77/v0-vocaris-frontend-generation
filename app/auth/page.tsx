"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"
import { SiteHeader } from "@/components/site-header"
import { ShieldCheck, Zap, MessageSquare, BarChart3, ArrowRight, CheckCircle, Clock } from "lucide-react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function AuthPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative selection:bg-blue-500/30 font-sans">

      {/* Background Ambience - Lighter System */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(15,23,42,1)_0%,rgba(2,6,23,1)_100%)] opacity-80" />
      </div>

      {/* Header */}
      <div className="relative z-50">
        <SiteHeader />
      </div>

      <main className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col lg:flex-row">

        {/* Left Section: Auth Interface */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 xl:p-24">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            <div className="text-center lg:text-left mb-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 mx-auto lg:mx-0">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Enterprise Grade Security</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none bg-gradient-to-br from-white via-white to-slate-500 bg-clip-text text-transparent">
                The Core of <br />
                Intelligence.
              </h1>
              <p className="text-slate-400 font-medium text-lg max-w-xs mx-auto lg:mx-0">
                Sign in to your intelligent meeting architect.
              </p>
            </div>

            <div className="relative group">
              {/* Subtle Gradient Glow */}
              <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-blue-500/20 via-transparent to-indigo-500/20 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <Card className="relative border border-white/5 bg-slate-900/40 backdrop-blur-3xl shadow-2xl rounded-[1.9rem] overflow-hidden">
                <CardHeader className="pt-10 pb-4 px-8">
                  <CardTitle className="text-2xl font-black text-white tracking-tight">
                    Welcome back
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-medium">
                    Authenticate to enter your workspace securely.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8 pb-12 px-8">
                  <GoogleSignInButton className="w-full h-14 bg-white text-slate-950 hover:bg-slate-100 transition-all duration-300 font-black rounded-2xl shadow-xl shadow-black/20 flex items-center justify-center gap-3 border-none text-[11px] uppercase tracking-[0.1em]" />

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/5" />
                    </div>
                    <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-black">
                      <span className="bg-slate-900/80 px-4 text-slate-500">Secure Protocol</span>
                    </div>
                  </div>

                  <p className="text-center text-[10px] text-slate-500 font-bold leading-relaxed max-w-[240px] mx-auto">
                    By continuing, you agree to our
                    <a href="#" className="text-white hover:text-blue-400 ml-1 transition-colors underline underline-offset-4 decoration-white/10">Terms</a> and
                    <a href="#" className="text-white hover:text-blue-400 ml-1 transition-colors underline underline-offset-4 decoration-white/10">Privacy Pact</a>.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Right Section: Feature Showcase - Lighter & Balanced */}
        <div className="hidden lg:flex flex-1 bg-slate-950/40 border-l border-white/5 items-center justify-center relative p-12 overflow-hidden">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />

          <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
            <div className="grid grid-cols-2 gap-8 relative w-full">

              {/* Card 1 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl shadow-2xl space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Real-time Data</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-bold">Metrics extracted from live voice streams instantly.</p>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl shadow-2xl space-y-4 mt-12"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Semantic Intel</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-bold">Deep understanding of context, tone, and strategic intent.</p>
                </div>
              </motion.div>

              {/* Center Mockup - Auto Tasks */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 z-20"
              >
                <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.1)] space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-400 fill-blue-400" />
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Auto-Manifest</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 uppercase tracking-widest">Active</div>
                  </div>

                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="w-4 h-4 rounded-md bg-blue-500 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <div className="h-2 w-24 bg-white/10 rounded-full" />
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-1.5 font-bold text-[9px] text-slate-500 uppercase">
                      <Clock className="w-3 h-3" /> Updated 2s ago
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Tagline */}
            <div className="mt-48 text-center max-w-sm space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-2">Protocol Architecture v4.2</p>
              <h2 className="text-2xl font-black text-white italic tracking-tight">"The intelligence layer for high-performing teams."</h2>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
