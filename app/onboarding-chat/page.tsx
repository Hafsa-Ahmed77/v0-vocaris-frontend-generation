// This page will integrate with a chatbot for conversational onboarding
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { MessageCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function OnboardingChatPage() {
  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="rounded-2xl border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-accent"
            >
              <MessageCircle className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl">Conversational Onboarding</CardTitle>
            <CardDescription className="mt-2">Get to know Vocaris through an intelligent conversation</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Coming Soon State */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-dashed border-border/50 bg-muted/30 p-8 text-center"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI-powered conversational onboarding is being crafted to give you the best experience. This
                  feature will guide you through setup with natural, intelligent conversation.
                </p>
              </div>
            </motion.div>

            {/* Feature Preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <h4 className="font-medium">What to expect:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
                  <span>Natural conversation about your role and preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
                  <span>Smart recommendations based on your answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
                  <span>Seamless integration setup with your tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
                  <span>Personalized dashboard configuration</span>
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-3 pt-4 sm:flex-row"
            >
              <Link href="/onboarding" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Use Quick Setup
                </Button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full gap-2">
                  Skip to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Info Text */}
            <p className="text-center text-xs text-muted-foreground">
              You can always access conversational onboarding from your settings later.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
