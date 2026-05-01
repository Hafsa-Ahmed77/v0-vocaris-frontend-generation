"use client"

import { motion } from "framer-motion"
import { LogIn, Mic, Eye, Zap } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: LogIn,
    title: "Sign In with Google",
    desc: "One-click Google authentication. Your account is secured with OAuth 2.0, and your refresh token lets the bot join meetings as you — bypassing waiting rooms.",
    gradient: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-500/20",
  },
  {
    number: "02",
    icon: Mic,
    title: "Voice Onboarding",
    desc: "Have a real-time voice conversation with our AI agent. Tell it about your role, projects, communication style, and priorities. Create separate profiles for each job.",
    gradient: "from-indigo-500 to-purple-500",
    shadow: "shadow-indigo-500/20",
  },
  {
    number: "03",
    icon: Eye,
    title: "Observer Mode",
    desc: "For the first 10 meetings per job, the bot joins silently. It listens, stores transcripts, and uses DSPy to extract behavioral insights — learning how you actually communicate.",
    gradient: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/20",
  },
  {
    number: "04",
    icon: Zap,
    title: "Active Mode",
    desc: "From meeting 11 onward, your AI twin takes over. It speaks with your vocabulary, enforces your deal-breakers, remembers past discussions, and gets smarter with every meeting.",
    gradient: "from-emerald-400 to-teal-500",
    shadow: "shadow-emerald-500/20",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 bg-white overflow-hidden">
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
            <Zap className="size-3.5 fill-current" />
            Four Stages
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-outfit font-black tracking-tight text-[#0A192F] mb-6">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9]">
              Vocaris
            </span>{" "}
            Works
          </h2>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            From sign-in to autonomous meeting participation — a seamless pipeline that learns and evolves.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical connector line (desktop) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-100 via-indigo-100 to-emerald-100 hidden lg:block rounded-full" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-16 items-center ${i > 0 ? "lg:mt-[-4rem]" : ""}`}
                >
                  {/* Connector node */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center z-20">
                    <motion.div 
                      whileHover={{ scale: 1.5 }}
                      className={`w-10 h-10 rounded-full bg-white border-4 border-white flex items-center justify-center shadow-lg ${step.shadow} cursor-pointer group`}
                    >
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${step.gradient} animate-pulse-glow`} />
                    </motion.div>
                  </div>

                  {/* Content card */}
                  <div className={`${isLeft ? "lg:col-start-1" : "lg:col-start-2"} ${!isLeft ? "lg:order-2" : ""}`}>
                    <div className={`group relative p-8 md:p-10 rounded-3xl bg-white border-2 border-transparent hover:border-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2`}>
                      <div className="flex items-center gap-5 mb-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg ${step.shadow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                          <step.icon className="size-8 text-white" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">
                            Phase {step.number}
                          </span>
                          <h3 className="text-2xl font-black text-[#0A192F] tracking-tight font-outfit">{step.title}</h3>
                        </div>
                      </div>

                      <p className="text-slate-600 text-[15px] leading-relaxed font-medium">{step.desc}</p>
                    </div>
                  </div>

                  {/* Empty column for zigzag layout */}
                  <div className={`hidden lg:block ${isLeft ? "lg:col-start-2" : "lg:col-start-1 lg:order-1"}`} />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
