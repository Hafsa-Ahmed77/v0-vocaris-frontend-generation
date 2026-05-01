"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import dynamic from "next/dynamic"

const HeroScene = dynamic(
  () => import("@/components/landing/hero-scene").then((mod) => mod.HeroScene),
  { ssr: false }
)

export function Hero() {
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

  const handleStart = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    if (!token) {
      setIsCheckingStatus(true)
      window.location.href = "/auth"
      return
    }

    try {
      setIsCheckingStatus(true)
      const { checkOnboardingStatus } = await import("@/lib/api")
      const isOnboarded = await checkOnboardingStatus()

      if (isOnboarded) {
        window.location.href = "/dashboard"
      } else {
        window.location.href = "/onboarding-conversation"
      }
    } catch (err) {
      console.error("Failed to route user:", err)
      window.location.href = "/dashboard"
    }
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAFBFC] pt-20">
      {/* 3D Interactive Background Scene */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* Soft overlay to ensure text readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/40 via-transparent to-white/80 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/60 shadow-sm mb-8"
        >
          <Sparkles className="size-4 text-blue-600 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-blue-800">
            AI-Powered Meeting Intelligence
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-outfit font-black tracking-tight leading-[1.05] mb-6 text-[#0A192F]"
        >
          Your AI Digital Twin
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#0EA5E9]">
            for Meetings
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          Vocaris joins your Google Meet meetings, learns how you communicate,
          and speaks on your behalf — with your voice, your priorities, and
          your personality.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Button
            size="lg"
            disabled={isCheckingStatus}
            onClick={handleStart}
            className="h-14 px-10 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-full font-bold tracking-wide shadow-[0_8px_25px_rgba(30,58,138,0.25)] transition-all hover:shadow-[0_12px_35px_rgba(30,58,138,0.35)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 group"
          >
            {isCheckingStatus ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </span>
            ) : (
              <>
                Get Started with Google
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>

          <a
            href="#how-it-works"
            className="h-14 px-10 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-[#1E3A8A] font-bold tracking-wide shadow-sm hover:shadow-md transition-all hover:-translate-y-1 active:translate-y-0"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-500 font-bold uppercase tracking-wider"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            Powered by Google OAuth
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            Real-time Voice AI
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            DSPy Behavioral Learning
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-slate-300 flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-2.5 rounded-full bg-[#1E3A8A]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
