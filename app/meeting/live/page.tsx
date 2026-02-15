"use client"

import { useEffect, useState, useRef } from "react"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

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

import { apiFetch } from "@/lib/api"

export default function MeetingLivePage() {
  const router = useRouter()
  const [status, setStatus] = useState<MeetingStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [ended, setEnded] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  const [processingScrum, setProcessingScrum] = useState(false)
  const [processingChat, setProcessingChat] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [scrumReady, setScrumReady] = useState(false)
  const [chatReady, setChatReady] = useState(false)
  const [pollingAttempts, setPollingAttempts] = useState(0)
  const pollingAttemptsRef = useRef(0)
  const botId = typeof window !== "undefined" ? localStorage.getItem("botId") : null
  const isScrum = typeof window !== "undefined" ? localStorage.getItem("isScrum") === "true" : false
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // -----------------------------
  // STATUS POLLING
  // -----------------------------
  useEffect(() => {
    if (!botId) return
    // We continue polling status even after 'ended' is true, 
    // until the bot actually leaves the call or we refresh.
    if (ended && status?.bot_in_call === false) return

    let consecutiveFailures = 0
    const fetchStatus = async () => {
      try {
        const data = await apiFetch(`/meeting-status?bot_id=${botId}`)
        console.log("📊 [LiveMonitor] Status Update:", data)
        setStatus(data)
        setLoading(false)

        if (!data.is_active && !isEnding) {
          consecutiveFailures++
          if (consecutiveFailures > 3) stopPollingAndEnd()
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
  }, [botId, ended, isEnding, status?.bot_in_call])

  // -----------------------------
  // END MEETING
  // -----------------------------
  const handleEndMeeting = async () => {
    if (!botId) return
    setIsEnding(true)
    try {
      console.log(`🚀 [MeetingLive] Requesting termination for bot: ${botId}`)
      await apiFetch(`/end-meeting?bot_id=${botId}`, { method: "POST" })
      console.log("✅ [MeetingLive] End-meeting call hit the proxy successfully.")
    } catch (err: any) {
      console.error("❌ [MeetingLive] End-meeting API failure:", err.message)
      // If session is already gone, it's fine
      if (!err.message?.includes("404") && !err.message?.toLowerCase().includes("not found")) {
        alert("Failed to end meeting correctly. Please try again.")
        setIsEnding(false)
        return
      }
    }
    stopPollingAndEnd()
    setCooldown(10) // Small cooldown before transcripts polling starts properly
  }

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  // -----------------------------
  // BACKGROUND READINESS POLLING
  // -----------------------------
  useEffect(() => {
    if (!ended || !botId || cooldown > 0) return

    const checkReady = async () => {
      const localSessionId = typeof window !== "undefined" ? localStorage.getItem("sessionId") : ""
      const sessionId = status?.session_id || localSessionId || ""
      const t = Date.now()
      const currentAttempt = pollingAttemptsRef.current
      console.log(`🔍 [LiveMonitor] Poll #${currentAttempt}. Bot: ${botId}, Session: ${sessionId}, Count: ${status?.transcript_count}`)

      // Check Scrum
      if (isScrum && !scrumReady) {
        try {
          const res = await apiFetch(`/meeting-transcripts?bot_id=${botId}&session_id=${sessionId}&mode=scrum&format=json&t=${t}`)
          if (res.is_processing) {
            console.log("⏳ [LiveMonitor] Scrum tickets are pending AI processing...")
          } else {
            const tickets = Array.isArray(res) ? res : (res.tickets || res.items || [])
            if (tickets.length > 0) {
              console.log("✨ [LiveMonitor] SUCCESS: Scrum tickets found.")
              setScrumReady(true)
            }
          }
        } catch (e: any) {
          console.error("❌ [LiveMonitor] Scrum poll error:", e.message)
        }
      }

      // Check Chat
      if (!chatReady) {
        try {
          const res = await apiFetch(`/meeting-transcripts?bot_id=${botId}&session_id=${sessionId}&mode=simple&format=json&t=${t}`)
          const hasData = Array.isArray(res) ? res.length > 0 : (res.is_empty || res.is_processing ? false : !!res)
          if (hasData) {
            console.log("✨ [LiveMonitor] SUCCESS: Chat data found.")
            setChatReady(true)
          }
        } catch (e: any) {
          console.error("❌ [LiveMonitor] Chat poll error:", e.message)
        }
      }

      pollingAttemptsRef.current++
      setPollingAttempts(pollingAttemptsRef.current)
    }

    const pollInterval = setInterval(checkReady, 5000)
    checkReady()

    return () => clearInterval(pollInterval)
  }, [ended, botId, cooldown, isScrum, status?.session_id])

  const stopPollingAndEnd = () => {
    setEnded(true)
  }

  const handleAction = async (type: "chat" | "scrum") => {
    if (!botId) return
    const isS = type === "scrum"
    if (isS) setProcessingScrum(true)
    else setProcessingChat(true)

    try {
      const mode = isS ? "scrum" : "simple"
      const sessionId = status?.session_id || localStorage.getItem("sessionId") || ""
      let url = `/meeting-transcripts?bot_id=${botId}&session_id=${sessionId}&mode=${mode}`
      if (!isS) url += "&auto_process=true"
      url += "&format=json"

      try {
        await apiFetch(url, { method: "GET" })
      } catch (e: any) {
        console.warn("Warm-up fetch failed, but proceeding to result page:", e.message)
      }

      if (isS) router.push(`/meeting/scrum?botId=${botId}`)
      else router.push(`/meeting/chat?botId=${botId}`)
    } catch (err) {
      console.error("Action handler failed:", err)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setProcessingScrum(false)
      setProcessingChat(false)
    }
  }

  const handleBack = () => {
    localStorage.removeItem("botId")
    localStorage.removeItem("meetingUrl")
    localStorage.removeItem("userName")
    localStorage.removeItem("isScrum")
    router.push("/start-meeting")
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8 text-center space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Vocaris AI · Live Monitor</p>
          <h1 className="text-xl font-semibold text-white">Meeting Status</h1>
        </div>

        <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
          {loading && <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />}
          {!loading && ended && !status?.bot_in_call && <CheckCircle2 className="h-10 w-10 text-green-400" />}
          {!loading && (status?.bot_in_call || !ended) && (
            <div className="relative">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
              <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
            </div>
          )}
        </div>

        {!ended && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-white">Vocaris AI is Active</h2>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">
                {status ? `Uptime: ${Math.floor(status.uptime_seconds / 60)}m ${status.uptime_seconds % 60}s` : "Initializing..."}
              </p>
              {status?.bot_in_call !== undefined && (
                <p className={`text-xs ${status.bot_in_call ? 'text-green-400' : 'text-amber-400'}`}>
                  Status: {status.bot_in_call ? "Bot currently in call" : "Bot joined but waiting/reconnecting..."}
                </p>
              )}
              {status?.transcript_count !== undefined && (
                <p className="text-xs text-blue-400 font-mono">
                  Captured: {status.transcript_count} transcripts
                </p>
              )}
            </div>

            <Button variant="destructive" className="w-full mt-4" onClick={handleEndMeeting} disabled={isEnding}>
              {isEnding ? "Ending session..." : "End Meeting Session"}
            </Button>
          </div>
        )}

        {ended && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-white">Meeting Completed</h2>

              {status?.bot_in_call ? (
                <div className="flex items-center justify-center space-x-2 text-amber-400 animate-pulse py-2">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">Waiting for bot to leave Meet call...</p>
                </div>
              ) : cooldown > 0 ? (
                <p className="text-sm text-blue-400 animate-pulse">
                  AI is finalizing session... {cooldown}s
                </p>
              ) : !chatReady && (!isScrum || !scrumReady) ? (
                <div className="space-y-2">
                  <p className="text-sm text-amber-400 animate-pulse">
                    {pollingAttempts > 10
                      ? "AI is taking a bit longer than usual..."
                      : "AI is creating tickets & summaries..."}
                  </p>
                  {status?.transcript_count === 0 && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-xs text-red-400 font-medium mb-1">Notice: No audio captured</p>
                      <p className="text-[10px] text-slate-500 italic text-left">
                        If this stays stuck at 0, the bot might have been muted or couldn't hear the meeting.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-green-400">AI Processing Complete! Results Ready.</p>
              )}
            </div>

            <div className="space-y-3">
              {isScrum && (
                <Button
                  className={`w-full ${scrumReady ? "bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20" : "bg-slate-800 text-slate-500"} text-white font-medium`}
                  onClick={() => handleAction("scrum")}
                  disabled={processingScrum || processingChat || !scrumReady}
                >
                  {processingScrum ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {!scrumReady ? "Processing Scrum Board..." : "View Scrum Project Board"}
                </Button>
              )}

              <Button
                className={`w-full ${chatReady ? "bg-white/10 hover:bg-white/20" : "bg-slate-800 text-slate-500"} text-white border border-white/10 font-medium`}
                onClick={() => handleAction("chat")}
                disabled={processingChat || processingScrum || !chatReady}
              >
                {processingChat ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {!chatReady ? "Processing Transcript Chat..." : "Chat with Meeting Transcript"}
              </Button>
            </div>

            <Button variant="ghost" className="w-full text-slate-400 hover:text-white" onClick={handleBack}>
              Return to Start
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
