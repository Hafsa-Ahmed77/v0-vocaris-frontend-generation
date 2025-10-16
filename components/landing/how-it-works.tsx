"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Calendar, Mic, FileText, MessageCircle, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Calendar,
    title: "Connect",
    desc: "Link your Google Calendar to auto-detect meetings.",
  },
  {
    icon: Mic,
    title: "Participate",
    desc: "Vocaris joins, transcribes, and captures key points.",
  },
  {
    icon: FileText,
    title: "Summarize",
    desc: "Instant summaries, action items, and highlights.",
  },
  {
    icon: MessageCircle,
    title: "Collaborate",
    desc: "Chat with an RAG assistant about any meeting.",
  },
]

export function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />

      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">How it works</h2>
          <p className="text-lg text-muted-foreground">
            From scheduling to insights—Vocaris streamlines every step of your meeting workflow.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div key={step.title} variants={itemVariants} className="relative group">
                <div
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-2xl blur transition-opacity duration-300"
                  style={{ backgroundImage: `linear-gradient(to right, rgb(99, 102, 241), rgb(56, 189, 248))` }}
                />

                <Card className="relative hover-lift rounded-2xl border-2 border-transparent group-hover:border-secondary/50 transition-all duration-300 bg-white dark:bg-slate-900">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-accent text-white font-bold text-sm">
                        {idx + 1}
                      </div>
                      {idx < steps.length - 1 && (
                        <ArrowRight className="w-5 h-5 text-muted-foreground hidden lg:block" />
                      )}
                    </div>

                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/20 to-accent/20 text-secondary">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
