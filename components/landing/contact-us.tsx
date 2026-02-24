"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Send, Sparkles, Globe, ShieldCheck, Linkedin, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export function ContactUs() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formState, setFormState] = useState({ name: "", email: "", company: "", message: "" })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1500))
      toast({
        title: "Transmission Received",
        description: "Our intelligence team will reach out shortly.",
      })
      setFormState({ name: "", email: "", company: "", message: "" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="relative py-32 overflow-hidden bg-white dark:bg-[#0f172a] transition-colors duration-500">
      {/* Cinematic Atmospheric Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay" />
      </div>

      <div className="mx-auto max-w-7xl px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <Sparkles className="w-3 h-3" />
            Connect with Intensity
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">Touch</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg lg:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Ready to stabilize your meeting workflows? Our neural team is at standby to assist with your custom deployments.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Contact Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="glass p-10 rounded-[3rem] border border-slate-200 dark:border-white/10 relative overflow-hidden group h-full bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-12">Neural Operations</h3>

              <div className="space-y-10">
                {[
                  { icon: Mail, label: "Digital Vector", value: "hello@vocaris.ai", href: "mailto:hello@vocaris.ai", color: "text-blue-600 dark:text-blue-400" },
                  { icon: Linkedin, label: "Professional Network", value: "Vocaris AI", href: "https://www.linkedin.com/company/108648938", color: "text-cyan-600 dark:text-cyan-400" },
                  { icon: Globe, label: "Digital HQ", value: "vocaris.live", href: "https://vocaris.live", color: "text-indigo-600 dark:text-indigo-400" }
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-6 group/item cursor-pointer"
                  >
                    <div className={cn("w-14 h-14 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all duration-500 group-hover/item:scale-110 group-hover/item:border-blue-500/40 group-hover/item:shadow-xl dark:group-hover/item:shadow-blue-500/10", item.color)}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-200 group-hover/item:text-blue-600 dark:group-hover/item:text-white transition-colors">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-16 pt-10 border-t border-slate-200 dark:border-white/5">
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500 italic">
                  "Advancing human collaboration through distributed intelligence."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="glass p-8 md:p-14 rounded-[3.5rem] border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] relative shadow-2xl dark:shadow-none transition-shadow duration-500">
              <form onSubmit={onSubmit} className="space-y-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-2">Identity</label>
                    <Input
                      placeholder="Your Name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      required
                      className="h-16 rounded-2xl bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/10 border-2 focus:border-blue-500/50 focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-bold transition-all px-6"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-2">Neural Node</label>
                    <Input
                      type="email"
                      placeholder="work@email.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      required
                      className="h-16 rounded-2xl bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/10 border-2 focus:border-blue-500/50 focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-bold transition-all px-6"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-2">Corporation</label>
                  <Input
                    placeholder="Company Name"
                    value={formState.company}
                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                    className="h-16 rounded-2xl bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/10 border-2 focus:border-blue-500/50 focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-bold transition-all px-6"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-2">Transmission Data</label>
                  <Textarea
                    placeholder="Context of your inquiry..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    rows={4}
                    required
                    className="rounded-3xl bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/10 border-2 focus:border-blue-500/50 focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-bold transition-all p-6 min-h-[160px] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest text-xs shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(37,99,235,0.6)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 group"
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3"
                      >
                        <Spinner className="w-5 h-5 text-blue-200" />
                        Synchronizing...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3"
                      >
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Initialize Transmission
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
