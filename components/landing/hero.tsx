"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />

      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:py-32 w-full">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 w-fit"
            >
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">AI-Powered Meeting Intelligence</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl lg:text-6xl font-bold leading-tight text-balance"
            >
              Your AI Meeting Partner for <span className="gradient-text">Seamless Collaboration</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl text-muted-foreground max-w-lg"
            >
              Automate your meetings, summarize insights, and stay effortlessly productive. Vocaris joins, transcribes,
              and empowers your team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-white shadow-lg transition-all"
              >
                <Link href="/auth" className="flex items-center gap-2">
                  Start Free with Google
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 hover:bg-slate-50 dark:hover:bg-slate-900 bg-transparent"
              >
                <Link href="#how-it-works">Watch Demo</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column — Robot Illustration */}
{/* Robot Listening Animation */}
<motion.div
  className="relative flex justify-center items-center"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8, delay: 0.4 }}
>
  {/* Pulsing Rings */}
  <motion.div
    className="absolute rounded-full border border-cyan-400/40"
    style={{ width: 420, height: 420 }}
    animate={{
      scale: [1, 1.3, 1],
      opacity: [0.6, 0.2, 0.6],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
  <motion.div
    className="absolute rounded-full border border-blue-400/30"
    style={{ width: 480, height: 480 }}
    animate={{
      scale: [1.1, 1.4, 1.1],
      opacity: [0.3, 0.1, 0.3],
    }}
    transition={{
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  {/* Robot Image */}
  <motion.img
    src="/robot-ai.png"
    alt="AI Voice Assistant Robot"
    className="relative w-[400px] md:w-[480px] drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]"
    animate={{
      y: [0, -12, 0],
      filter: [
        "drop-shadow(0 0 15px rgba(59,130,246,0.4))",
        "drop-shadow(0 0 25px rgba(59,130,246,0.7))",
        "drop-shadow(0 0 15px rgba(59,130,246,0.4))",
      ],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
</motion.div>


        </div>
      </div>
    </section>
  )
}
