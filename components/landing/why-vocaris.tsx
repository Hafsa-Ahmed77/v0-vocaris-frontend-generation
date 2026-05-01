"use client"

import { motion } from "framer-motion"
import { Fingerprint, RefreshCw, UserCheck, Layers } from "lucide-react"

const differentiators = [
  {
    icon: Fingerprint,
    title: "Not a Note-Taker — A Digital Twin",
    desc: "Other meeting bots record and summarize. Vocaris actually speaks as you. It uses your vocabulary, enforces your priorities, and defends your constraints — even under pressure from other participants.",
    stat: "Identity-Accurate",
    gradient: "from-blue-600 to-indigo-600",
    shadow: "shadow-blue-500/30",
  },
  {
    icon: RefreshCw,
    title: "Continuous Behavioral Refinement",
    desc: "The agent doesn't plateau after setup. After meeting 10, the DSPy pipeline re-synthesizes your behavioral profile after every subsequent meeting. The more it observes, the more precisely it becomes you.",
    stat: "Always Improving",
    gradient: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/30",
  },
  {
    icon: UserCheck,
    title: "Learns from Real Meetings",
    desc: "Your persona isn't built from what you tell us about yourself — it's extracted from how you actually behave in real meetings. Logic priorities, approval thresholds, deal-breakers — all observed, not self-reported.",
    stat: "Observed Behavior",
    gradient: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/30",
  },
  {
    icon: Layers,
    title: "Per-Job Intelligence",
    desc: "Your tone as a lead engineer at Google is different from your freelance consulting voice. Each job has its own independent learning pipeline, observer insights, persona, and meeting history.",
    stat: "Multi-Persona",
    gradient: "from-emerald-400 to-teal-500",
    shadow: "shadow-emerald-500/30",
  },
]

export function WhyVocaris() {
  return (
    <section className="relative py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-[11px] font-bold uppercase tracking-widest text-blue-800 mb-6 shadow-sm">
            <Fingerprint className="size-3.5" />
            Differentiators
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-outfit font-black tracking-tight text-[#0A192F] mb-6">
            Why{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9]">
              Vocaris
            </span>
          </h2>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            The only meeting agent that doesn't just listen — it becomes you.
          </p>
        </motion.div>

        {/* Differentiator cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {differentiators.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-8 md:p-10 rounded-3xl bg-[#FAFBFC] border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Subtle gradient glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
              
              <div className="flex items-start gap-6 relative z-10">
                <div className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg ${item.shadow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <item.icon className="size-8 text-white" />
                </div>

                <div className="space-y-4 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-2xl font-bold text-[#0A192F] tracking-tight font-outfit">{item.title}</h3>
                    <span className="px-3 py-1 rounded-full bg-white text-slate-600 text-[10px] font-bold uppercase tracking-widest border border-slate-200 shadow-sm group-hover:border-blue-200 group-hover:text-blue-700 transition-colors">
                      {item.stat}
                    </span>
                  </div>
                  <p className="text-base text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
