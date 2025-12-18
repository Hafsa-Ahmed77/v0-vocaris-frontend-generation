"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion, type Variants } from "framer-motion"
import {
  LogIn,
  ClipboardList,
  CheckCircle,
  Video,
  Bot,
  Activity,
  Power,
  MessageSquareText,
} from "lucide-react"

const flowSteps = [
  {
    icon: LogIn,
    title: "Sign in with Google",
    desc: "Quick and secure authentication using your Google account.",
  },
  {
    icon: ClipboardList,
    title: "Smart Onboarding",
    desc: "Complete onboarding via form or conversational AI — your choice.",
  },
  {
    icon: CheckCircle,
    title: "Finish & Continue",
    desc: "Review your setup and proceed instantly without friction.",
  },
  {
    icon: Video,
    title: "Start Meeting",
    desc: "Enter meeting name and URL to begin the session.",
  },
  {
    icon: Bot,
    title: "Bot Joins Meeting",
    desc: "AI bot automatically joins and starts listening securely.",
  },
  {
    icon: Activity,
    title: "Live Meeting Status",
    desc: "View real-time status, uptime, and meeting activity.",
  },
  {
    icon: Power,
    title: "End Meeting",
    desc: "Stop the session anytime with a single action.",
  },
  {
    icon: MessageSquareText,
    title: "Meeting Completed",
    desc: "Access transcripts, summaries, and chat with meeting data.",
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

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <section id="flow" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            A seamless end-to-end AI meeting workflow.
          </p>
        </motion.div>

        {/* Flow Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {flowSteps.map(({ icon: Icon, title, desc }, index) => (
            <motion.div key={title} variants={itemVariants}>
              <Card className="relative rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur border hover:border-secondary/50 transition-all">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/20 to-accent/20 text-secondary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
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
