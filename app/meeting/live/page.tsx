"use client"

import { useEffect, useState, useRef } from "react"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

type MeetingStatus = {
  is_active: boolean
  bot_id: string
  meeting_url: string
  uptime_seconds: number
}

export default function MeetingLivePage() {
  const router = useRouter()
  const [status, setStatus] = useState<MeetingStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [ended, setEnded] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)

  const botId = typeof window !== "undefined" ? localStorage.getItem("botId") : null
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // -----------------------------
  // STATUS POLLING
  // -----------------------------
  useEffect(() => {
    if (!botId || ended) return

    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/meeting-status")
        if (!res.ok) return
        const data: MeetingStatus = await res.json()
        setStatus(data)
        setLoading(false)

        // Auto-end if backend says inactive
        if (!data.is_active) stopPollingAndEnd()
      } catch (err) {
        console.error(err)
      }
    }

    fetchStatus() // immediate fetch
    intervalRef.current = setInterval(fetchStatus, 7000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [botId, ended])

  // -----------------------------
  // END MEETING
  // -----------------------------
  const handleEndMeeting = async () => {
    if (!botId) return
    try {
      const res = await fetch(`/api/end-meeting?botId=${botId}`, { method: "POST" })
      if (!res.ok) return alert("Failed to end meeting")
      stopPollingAndEnd()
    } catch (err) {
      console.error(err)
      alert("Error ending meeting")
    }
  }

  const stopPollingAndEnd = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setEnded(true)
  }

  // -----------------------------
  // CHAT BUTTON CLICK (API + delay)
  // -----------------------------
  const handleChatClick = async () => {
    if (!botId) return
    setChatLoading(true)

    try {
      // Call transcripts API
      await fetch(`/api/meeting-transcripts?botId=${botId}`, { method: "GET" })

      // Wait ~6s for processing
      await new Promise((resolve) => setTimeout(resolve, 6000))

      // Navigate to chat page
      router.push(`/meeting/chat?botId=${botId}`)
    } catch (err) {
      console.error(err)
      alert("Failed to load transcripts. Try again.")
    } finally {
      setChatLoading(false)
    }
  }

  const handleBack = () => {
    localStorage.removeItem("botId")
    localStorage.removeItem("meetingUrl")
    localStorage.removeItem("userName")
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
          {!loading && ended && <CheckCircle2 className="h-10 w-10 text-green-400" />}
          {!loading && !ended && <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />}
        </div>

        {!ended && status && (
          <>
            <h2 className="text-lg font-medium text-white">Vocaris AI is Active</h2>
            <p className="text-sm text-slate-400">
              Uptime: {Math.floor(status.uptime_seconds / 60)}m {status.uptime_seconds % 60}s
            </p>

            <Button variant="destructive" className="w-full mt-4" onClick={handleEndMeeting}>
              End Meeting Session
            </Button>
          </>
        )}

        {ended && (
          <>
            <h2 className="text-lg font-medium text-white">Meeting Completed</h2>
            <p className="text-sm text-slate-400">Click below to chat with your meeting transcript</p>

            <Button
              className={`w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white`}
              onClick={handleChatClick}
            >
              {chatLoading ? "Loading transcripts..." : "Chat with Meeting Transcript"}
            </Button>

            <Button variant="ghost" className="w-full mt-2" onClick={handleBack}>
              Schedule a New Meeting
            </Button>
          </>
        )}
      </div>
    </section>
  )
}
