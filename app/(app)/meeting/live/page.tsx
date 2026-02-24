"use client"

import { useEffect, useState, useRef } from "react"
import { Loader2, CheckCircle2, AlertCircle, MessageSquare, Layout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"

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
    <section className="min-h-full bg-transparent text-slate-800 dark:text-white flex flex-col relative overflow-hidden transition-colors duration-500">
      {/* Premium Background Ambience - soft but sophisticated (Boosted for better life in dark mode) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-15%] w-[80%] h-[80%] bg-blue-500/5 dark:bg-blue-600/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[80%] h-[80%] bg-violet-500/5 dark:bg-violet-600/15 rounded-full blur-[140px] animate-pulse [animation-delay:2s]" />
      </div>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {!ended ? (
              <motion.div
                key="active"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-10 text-center"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 backdrop-blur-sm shadow-sm"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Active Intelligence Session</span>
                  </motion.div>

                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                    Meeting in <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Progress</span>
                  </h1>
                </div>

                {!botId ? (
                  <div className="space-y-8 py-10">
                    <div className="w-24 h-24 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-500 animate-pulse">
                      <Layout className="w-10 h-10" />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">No Active Session</h2>
                      <p className="text-slate-500 dark:text-slate-400 font-bold max-w-sm mx-auto">
                        Start your meeting, your meeting live status seen here.
                      </p>
                    </div>
                    <Button
                      onClick={() => router.push("/dashboard")}
                      className="bg-blue-600 hover:bg-blue-500 rounded-2xl h-14 px-8 font-bold shadow-lg shadow-blue-500/20"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="relative mx-auto w-48 h-48 flex items-center justify-center">
                      <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/10 rounded-full animate-[ping_3s_infinite]" />
                      <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-white/10 flex items-center justify-center relative z-10 shadow-xl dark:shadow-2xl backdrop-blur-xl group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
                      </div>
                    </div>

                    <div className="max-w-sm mx-auto space-y-8">
                      {/* Premium Layered Card */}
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-violet-600/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                        <div className="relative p-8 rounded-[2.25rem] bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-white/[0.08] shadow-sm dark:shadow-2xl backdrop-blur-2xl space-y-1">
                          <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                            {status ? `${Math.floor(status.uptime_seconds / 60)}m ${String(status.uptime_seconds % 60).padStart(2, '0')}s` : "Link established"}
                          </p>
                          <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">Uptime Monitor</p>
                        </div>
                      </div>

                      <Button
                        size="lg"
                        onClick={handleFinishMeeting}
                        disabled={isEnding || loading}
                        className="w-full h-16 rounded-2xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-black text-lg shadow-xl shadow-slate-200 dark:shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                      >
                        Generate Meeting Insights
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="ended"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12 text-center"
              >
                <div className="space-y-6">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                    <div className="relative w-full h-full rounded-2xl bg-white dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 flex items-center justify-center text-green-600 dark:text-green-500 shadow-lg">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Session Finalized</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">AI is crafting your meeting intelligence.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-4">
                  <Button
                    disabled={!resultsReady}
                    onClick={() => handleAction("chat")}
                    className={cn(
                      "h-44 rounded-[2.5rem] flex flex-col items-center justify-center gap-5 transition-all duration-500 relative overflow-hidden group shadow-lg",
                      resultsReady
                        ? "bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:shadow-2xl hover:scale-[1.02] dark:hover:border-violet-500/30"
                        : "bg-white/50 dark:bg-white/[0.01] border border-slate-50 dark:border-white/5 opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="space-y-1 relative z-10 text-center">
                      <p className="font-black text-xl text-slate-800 dark:text-white">AI Intelligence</p>
                      <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest">Chat & Query</p>
                    </div>
                  </Button>

                  <Button
                    disabled={!resultsReady || !isScrum}
                    onClick={() => handleAction("scrum")}
                    className={cn(
                      "h-44 rounded-[2.5rem] flex flex-col items-center justify-center gap-5 transition-all duration-500 relative overflow-hidden group shadow-lg shadow-blue-200/50 dark:shadow-none",
                      resultsReady && isScrum
                        ? "bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 hover:scale-[1.02]"
                        : "bg-white/50 dark:bg-white/[0.01] border border-slate-50 dark:border-white/5 opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Layout className="w-7 h-7 text-white" />
                    </div>
                    <div className="space-y-1 relative z-10 text-center">
                      <p className="font-black text-xl text-white">Dev Intelligence</p>
                      <p className="text-[10px] uppercase font-black text-white/50 tracking-widest">Scrum & Tickets</p>
                    </div>
                  </Button>
                </div>

                {!resultsReady && (
                  <div className="flex flex-col items-center gap-4 py-6">
                    <div className="relative">
                      <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
                      <div className="absolute inset-0 blur-lg bg-blue-500/30 animate-pulse" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] animate-pulse">Processing Results...</p>
                  </div>
                )}

                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-white font-black uppercase tracking-[0.2em] text-[10px] transition-colors"
                >
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
