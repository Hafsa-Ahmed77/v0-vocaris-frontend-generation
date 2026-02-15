"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2, Video, Sparkles, ShieldCheck, Columns } from "lucide-react"
import { motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
const isValidGoogleMeetUrl = (url: string) =>
  url.startsWith("https://meet.google.com/")


const aiStates = [
  "Listening for meeting signals",
  "Analyzing audio stream",
  "Preparing AI assistant",
  "Ready to join meeting",
]

export default function StartMeetingPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [meetingUrl, setMeetingUrl] = useState("")
  const [isScrum, setIsScrum] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [aiStep, setAiStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAiStep((prev) => (prev + 1) % aiStates.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const handleStartMeeting = async () => {
    if (loading) return

    if (!meetingUrl.trim()) {
      setError("Please enter a Google Meet URL")
      return
    }

    if (!isValidGoogleMeetUrl(meetingUrl.trim())) {
      setError("Invalid Google Meet link format")
      return
    }

    setLoading(true)
    setError("")

    try {
      const body = {
        meeting_url: meetingUrl.trim(),
        bot_name: userName?.trim() || "Vocaris AI",
        meeting_title: userName?.trim() ? `${userName}'s Meeting` : "Scrum Meeting",
        is_scrum: isScrum,
      }

      console.log("Sending body to start meeting:", body)

      // Use apiFetch for automatic Authorization header
      const data = await apiFetch("/start-meeting", {
        method: "POST",
        body: JSON.stringify(body),
      })

      console.log(
        "Backend response:",
        JSON.stringify(data, null, 2)
      )

      // ✅ SUCCESS CASE ONLY
      console.log(`✨ [MeetingInit] Success! Bot: ${data.bot_id}, Session: ${data.session_id}`)
      localStorage.setItem("botId", data.bot_id)
      localStorage.setItem("sessionId", data.session_id || "")
      localStorage.setItem("meetingUrl", data.meeting_url)
      localStorage.setItem("userName", userName || "Guest")
      localStorage.setItem("isScrum", String(isScrum))

      router.push("/meeting/live")

    } catch (err: any) {
      console.error(err)

      // 👇 HANDLE "BOT ALREADY ACTIVE" CASE via Error message
      if (err.message?.includes("Bot already active")) {
        console.warn("Bot stuck active, ending old meeting…")

        try {
          // 1️⃣ END OLD BOT (using botId=all for fallback)
          await apiFetch("/end-meeting?botId=all", { method: "POST" })

          // 2️⃣ RETRY START
          const retryData = await apiFetch("/start-meeting", {
            method: "POST",
            body: JSON.stringify({
              meeting_url: meetingUrl.trim(),
              bot_name: userName?.trim() || "Vocaris AI",
              meeting_title: userName?.trim() ? `${userName}'s Meeting` : "Scrum Meeting",
              is_scrum: isScrum,
            }),
          })

          // 3️⃣ SUCCESS AFTER RETRY
          console.log(`✨ [MeetingInit] Retry Success! Bot: ${retryData.bot_id}, Session: ${retryData.session_id}`)
          localStorage.setItem("botId", retryData.bot_id)
          localStorage.setItem("sessionId", retryData.session_id || "")
          localStorage.setItem("meetingUrl", retryData.meeting_url)
          localStorage.setItem("userName", userName || "Guest")
          localStorage.setItem("isScrum", String(isScrum))

          router.push("/meeting/live")
          return
        } catch (retryErr: any) {
          setError(retryErr.message || "Failed to restart meeting")
          return
        }
      }

      setError(err.message || "Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <SiteHeader />
      <section className="relative flex-1 flex items-center justify-center px-4 py-12
  bg-gradient-to-br from-slate-100 via-blue-100 to-slate-200 overflow-hidden">

        {/* AI Wave Lines (LIGHT) */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute left-[-20%] w-[140%] h-[1px] 
            bg-gradient-to-r from-transparent via-blue-400 to-transparent"
              style={{
                top: `${15 + i * 7}%`,
                animation: `waveMove ${8 + i}s linear infinite`,
                opacity: 0.08,
              }}
            />
          ))}
        </div>

        {/* Soft center glow */}
        <div className="absolute inset-0 
      bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_65%)]" />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 w-full max-w-lg p-6 sm:p-8 rounded-3xl 
      bg-white/70 backdrop-blur-xl border border-white/40 
      shadow-[0_20px_60px_rgba(59,130,246,0.25)]
      max-h-[90vh] overflow-y-auto"
        >
          {/* Floating AI Icon */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="mx-auto mb-6 w-24 h-24 rounded-full 
          bg-gradient-to-tr from-blue-500 to-cyan-400 
          flex items-center justify-center shadow-xl"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold text-slate-900 text-center">
            Vocaris AI Meeting
          </h1>
          <p className="text-slate-600 text-center mt-1 mb-6">
            Smart AI assistant for Google Meet
          </p>

          {/* Inputs */}
          <div className="space-y-4">
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name (optional)"
              className="bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400"
            />
            <Input
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              placeholder="https://meet.google.com/abc-def-ghi"
              className="bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400"
            />

            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 border border-blue-100 gap-4">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="scrum-mode" className="text-base font-medium text-slate-900 flex items-center gap-2 flex-wrap">
                  <Columns className="w-4 h-4 text-blue-600 shrink-0" />
                  Scrum Standup Mode
                </Label>
                <p className="text-xs text-slate-500">
                  Generates actionable tickets instead of standard notes.
                </p>
              </div>
              <Switch
                id="scrum-mode"
                checked={isScrum}
                onCheckedChange={setIsScrum}
                className="data-[state=checked]:bg-blue-600 shrink-0"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* CTA */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
            <Button
              onClick={handleStartMeeting}
              disabled={loading}
              className="mt-6 w-full py-4 text-lg rounded-xl 
            bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 
            text-white shadow-lg"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Start Meeting"
              )}
            </Button>
          </motion.div>

          {/* AI Activity Indicator */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-blue-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <motion.p
              key={aiStep}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-slate-600 text-sm"
            >
              AI Status: {aiStates[aiStep]}
            </motion.p>
          </div>

          {/* Trust badges */}
          <div className="mt-5 flex justify-center gap-6 text-slate-600 text-sm">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Secure
            </div>
            <div className="flex items-center gap-1">
              <Video className="w-4 h-4" /> Google Meet Ready
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
