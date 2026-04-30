"use client"

import { motion } from "framer-motion"
import {
  LogIn,
  ClipboardList,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot
} from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  {
    id: "01",
    icon: LogIn,
    title: "Secure Access",
    desc: "Experience seamless entry with Google authentication. Your workspace is encrypted and protected from the first click.",
    color: "from-blue-600 to-cyan-500"
  },
  {
    id: "02",
    icon: ClipboardList,
    title: "AI Onboarding",
    desc: "Initialize your engine. Set up via an interactive AI voice conversation or a structured form tailored to your workflow.",
    color: "from-indigo-600 to-blue-600"
  },
  {
    id: "03",
    icon: LayoutDashboard,
    title: "Command Center",
    desc: "Control your entire meeting ecosystem. Unified dashboard for scheduling, tracking, and instant AI bot deployment.",
    color: "from-purple-600 to-indigo-600"
  },
  {
    id: "04",
    icon: Sparkles,
    title: "Intelligence Flow",
    desc: "The magic happens. Real-time transcription, automated Scrum ticket generation, and deep-context AI analysis.",
    color: "from-cyan-600 to-blue-500"
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden bg-transparent transition-colors duration-500">
      {/* Dynamic Background Atmospheric Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-600/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <header className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black tracking-[0.3em] uppercase italic mb-6 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Seamless Intelligence
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-black mb-8 text-slate-900 dark:text-white tracking-tighter italic"
          >
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">Vocaris</span> Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Our engine synchronizes your meetings with your workflow in four high-performance stages.
          </motion.p>
        </header>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connector Line (Desktop Only) */}
          <div className="absolute top-[108px] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-200 dark:via-blue-500/20 to-transparent hidden lg:block" />

          <div className="grid gap-12 lg:grid-cols-4 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.7 }}
                className="group relative"
              >
                {/* Visual Connector Ball (Desktop Only) */}
                <div className="absolute top-[108px] left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    className="w-4 h-4 rounded-full bg-blue-500 blur-sm shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  />
                </div>

                {/* Card Container */}
                <div className="relative p-10 rounded-[3rem] bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-xl group-hover:bg-white dark:group-hover:bg-white/[0.04] group-hover:border-blue-500/30 group-hover:shadow-2xl group-hover:shadow-blue-500/10 transition-all duration-500 group-hover:-translate-y-3">
                  {/* Step ID Bubble */}
                  <div className="absolute -top-4 left-10 px-4 py-1 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-[10px] font-black tracking-[0.2em] text-blue-600 dark:text-blue-400 italic shadow-sm">
                    PHASE {step.id}
                  </div>

                  <div className="space-y-8">
                    {/* Icon Core */}
                    <div className={cn(
                      "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-xl relative",
                      step.color
                    )}>
                      <step.icon className="w-8 h-8 relative z-10" />
                      <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight leading-none">
                        {step.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-bold">
                        {step.desc}
                      </p>
                    </div>

                    {/* Interactive Badge */}
                    <div className="pt-4 flex items-center gap-2 pointer-events-none">
                      {index === steps.length - 1 ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-black tracking-widest uppercase shadow-inner">
                          <Bot className="w-3 h-3" /> System Live
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-200/50 dark:bg-white/5 text-slate-500 text-[10px] font-black tracking-widest uppercase group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                          Stage Pass <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ambient Glow behind card (Dark Mode only effectively) */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-cyan-600/5 blur-[60px] transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
