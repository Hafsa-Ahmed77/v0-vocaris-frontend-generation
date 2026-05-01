"use client"

import { motion } from "framer-motion"
import { Clock, Brain, Mic, ArrowRight } from "lucide-react"

const problems = [
  {
    icon: Clock,
    label: "8+ hours/week in meetings",
    desc: "The average professional spends more time in meetings than doing actual work.",
  },
  {
    icon: Brain,
    label: "Context switches kill focus",
    desc: "Jumping between meetings fragments your deep work into useless 20-minute gaps.",
  },
  {
    icon: Mic,
    label: "You can't skip — they need YOU",
    desc: "Note-takers and recorders miss the point. Your team needs your voice, your decisions, your presence.",
  },
]

export function WhatIsVocaris() {
  return (
    <section className="relative py-32 bg-white overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-bold uppercase tracking-widest text-blue-700 mb-6">
            <Brain className="size-3.5" />
            The Problem We Solve
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-outfit font-black tracking-tight text-[#0A192F] mb-6">
            Meetings Drain Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9]">
              Best Hours
            </span>
          </h2>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            You built your career on expertise — not on sitting in virtual rooms repeating the same updates.
          </p>
        </motion.div>

        {/* Problem cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {problems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="p-8 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-6">
                <item.icon className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0A192F] mb-3 font-outfit">{item.label}</h3>
              <p className="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Solution block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-10 md:p-16 rounded-[2.5rem] bg-[#0A192F] overflow-hidden text-white shadow-2xl"
        >
          {/* Internal dark background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full" />

          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Vocaris AI Agent
              </div>

              <h3 className="text-4xl md:text-5xl font-outfit font-black tracking-tight leading-[1.1]">
                An AI that <span className="text-blue-400">speaks as you</span> — not just for you
              </h3>

              <p className="text-slate-300 text-lg leading-relaxed font-medium">
                Vocaris doesn't just take notes. It joins your Google Meet meetings, observes how you communicate across 10 real meetings, then builds a precise behavioral profile.
              </p>

              <ul className="space-y-4 text-base text-slate-300 font-medium">
                {[
                  "Learns from real meetings, not descriptions",
                  "Speaks with your actual vocabulary and tone",
                  "Defends your deal-breakers under pressure",
                  "Remembers the last 5 meetings for context",
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-start gap-4"
                  >
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Visual: Observer → Active mode */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="p-8 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-md"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Mic className="size-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Meetings 1–10</p>
                    <p className="text-lg font-bold text-white font-outfit">Observer Mode</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-medium mb-6">
                  Joins silently. Listens. Learns your communication patterns, priorities, jargon, and decision-making style.
                </p>
                <div className="flex gap-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex-1 h-1.5 rounded-full bg-amber-500/30" />
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="p-8 rounded-3xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-md relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 animate-shimmer" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Brain className="size-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Meeting 11+</p>
                      <p className="text-lg font-bold text-white font-outfit">Active Mode</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium mb-6">
                    Speaks as you. Responds in real-time with your voice, priorities, and personality.
                  </p>
                  <div className="flex gap-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex-1 h-1.5 rounded-full bg-blue-500/40" />
                    ))}
                    <div className="flex-1 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)] animate-pulse" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
