"use client"

import { motion } from "framer-motion"
import {
  Brain,
  Mic,
  Briefcase,
  Calendar,
  ListChecks,
  Search,
  Link2,
  ShieldCheck,
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "DSPy Behavioral Learning",
    desc: "A structured AI pipeline extracts communication style, priorities, jargon, and deal-breakers from your real meeting transcripts.",
    highlight: "Core AI",
    color: "from-blue-600 to-indigo-600",
    shadow: "shadow-blue-500/30",
  },
  {
    icon: Mic,
    title: "Voice Onboarding",
    desc: "Talk to a real-time voice AI agent about your role, projects, and work style with sub-second latency.",
    highlight: "Real-time",
    color: "from-cyan-500 to-blue-500",
    shadow: "shadow-cyan-500/30",
  },
  {
    icon: Briefcase,
    title: "Multi-Job Support",
    desc: "Freelancer and full-time engineer? Each job gets its own onboarding, observer phase, and adapted persona.",
    highlight: "Per-Job",
    color: "from-indigo-500 to-purple-500",
    shadow: "shadow-indigo-500/30",
  },
  {
    icon: Calendar,
    title: "Calendar Auto-Join",
    desc: "Connect Google Calendar once. Vocaris scans for meetings every 2 minutes and auto-joins them automatically.",
    highlight: "Zero Effort",
    color: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/30",
  },
  {
    icon: ListChecks,
    title: "Scrum Standup Mode",
    desc: "Activate scrum mode and the bot categorizes every update as Done, In-Progress, or Blocked in real-time.",
    highlight: "Agile",
    color: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/30",
  },
  {
    icon: Search,
    title: "RAG Meeting Memory",
    desc: "Every transcript is embedded and stored. Query any past meeting with natural language.",
    highlight: "Semantic",
    color: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/30",
  },
  {
    icon: Link2,
    title: "ClickUp Integration",
    desc: "Push meeting summaries and scrum outputs directly to your ClickUp workspace as trackable tickets.",
    highlight: "Workflow",
    color: "from-sky-500 to-blue-500",
    shadow: "shadow-sky-500/30",
  },
  {
    icon: ShieldCheck,
    title: "Smart Auto-Leave",
    desc: "Three-layer safeguard ensures the bot only leaves when the room is genuinely empty for 5 minutes.",
    highlight: "Reliable",
    color: "from-rose-500 to-red-500",
    shadow: "shadow-rose-500/30",
  },
]

export function Features() {
  return (
    <section id="features" className="relative py-32 bg-[#FAFBFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-[11px] font-bold uppercase tracking-widest text-blue-800 mb-6 shadow-sm">
            <Brain className="size-3.5" />
            Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-outfit font-black tracking-tight text-[#0A192F] mb-6">
            Built for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9]">
              Intelligence
            </span>
          </h2>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Every feature is engineered to make your AI agent smarter, faster, and more authentically you.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-default"
            >
              {/* Vibrant gradient background that reveals on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                {/* Highlight badge */}
                <div className="absolute top-0 right-0 px-3 py-1 rounded-full bg-slate-100 group-hover:bg-white/20 text-slate-500 group-hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors duration-300">
                  {feature.highlight}
                </div>

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg ${feature.shadow} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-white/20 transition-all duration-300`}>
                  <feature.icon className="size-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-[#0A192F] group-hover:text-white mb-3 tracking-tight font-outfit transition-colors duration-300">{feature.title}</h3>
                <p className="text-[14px] text-slate-600 group-hover:text-white/90 leading-relaxed font-medium transition-colors duration-300">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
