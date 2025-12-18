"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { MessageCircle } from "lucide-react"
import { useState } from "react"
import { SiteHeader } from "@/components/site-header"

export default function OnboardingChatPage() {
  const router = useRouter()
  const [showPopup, setShowPopup] = useState(false)

  const handleFinishOnboarding = () => {
    setShowPopup(true)
    setTimeout(() => {
      router.push("/start-meeting")
    }, 3000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-200 via-white to-sky-100">
      
      {/* Header */}
      <SiteHeader />

      {/* Main content */}
      <main className="flex-1 grid place-items-center px-4 relative overflow-hidden">
        {/* Floating Animated Shapes */}
        <motion.div
          className="absolute w-96 h-96 bg-white/30 rounded-full -top-24 -left-24"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 140, ease: "linear" }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-white/20 rounded-full -bottom-20 -right-16"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 180, ease: "linear" }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-sky-300/20 rounded-full top-10 right-1/4"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 160, ease: "linear" }}
        />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-2xl px-4"
        >
          <Card className="rounded-3xl border border-blue-300 shadow-2xl bg-blue-100 overflow-hidden">
            <CardHeader className="text-center pt-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-300 shadow-xl"
              >
                <MessageCircle className="h-12 w-12 text-white" />
              </motion.div>
              <CardTitle className="text-4xl font-extrabold text-blue-900">
                Conversational Onboarding
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pt-6 pb-8">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                
                  className="flex-1 w-full text-white bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-lg"
                  onClick={() => router.push("/onboarding")}
                >
                  Use Quick Setup
                </Button>

                <Button
                  className="flex-1 w-full gap-2 text-white bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-lg"
                >
                  Start onboarding conversation
                </Button>
              </div>

              <Button
                className="w-full text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 mt-4 py-3 text-lg font-semibold rounded-xl shadow-xl hover:scale-105"
                onClick={handleFinishOnboarding}
              >
                Finish & Continue
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Completion popup */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-blue-50 rounded-3xl p-10 w-96 text-center shadow-2xl border border-blue-300"
              >
                <motion.div
                  animate={{ y: [-10, 0, -10] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <MessageCircle className="mx-auto mb-4 h-14 w-14 text-blue-500" />
                </motion.div>
                <h2 className="text-3xl font-bold text-blue-900 mb-2">Setup Complete!</h2>
                <p className="text-blue-800 text-lg">
                  You’re all set. Redirecting to Start Meeting…
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

     
    </div>
  )
}
