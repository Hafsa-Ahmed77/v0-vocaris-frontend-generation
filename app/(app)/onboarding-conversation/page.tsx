"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { VoiceVisualizer } from "@/components/voice-visualizer"
import { Mic, MicOff, ArrowLeft, ArrowRight, Bot, User, Sparkles, Send, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [transcripts])

  const log = (...args: any[]) => console.log("[Onboarding]", ...args)

  const playAudio = async (base64: string) => {
    try {
      setAgentSpeaking(true)
      const audio = new Audio(`data:audio/mp3;base64,${base64}`)
      audio.onended = () => setAgentSpeaking(false)
      await audio.play()
    } catch (error) {
      console.error("Audio playback failed:", error)
      setAgentSpeaking(false)
    }
  }

  const startMeeting = async () => {
    if (!userName.trim()) return
    setStatus("connecting")
    try {
      const res = await fetch("/api/voice-meeting-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: userName, enable_dynamic_questions: true }),
      })
      const data = await res.json()
      const ws = new WebSocket(data.websocket_url)
      wsRef.current = ws
      ws.onopen = async () => {
        setStatus("connected")
        const userStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setStream(userStream)
        const recorder = new MediaRecorder(userStream)
        recorderRef.current = recorder
        recorder.ondataavailable = (e) => { if (e.data.size) audioChunksRef.current.push(e.data) }
        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
          audioChunksRef.current = []
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64 = reader.result?.toString().split(",")[1]
            if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ event: "audio.input", data: { audio: base64 } }))
          }
          reader.readAsDataURL(blob)
        }
      }
      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data)
        if (msg.event === "audio.output") playAudio(msg.data.audio)
        if (msg.event === "message") setTranscripts((p) => [...p, { speaker: msg.data.type, text: msg.data.text }])
      }
      ws.onclose = () => {
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

  const endMeeting = () => {
    wsRef.current?.send(JSON.stringify({ event: "end_meeting" }))
    wsRef.current?.close()
    if (stream) { stream.getTracks().forEach(track => track.stop()); setStream(null) }
  }

  const toggleMic = () => {
    if (!recorderRef.current || agentSpeaking) return
    if (!isRecording) {
      audioChunksRef.current = []
      recorderRef.current.start()
      setIsRecording(true)
    } else {
      recorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <header className="relative z-50 h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400 fill-blue-400" />
            <span className="text-sm font-bold tracking-tight">Onboarding Briefing</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <div className={`w-2 h-2 rounded-full ${String(status) === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">{String(status)}</span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full flex flex-col md:flex-row relative z-10 overflow-hidden">
        {/* Step 1: Entry */}
        <AnimatePresence mode="wait">
          {(status as string) !== "connected" ? (
            <motion.div
              key="entry"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col items-center justify-center p-8 space-y-12"
            >
              <div className="text-center space-y-4 max-w-xl">
                <motion.div
                  initial={{ rotate: -10, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20"
                >
                  <Bot className="w-12 h-12 text-white" />
                </motion.div>
                <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                  Identify Yourself.
                </h1>
                <p className="text-lg text-slate-400 text-balance leading-relaxed">
                  Before we establish the neural uplink, your assistant needs to know who it's analyzing for.
                </p>
              </div>

              <div className="w-full max-w-sm space-y-4">
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name..."
                  className="h-16 bg-white/5 border-white/10 text-xl font-medium rounded-2xl px-6 focus:ring-2 focus:ring-blue-500/30 transition-all text-center"
                />
                <Button
                  onClick={startMeeting}
                  disabled={!userName.trim() || (status as any) === "connecting"}
                  className="w-full h-16 bg-white text-[#020617] hover:bg-slate-100 font-bold text-lg rounded-2xl shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                >
                  {(status as any) === "connecting" ? "Establishing Link..." : "Initialize Briefing"}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col md:flex-row h-full overflow-hidden"
            >
              {/* Interaction Left */}
              <div className="md:w-1/3 p-8 flex flex-col justify-center space-y-8 border-r border-white/5">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Neural Link Active</h2>
                  <p className="text-sm text-slate-500">The assistant is listening and processing your voice footprint.</p>
                </div>

                <div className="aspect-square w-full max-w-[280px] mx-auto relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-500/5 rounded-full animate-pulse" />
                  <div className="absolute inset-4 bg-indigo-500/5 rounded-full animate-pulse [animation-delay:0.5s]" />
                  <VoiceVisualizer stream={stream} isRecording={isRecording} />
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={toggleMic}
                    disabled={agentSpeaking}
                    className={`w-full h-20 rounded-3xl font-bold text-lg flex items-center justify-center gap-4 transition-all ${isRecording
                      ? "bg-red-500/10 border border-red-500/20 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20"
                      }`}
                  >
                    {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    {isRecording ? "Mute Now" : "Speak to AI"}
                  </Button>
                  <Button variant="ghost" onClick={endMeeting} className="w-full h-14 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl">
                    Terminate Session
                  </Button>
                </div>
              </div>

              {/* Chat View Right */}
              <div className="flex-1 flex flex-col bg-white/[0.01]">
                <ScrollArea className="flex-1 p-8" ref={scrollAreaRef}>
                  <div className="space-y-6 max-w-2xl mx-auto">
                    {transcripts.length === 0 && (
                      <div className="flex gap-4 opacity-50">
                        <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                          <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse" />
                        </div>
                      </div>
                    )}
                    {transcripts.map((t, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: t.speaker === "user" ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex gap-4 ${t.speaker === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${t.speaker === "user"
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                          : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                          }`}>
                          {t.speaker === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${t.speaker === "user"
                          ? "bg-white/5 border border-white/10 text-white rounded-tr-none"
                          : "bg-indigo-500/10 border border-indigo-500/20 text-slate-200 rounded-tl-none"
                          }`}>
                          {t.text}
                        </div>
                      </motion.div>
                    ))}
                    {agentSpeaking && (
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl px-6 py-4 flex gap-1.5 items-center h-12">
                          <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Visualizer Footer for Mobile */}
                <div className="md:hidden p-4 border-t border-white/5 bg-black/20 flex justify-center">
                  <Button onClick={toggleMic} className="w-16 h-16 rounded-full bg-blue-600 shadow-xl shadow-blue-500/20">
                    {isRecording ? <MicOff /> : <Mic />}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Finishing Redirect */}
      {((status as unknown) as string) === "connected" && transcripts.length > 5 && (
        <div className="fixed bottom-12 right-12 z-50">
          <Button
            onClick={() => router.push("/dashboard")}
            className="h-20 px-10 bg-green-600 hover:bg-green-500 text-white font-black rounded-3xl shadow-2xl scale-110 active:scale-100 transition-all group"
          >
            Complete Onboarding
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  )
}
