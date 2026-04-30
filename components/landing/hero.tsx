"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Waves, Zap, Play } from "lucide-react"

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
    <section className="relative min-h-screen flex items-center justify-center bg-transparent overflow-hidden">
      {/* Massive Sound Wave Background (Overlayed) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10 pointer-events-none z-10">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              height: [20, 100 + Math.random() * 400, 20],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
            className="w-1 mx-0.5 bg-blue-400 dark:bg-blue-500 rounded-full"
          />
        ))}
      </div>

      {/* Decorative Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/5 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="container relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center px-4 lg:px-6 py-28 lg:py-0">
        {/* Text Content */}
        <div className="space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1">
          <div className="space-y-4 lg:space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="inline-flex items-center gap-2 px-3 lg:px-4 py-1 lg:py-1.5 rounded-full bg-white/5 dark:bg-blue-500/10 border border-slate-200/50 dark:border-blue-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_20px_rgba(59,130,246,0.2)] mx-auto lg:mx-0"
            >
              <Sparkles className="size-3 lg:size-4 text-blue-600 dark:text-cyan-400 animate-pulse" />
              <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] text-slate-600 dark:text-cyan-400/80">The Next Evolution</span>
            </motion.div>
            
            <motion.h1 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-8xl lg:text-[110px] font-black tracking-tighter leading-[0.9] lg:leading-[0.85] uppercase text-slate-900 dark:text-white"
            >
              Vocal <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 drop-shadow-sm">
                Command.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-slate-600 dark:text-slate-400 text-base md:text-xl font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Your voice, scaled by intelligence. Automate your meetings, summarize insights, and stay effortlessly productive.
            </motion.p>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <Button 
              size="lg"
              disabled={isCheckingStatus}
              onClick={handleStart}
              className="h-14 lg:h-16 px-10 lg:px-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 group w-full sm:w-auto"
            >
              {isCheckingStatus ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Synchronizing...
                </span>
              ) : (
                <>
                  Start Free with Google
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </motion.div>
        </div>

        {/* Robot Hero Image */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
          className="relative order-1 lg:order-2 flex justify-center items-center"
        >
          {/* Main Glow */}
          <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />
          
          {/* Pulsing Rings */}
          <motion.div
            className="absolute rounded-full border border-blue-400/20 dark:border-blue-400/30 pointer-events-none"
            style={{ width: '100%', aspectRatio: '1/1', maxWidth: 500 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <img 
            src="/robot-ai.png" 
            alt="Vocaris AI Robot Assistant" 
            className="relative z-10 w-full max-w-[260px] md:max-w-[450px] lg:max-w-[550px] mx-auto drop-shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all hover:scale-[1.02] duration-700"
          />
          
          {/* Floating Tech Badges */}
          <motion.div 
            animate={{ y: [0, -10, 0], rotate: [12, 15, 12] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 lg:top-10 lg:right-10 p-2 lg:p-4 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-xl lg:rounded-2xl shadow-2xl z-20"
          >
            <Zap className="size-4 lg:size-6 text-yellow-500 dark:text-yellow-400" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0], rotate: [-8, -5, -8] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-0 left-0 lg:bottom-10 lg:left-10 p-2 lg:p-4 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-xl lg:rounded-2xl shadow-2xl z-20"
          >
            <Sparkles className="size-4 lg:size-6 text-blue-500 dark:text-cyan-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
