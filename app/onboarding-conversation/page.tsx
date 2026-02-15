"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VoiceVisualizer } from "@/components/voice-visualizer"
import { Mic, MicOff, PhoneOff, ArrowLeft, Bot, User } from "lucide-react"

type Transcript = { speaker: "user" | "agent"; text: string }

export default function OnboardingConversation() {
  const router = useRouter()
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [userName, setUserName] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [agentSpeaking, setAgentSpeaking] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of transcripts
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [transcripts])

  /* ---------------- LOG HELPER ---------------- */
  const log = (...args: any[]) => {
    console.log("[Onboarding]", ...args)
  }

  /* ---------------- AUDIO PLAY ---------------- */
  const playAudio = async (base64: string) => {
    try {
      setAgentSpeaking(true)
      log("Agent audio received")

      const audio = new Audio(`data:audio/mp3;base64,${base64}`)
      audio.onended = () => {
        setAgentSpeaking(false)
        log("Agent finished speaking")
      }

      await audio.play()
    } catch (error) {
      console.error("Audio playback failed:", error)
      setAgentSpeaking(false)
    }
  }

  /* ---------------- START MEETING ---------------- */
  const startMeeting = async () => {
    if (!userName.trim()) return alert("Enter your name")

    setStatus("connecting")
    log("Connecting…")

    try {
      const res = await fetch("/api/voice-meeting-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: userName,
          enable_dynamic_questions: true,
        }),
      })

      const data = await res.json()
      log("Session started", data.session_id)

      const ws = new WebSocket(data.websocket_url)
      wsRef.current = ws

      ws.onopen = async () => {
        setStatus("connected")
        log("WebSocket connected")

        const userStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setStream(userStream)

        const recorder = new MediaRecorder(userStream)
        recorderRef.current = recorder

        recorder.ondataavailable = (e) => {
          if (e.data.size) audioChunksRef.current.push(e.data)
        }

        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
          audioChunksRef.current = []

          const reader = new FileReader()
          reader.onloadend = () => {
            const base64 = reader.result?.toString().split(",")[1]
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ event: "audio.input", data: { audio: base64 } }))
              log("Audio sent")
            }
          }
          reader.readAsDataURL(blob)
        }
      }

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data)

        if (msg.event === "audio.output") playAudio(msg.data.audio)

        if (msg.event === "message") {
          setTranscripts((p) => [...p, { speaker: msg.data.type, text: msg.data.text }])
        }
      }

      ws.onclose = () => {
        log("WebSocket closed")
        setStatus("disconnected")
        setIsRecording(false)
        setAgentSpeaking(false)
        setStream(null)
      }
    } catch (error) {
      console.error("Failed to start meeting:", error)
      setStatus("disconnected")
    }
  }

  /* ---------------- END MEETING ---------------- */
  const endMeeting = () => {
    wsRef.current?.send(JSON.stringify({ event: "end_meeting" }))
    wsRef.current?.close()
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    log("Meeting ended")
  }

  /* ---------------- MIC TOGGLE ---------------- */
  const toggleMic = () => {
    if (!recorderRef.current || agentSpeaking) return

    if (!isRecording) {
      audioChunksRef.current = []
      recorderRef.current.start()
      setIsRecording(true)
      log("Recording started")
    } else {
      // Request visualizer to stop drawing
      recorderRef.current.stop()
      setIsRecording(false)
      log("Recording stopped")
    }
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex justify-center items-center p-4 md:p-8">
      <Card className="w-full max-w-4xl bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-2xl relative overflow-hidden flex flex-col md:flex-row h-[80vh]">

        {/* Left Panel: Controls & Status */}
        <div className="md:w-1/3 border-r border-slate-700/50 p-6 flex flex-col gap-6 bg-slate-900/40">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="self-start text-slate-400 hover:text-white hover:bg-slate-800 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Onboarding
            </h1>
            <p className="text-sm text-slate-400">Start your journey with our AI assistant.</p>
          </div>

          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Name</label>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name..."
                className="bg-slate-800/50 border-slate-700 focus:ring-blue-500/50 text-white placeholder:text-slate-500"
                disabled={status !== "disconnected"}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className={`w-3 h-3 rounded-full ${status === "connected" ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" :
                    status === "connecting" ? "bg-yellow-500 animate-pulse" :
                      "bg-slate-500"
                  }`} />
                <span className="text-sm font-medium text-slate-200 capitalize">{status}</span>
              </div>
            </div>

            {status === "connected" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Voice Signal</label>
                <div className="h-24 bg-slate-950/50 rounded-lg border border-slate-800 overflow-hidden relative">
                  {isRecording ? (
                    <VoiceVisualizer stream={stream} isRecording={isRecording} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs">
                      Microphone inactive
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-700/50 flex gap-3">
            {status === "disconnected" ? (
              <Button onClick={startMeeting} className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                Start Session
              </Button>
            ) : (
              <Button onClick={endMeeting} variant="destructive" className="w-full shadow-lg shadow-red-500/20">
                End Session
              </Button>
            )}
          </div>
        </div>

        {/* Right Panel: Conversation */}
        <div className="flex-1 flex flex-col bg-slate-950/30 relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />

          <div className="flex-1 p-6 overflow-hidden relative z-10">
            <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
              {transcripts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 opacity-50">
                  <Bot className="w-16 h-16" />
                  <p>Conversation will appear here...</p>
                </div>
              ) : (
                <div className="space-y-6 pb-4">
                  {transcripts.map((t, i) => (
                    <div
                      key={i}
                      className={`flex gap-4 ${t.speaker === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar className={`w-8 h-8 ${t.speaker === 'user' ? 'bg-blue-600' : 'bg-purple-600'} ring-2 ring-offset-2 ring-offset-slate-900 ${t.speaker === 'user' ? 'ring-blue-600/50' : 'ring-purple-600/50'}`}>
                        <AvatarFallback className="bg-transparent text-white text-xs">
                          {t.speaker === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>

                      <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${t.speaker === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                        }`}>
                        {t.text}
                      </div>
                    </div>
                  ))}
                  {agentSpeaking && (
                    <div className="flex gap-4">
                      <Avatar className="w-8 h-8 bg-purple-600 ring-2 ring-offset-2 ring-offset-slate-900 ring-purple-600/50 animate-pulse">
                        <AvatarFallback className="bg-transparent text-white text-xs">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1 p-4 rounded-2xl rounded-tl-none bg-slate-800 border border-slate-700">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Bottom Bar: Mic Control */}
          <div className="p-6 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur sticky bottom-0 z-20 flex justify-center">
            <Button
              size="lg"
              onClick={toggleMic}
              disabled={status !== "connected" || agentSpeaking}
              className={`rounded-full px-8 h-14 transition-all duration-300 ${isRecording
                  ? "bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse"
                  : "bg-white text-slate-900 hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-5 h-5 mr-2" />
                  Stop Speaking
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Start Speaking
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
