"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { motion } from "framer-motion"
import { Mail, Phone } from "lucide-react"

export function ContactUs() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 800))
      toast({
        title: "Message sent",
        description: "We'll get back to you shortly.",
      })
      ;(e.currentTarget as HTMLFormElement).reset()
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/5 via-transparent to-accent/5" />

      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground">Have questions or want a demo? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Let's talk</h3>
              <p className="text-muted-foreground">Reach out to our team and we'll respond as soon as possible.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">hello@vocaris.ai</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={onSubmit} className="space-y-6" aria-label="Contact form">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Jane Doe"
                    required
                    aria-required
                    className="rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-secondary focus:ring-secondary/20"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@company.com"
                    required
                    aria-required
                    className="rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-secondary focus:ring-secondary/20"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Company
                </label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Acme Inc."
                  className="rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-secondary focus:ring-secondary/20"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your team and needs..."
                  rows={5}
                  required
                  aria-required
                  className="rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-secondary focus:ring-secondary/20"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                aria-live="polite"
                className="w-full bg-gradient-to-r from-secondary to-accent text-white font-medium"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner className="w-4 h-4" />
                    Sending...
                  </span>
                ) : (
                  "Send message"
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
