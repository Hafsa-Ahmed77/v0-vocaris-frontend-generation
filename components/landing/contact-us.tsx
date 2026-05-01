"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Send, Sparkles, Globe, Linkedin } from "lucide-react"

export function ContactUs() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [formState, setFormState] = useState({ name: "", email: "", company: "", message: "" })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1500))
      setSent(true)
      setFormState({ name: "", email: "", company: "", message: "" })
      setTimeout(() => setSent(false), 4000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400 mb-6">
            <Sparkles className="size-3.5" />
            Get in Touch
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
            Let's{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Connect
            </span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Ready to reclaim your meeting hours? Reach out and let's discuss how Vocaris can work for your team.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Contact details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
              <h3 className="text-2xl font-black text-white tracking-tight mb-10">Contact Information</h3>

              <div className="space-y-8">
                {[
                  { icon: Mail, label: "Email", value: "hello@vocaris.ai", href: "mailto:hello@vocaris.ai", color: "text-blue-400" },
                  { icon: Linkedin, label: "LinkedIn", value: "Vocaris AI", href: "https://www.linkedin.com/company/108648938", color: "text-cyan-400" },
                  { icon: Globe, label: "Website", value: "vocaris.live", href: "https://vocaris.live", color: "text-indigo-400" }
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-5 group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center ${item.color} transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500/30`}>
                      <item.icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-base font-bold text-slate-200 group-hover:text-white transition-colors">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/[0.06]">
                <p className="text-sm text-slate-500 italic font-medium">
                  "Advancing human collaboration through distributed intelligence."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Name</label>
                    <Input
                      placeholder="Your Name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      required
                      className="h-14 rounded-xl bg-white/[0.03] border-white/[0.08] focus:border-blue-500/50 focus:ring-blue-500/20 text-white placeholder:text-slate-600 font-medium px-5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email</label>
                    <Input
                      type="email"
                      placeholder="work@email.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      required
                      className="h-14 rounded-xl bg-white/[0.03] border-white/[0.08] focus:border-blue-500/50 focus:ring-blue-500/20 text-white placeholder:text-slate-600 font-medium px-5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Company</label>
                  <Input
                    placeholder="Company Name"
                    value={formState.company}
                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                    className="h-14 rounded-xl bg-white/[0.03] border-white/[0.08] focus:border-blue-500/50 focus:ring-blue-500/20 text-white placeholder:text-slate-600 font-medium px-5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Message</label>
                  <Textarea
                    placeholder="Tell us about your team and meeting challenges..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    rows={4}
                    required
                    className="rounded-xl bg-white/[0.03] border-white/[0.08] focus:border-blue-500/50 focus:ring-blue-500/20 text-white placeholder:text-slate-600 font-medium p-5 min-h-[140px] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide shadow-[0_8px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.5)] transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 group"
                >
                  <AnimatePresence mode="wait">
                    {sent ? (
                      <motion.span
                        key="sent"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-green-300"
                      >
                        ✓ Message Sent Successfully
                      </motion.span>
                    ) : loading ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <Send className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        Send Message
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
