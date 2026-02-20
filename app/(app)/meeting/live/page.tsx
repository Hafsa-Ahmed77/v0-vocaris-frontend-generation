"use client"

import { useEffect, useState, useRef } from "react"
import { Loader2, CheckCircle2, AlertCircle, MessageSquare, Layout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { apiFetch } from "@/lib/api"

type MeetingStatus = {
  is_active: boolean
  bot_id: string
  session_id?: string | null
  meeting_url: string
  uptime_seconds: number
  transcript_count?: number
  bot_name?: string
  bot_in_call?: boolean
}

export default function MeetingLivePage() {
  const router = useRouter()
  const [status, setStatus] = useState<MeetingStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [ended, setEnded] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  const [processingScrum, setProcessingScrum] = useState(false)
  const [processingChat, setProcessingChat] = useState(false)
  const [resultsReady, setResultsReady] = useState(false)

  const botId = typeof window !== "undefined" ? localStorage.getItem("botId") : null
  const isScrum = typeof window !== "undefined" ? localStorage.getItem("isScrum") === "true" : false

  // -----------------------------
  // STATUS POLLING (Bot Health Only)
  // -----------------------------
  useEffect(() => {
    if (!botId || ended) return

    let consecutiveFailures = 0
    const fetchStatus = async () => {
      try {
        const data = await apiFetch(`/meeting-status?bot_id=${botId}`)
        setStatus(data)
        setLoading(false)

        if (!data.is_active && !isEnding) {
          consecutiveFailures++
          if (consecutiveFailures > 3) setEnded(true)
        } else {
          consecutiveFailures = 0
        }
      } catch (err) {
        console.error("Status check failed:", err)
      }
    }

    fetchStatus()
    const intv = setInterval(fetchStatus, 5000)
    return () => clearInterval(intv)
  }, [botId, ended, isEnding])

  // -----------------------------
  // FINISH MEETING & TRIGGER RESULTS
  // -----------------------------
  const handleFinishMeeting = async () => {
    // We no longer call /end-meeting because it is destructive to the session.
    // We simply stop the local monitor and trigger a final transcript fetch.
    setEnded(true)
    setIsEnding(false)

    // Trigger the definitive fetch immediately
    fetchResults()
  }

  const fetchResults = async () => {
    if (!botId) return
    const sessionId = localStorage.getItem("sessionId") || ""

    try {
      console.log("📡 [MeetingLive] Triggering definitive transcript fetch...")
      const mode = isScrum ? "scrum" : "simple"
      // We call this once to ensure transcripts are ready/processed on backend
      const url = `/meeting-transcripts?bot_id=${botId}&session_id=${sessionId}&mode=${mode}&format=json&auto_process=true`

      await apiFetch(url, { method: "GET" })
      setResultsReady(true)
    } catch (e: any) {
      console.error("Final results fetch failed:", e.message)
      // Even if fetch fails (e.g. still processing), we mark ready so user can try entering subpages
      setResultsReady(true)
    }
  }

  const handleAction = (type: "chat" | "scrum") => {
    if (!botId) return
    if (type === "scrum") router.push(`/meeting/scrum?botId=${botId}`)
    else router.push(`/meeting/chat?botId=${botId}`)
  }

  const handleBack = () => {
    localStorage.removeItem("botId")
    localStorage.removeItem("meetingUrl")
    localStorage.removeItem("userName")
    localStorage.removeItem("isScrum")
    router.push("/start-meeting")
  }

  return (
    <section className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-hidden selection:bg-blue-500/30">
      {/* Background ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {!ended ? (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-12 text-center"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">Active Intelligence Session</span>
                  </div>
                  <h1 className="text-5xl font-black tracking-tight bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
                    Meeting in Progress
                  </h1>
                </div>

                <div className="relative mx-auto w-48 h-48 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping" />
                  <div className="absolute inset-4 bg-blue-500/5 rounded-full animate-ping [animation-delay:0.5s]" />
                  <div className="w-32 h-32 rounded-full bg-[#020617] border-2 border-blue-500/30 flex items-center justify-center relative z-10">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                  </div>
                </div>

                <div className="grid gap-4 max-w-sm mx-auto">
                  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-1">
                    <p className="text-2xl font-black text-white">
                      {status ? `${Math.floor(status.uptime_seconds / 60)}m ${status.uptime_seconds % 60}s` : "Link established"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest uppercase">Uptime Monitor</p>
                  </div>

                  <Button
                    size="lg"
                    onClick={handleFinishMeeting}
                    disabled={isEnding || loading}
                    className="h-16 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg shadow-2xl shadow-indigo-900/40 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >
                    Generate Meeting Insights
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="ended"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-10 text-center"
              >
                <div className="space-y-4">
                  <div className="w-20 h-20 rounded-[2rem] bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto text-green-500 animate-in zoom-in duration-500">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tight">Meeting Finalized</h2>
                  <p className="text-slate-400 text-lg">AI is preparing your meeting intelligence.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-6">
                  <Button
                    disabled={!resultsReady}
                    onClick={() => handleAction("chat")}
                    className={`h-40 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all duration-500 ${resultsReady
                      ? "bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-[1.02] shadow-2xl"
                      : "bg-white/[0.01] border border-white/5 opacity-50 cursor-not-allowed"
                      }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-lg">AI Intelligence</p>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Chat & Query</p>
                    </div>
                  </Button>

                  <Button
                    disabled={!resultsReady || !isScrum}
                    onClick={() => handleAction("scrum")}
                    className={`h-40 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all duration-500 ${resultsReady && isScrum
                      ? "bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/20 hover:scale-[1.02]"
                      : "bg-white/[0.01] border border-white/5 opacity-50 cursor-not-allowed"
                      }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Layout className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-lg">Dev Intelligence</p>
                      <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest">Scrum & Tickets</p>
                    </div>
                  </Button>
                </div>

                {!resultsReady && (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Processing Final Transcript...</p>
                  </div>
                )}

                <Button variant="ghost" onClick={handleBack} className="text-slate-500 hover:text-white font-bold uppercase tracking-widest text-[10px]">
                  Start New Session
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </section>
  )
}
