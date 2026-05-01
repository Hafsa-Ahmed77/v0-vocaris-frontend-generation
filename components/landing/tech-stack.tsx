"use client"

import { motion } from "framer-motion"
import { Cpu } from "lucide-react"

const techCategories = [
  {
    label: "AI & LLMs",
    gradient: "from-blue-600 to-indigo-600",
    items: [
      { name: "Groq / LLaMA 3.3-70B", role: "Primary LLM" },
      { name: "DSPy + LiteLLM", role: "Behavioral Pipeline" },
      { name: "OpenAI Embeddings", role: "Semantic Search" },
    ],
  },
  {
    label: "Voice & Audio",
    gradient: "from-cyan-500 to-blue-500",
    items: [
      { name: "Deepgram", role: "Speech-to-Text" },
      { name: "ElevenLabs", role: "Text-to-Speech" },
      { name: "Recall.ai", role: "Meeting Bot Infrastructure" },
    ],
  },
  {
    label: "Backend & Data",
    gradient: "from-purple-500 to-pink-500",
    items: [
      { name: "FastAPI", role: "Async Python API" },
      { name: "Supabase", role: "PostgreSQL Database" },
      { name: "Pinecone", role: "Vector Database (RAG)" },
    ],
  },
  {
    label: "Auth & Integration",
    gradient: "from-emerald-400 to-teal-500",
    items: [
      { name: "Google OAuth 2.0", role: "Authentication" },
      { name: "Google Calendar API", role: "Auto-Join" },
      { name: "ClickUp API", role: "Task Management" },
    ],
  },
]

export function TechStack() {
  return (
    <section className="relative py-32 bg-[#FAFBFC] overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]" />
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-[11px] font-bold uppercase tracking-widest text-blue-800 mb-6 shadow-sm">
            <Cpu className="size-3.5" />
            Infrastructure
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-outfit font-black tracking-tight text-[#0A192F] mb-6">
            Powered by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9]">
              Cutting-Edge AI
            </span>
          </h2>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            A carefully architected stack combining the best AI services for voice, language, and memory.
          </p>
        </motion.div>

        {/* Tech grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {techCategories.map((category, ci) => (
            <motion.div
              key={category.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: ci * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Animated top border */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${category.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />

              <h3 className={`text-[12px] font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${category.gradient} mb-8 pb-4 border-b border-slate-100 group-hover:border-transparent transition-colors`}>
                {category.label}
              </h3>

              <div className="space-y-6">
                {category.items.map((item, ii) => (
                  <div key={ii} className="space-y-1.5 transform group-hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: `${ii * 50}ms` }}>
                    <p className="text-base font-bold text-[#0A192F] font-outfit">{item.name}</p>
                    <p className="text-[13px] text-slate-500 font-medium">{item.role}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.5 }}
          className="mt-20 flex flex-wrap justify-center gap-4"
        >
          {[
            "Async-First Architecture",
            "Singleton Service Pattern",
            "Real-time WebSocket",
            "Hybrid RAG Chunking",
            "Graceful Degradation",
          ].map((badge) => (
            <span
              key={badge}
              className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-xs text-slate-600 font-bold tracking-wider shadow-sm hover:border-blue-300 hover:text-[#1E3A8A] hover:-translate-y-1 transition-all cursor-default"
            >
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
