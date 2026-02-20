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
      console.log(`✨ [MeetingInit] Success! Bot: ${data.bot_id} (Len: ${data.bot_id?.length}), Session: ${data.session_id}`)
      localStorage.setItem("botId", data.bot_id)
      localStorage.setItem("sessionId", data.session_id || "")
      localStorage.setItem("meetingUrl", data.meeting_url)
      localStorage.setItem("userName", userName || "Guest")
      // Use backend confirmation for isScrum
      localStorage.setItem("isScrum", String(data.is_scrum))

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
    <div className="flex flex-col min-h-screen bg-[#020617] relative selection:bg-blue-500/30">

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <section className="relative flex-1 flex items-center justify-center px-4 py-16 overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-xl p-1 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-white/[0.02] shadow-2xl"
        >
          <div className="bg-[#020617]/90 backdrop-blur-3xl p-8 sm:p-10 rounded-[2.4rem] border border-white/5 space-y-10">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)] relative group"
              >
                <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">
                  Start Meeting
                </h1>
                <p className="text-slate-400 font-medium">
                  Connect Vocaris to your Google Meet session
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-6">
              <div className="space-y-2.5">
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Assistant identity (e.g. Vocaris AI)"
                  className="bg-white/5 border-white/10 focus:border-blue-500/50 focus:ring-0 text-white placeholder:text-slate-600 h-14 rounded-2xl transition-all text-lg font-medium"
                />
              </div>

              <div className="space-y-2.5">
                <div className="relative group">
                  <Input
                    value={meetingUrl}
                    onChange={(e) => setMeetingUrl(e.target.value)}
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    className="bg-white/5 border-white/10 focus:border-blue-500/50 focus:ring-0 text-white placeholder:text-slate-600 h-14 rounded-2xl transition-all text-lg font-medium pl-12"
                  />
                  <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
              </div>

              {/* Mode Selection */}
              <div className="p-1 rounded-2xl bg-white/5 border border-white/5">
                <div
                  className={`flex items-center justify-between p-5 rounded-xl transition-all duration-300 ${isScrum ? "bg-blue-600/10 border-blue-500/30" : "bg-transparent border-transparent"
                    } border`}
                >
                  <div className="space-y-1 flex-1 pr-4">
                    <Label htmlFor="scrum-mode" className="text-lg font-bold text-white flex items-center gap-2 cursor-pointer">
                      <Columns className={`w-5 h-5 transition-colors ${isScrum ? "text-blue-400" : "text-slate-500"}`} />
                      Scrum Project Mode
                    </Label>
                    <p className="text-sm text-slate-500 leading-snug">
                      Generate project board tickets and sprint updates from the transcript.
                    </p>
                  </div>
                  <Switch
                    id="scrum-mode"
                    checked={isScrum}
                    onCheckedChange={setIsScrum}
                    className="data-[state=checked]:bg-blue-500 scale-125 transition-transform"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </motion.div>
              )}
            </div>

            {/* CTA Section */}
            <div className="space-y-8 pt-4">
              <Button
                onClick={handleStartMeeting}
                disabled={loading}
                className="w-full h-16 text-xl font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Connecting...
                  </span>
                ) : (
                  "Initialize Session"
                )}
              </Button>

              {/* AI Activity Status */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-blue-500"
                      animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.3, 1]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <div className="h-6 overflow-hidden flex flex-col items-center">
                  <motion.p
                    key={aiStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-slate-500 text-xs font-bold uppercase tracking-widest"
                  >
                    {aiStates[aiStep]}
                  </motion.p>
                </div>
              </div>

              {/* Security Badges */}
              <div className="flex justify-center gap-8 text-slate-500 text-[10px] font-bold uppercase tracking-widest pt-2 opacity-60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  E2E Encrypted
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-500" />
                  Native Integration
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
