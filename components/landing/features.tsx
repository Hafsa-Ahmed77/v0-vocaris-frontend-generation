"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { MessageSquare, Zap, Bot, BarChart3 } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "Smart Meeting Participation",
    desc: "Real-time transcription, speaker labels, and intelligent note-taking.",
  },
  {
    icon: Zap,
    title: "Instant Summaries & Reports",
    desc: "Auto-generated action items, decisions, and follow-ups in seconds.",
  },
  {
    icon: Bot,
    title: "AI Chat for Every Meeting",
    desc: "Ask questions, retrieve context, and get instant answers with RAG.",
  },
  {
    icon: BarChart3,
    title: "Centralized Dashboard",
    desc: "View all meetings, analytics, and insights in one unified workspace.",
  },
]

export function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
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
    <section id="features" className="relative py-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to run effective, outcomes-focused meetings.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={itemVariants}>
              <Card className="hover-lift rounded-2xl border-2 border-transparent hover:border-secondary/50 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardContent className="p-8 space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/20 to-accent/20 text-secondary">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
