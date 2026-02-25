"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mic,
  MicOff,
  ArrowLeft,
  ArrowRight,
  Bot,
  User,
  Sparkles,
  Zap,
  Terminal,
  ShieldCheck,
  Cpu,
  Network,
  Waves,
  Loader2,
  Moon,
  Sun
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type Transcript = { speaker: "user" | "agent"; text: string }

export default function OnboardingConversation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [userName, setUserName] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [agentSpeaking, setAgentSpeaking] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [mappingProgress, setMappingProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isInterrupted, setIsInterrupted] = useState(false)

  const [isDarkMode, setIsDarkMode] = useState(true)
  const [theme, setTheme] = useState<"purple" | "blue">("blue")

  const wsRef = useRef<WebSocket | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Initialize theme from URL or localStorage
  useEffect(() => {
    const themeParam = searchParams.get("theme") as "purple" | "blue"
    const savedTheme = localStorage.getItem("vocaris_theme") as "purple" | "blue"
    if (themeParam && (themeParam === "purple" || themeParam === "blue")) {
      setTheme(themeParam)
    } else if (savedTheme && (savedTheme === "purple" || savedTheme === "blue")) {
      setTheme(savedTheme)
    }
  }, [searchParams])

  // Color dynamic classes helper
  const accentColor = theme === "purple" ? "purple" : "blue"
  const themeClasses = {
    text: theme === "purple" ? "text-purple-500" : "text-blue-500",
    textLight: theme === "purple" ? "text-purple-400" : "text-blue-400",
    bg: theme === "purple" ? "bg-purple-600" : "bg-blue-600",
    bgHover: theme === "purple" ? "bg-purple-500" : "bg-blue-500",
    bgAlpha: theme === "purple" ? "bg-purple-500/10" : "bg-blue-500/10",
    bgAlphaStrong: theme === "purple" ? "bg-purple-500/20" : "bg-blue-500/20",
    border: theme === "purple" ? "border-purple-500/20" : "border-blue-500/20",
    borderStrong: theme === "purple" ? "border-purple-500/40" : "border-blue-500/40",
    glow: theme === "purple" ? "shadow-purple-500" : "shadow-blue-500",
    ring: theme === "purple" ? "focus:ring-purple-500/40" : "focus:ring-blue-500/40",
    gradient: theme === "purple" ? "from-purple-600 to-indigo-600" : "from-blue-600 to-indigo-600",
    selection: theme === "purple" ? "selection:bg-purple-500/30" : "selection:bg-blue-500/30",
    atmosGlow: theme === "purple" ? (isDarkMode ? "bg-purple-600/[0.05]" : "bg-purple-400/[0.1]") : (isDarkMode ? "bg-blue-600/[0.05]" : "bg-blue-400/[0.1]")
  }

  // Optimized Precision Timer & Mapping Sync
  useEffect(() => {
    let interval: any
    if (status === "connected" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [status, timeLeft > 0]) // Re-run if status changes or timer reaches 0

  // Sync Mapping Progress to timeLeft
  useEffect(() => {
    setMappingProgress(Math.floor(((60 - timeLeft) / 60) * 100))
  }, [timeLeft])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [transcripts])

  // Prefetch Dashboard when session ends or is about to end
  useEffect(() => {
    if (timeLeft === 0 && status === "connected") {
      router.prefetch("/dashboard")
    }
  }, [timeLeft, status, router])

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
    setIsInterrupted(false)
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
        try {
          const msg = JSON.parse(e.data)
          if (!msg || !msg.event) return

          if (msg.event === "audio.output" && msg.data?.audio) {
            playAudio(msg.data.audio)
          }
          if (msg.event === "message" && msg.data) {
            setTranscripts((p) => [...p, { speaker: msg.data.type, text: msg.data.text }])
          }
        } catch (err) {
          console.error("WebSocket message parse error:", err)
        }
      }
      ws.onclose = () => {
        // If the websocket closes before 60 seconds and we didn't end it manually, it's an interruption
        if (timeLeft > 0 && status === "connected") {
          setIsInterrupted(true)
        }
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

  const resetSession = () => {
    setStatus("disconnected")
    setIsInterrupted(false)
    setTranscripts([])
    setTimeLeft(60)
  }

  const toggleMic = () => {
    if (!recorderRef.current || agentSpeaking || timeLeft === 0) return
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
    <div className={cn(
      "min-h-dvh transition-colors duration-500 flex flex-col relative font-sans",
      themeClasses.selection,
      isDarkMode ? "bg-[#161e2e] text-white" : "bg-slate-50 text-slate-900"
    )}>
      {/* Neural Matrix Background Engine */}
      <NeuralMatrixBackground active={isDarkMode} themeColor={theme === "purple" ? "text-purple-500" : "text-blue-500"} />

      {/* Atmos Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={cn(
          "absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[120px]",
          themeClasses.atmosGlow
        )} />
        <div className={cn(
          "absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[120px]",
          isDarkMode ? "bg-indigo-600/[0.05]" : "bg-indigo-400/[0.1]"
        )} />
      </div>

      {/* Header HUD */}
      <header className={cn(
        "relative z-50 w-full h-20 md:h-24 border-b flex items-center justify-between px-6 md:px-8 backdrop-blur-3xl",
        isDarkMode ? "border-white/5 bg-slate-900/40" : "border-slate-200 bg-white/40"
      )}>
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className={cn(
              "p-2.5 rounded-xl border transition-all active:scale-90",
              isDarkMode ? "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20" : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
            )}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="hidden md:flex flex-col">
            <div className="flex items-center gap-2">
              <Zap className={cn("w-3.5 h-3.5 fill-current", themeClasses.text)} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Neural Uplink</span>
            </div>
            <span className={cn(
              "text-[10px] uppercase font-bold tracking-widest mt-0.5",
              isDarkMode ? "text-slate-500" : "text-slate-400"
            )}>Session.Active_Beta</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Premium Theme Switcher */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={cn(
              "relative w-14 h-7 rounded-full p-1 transition-all duration-500 border overflow-hidden",
              isDarkMode ? "bg-slate-800 border-white/10" : "bg-white border-slate-200 shadow-inner"
            )}
          >
            <motion.div
              animate={{ x: isDarkMode ? 28 : 0 }}
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center shadow-sm relative z-10",
                isDarkMode ? (theme === 'purple' ? "bg-purple-600" : "bg-blue-600") + " text-white" : "bg-orange-500 text-white"
              )}
            >
              {isDarkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
            </motion.div>
          </button>

          <div className={cn(
            "hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-full border shadow-lg",
            theme === 'purple'
              ? (isDarkMode ? "bg-purple-500/5 border-purple-500/20 shadow-purple-500/10" : "bg-purple-50 border-purple-100 shadow-purple-500/5")
              : (isDarkMode ? "bg-blue-500/5 border-blue-500/20 shadow-blue-500/10" : "bg-blue-50 border-blue-100 shadow-blue-500/5")
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              status === 'connected' ? "bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" :
                status === 'connecting' ? "bg-amber-500 animate-bounce" : "bg-slate-600"
            )} />
            <span className={cn("text-[10px] uppercase font-black tracking-[0.2em]", themeClasses.textLight)}>
              {status === 'disconnected' ? "Offline" : status}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row relative z-10">
        <AnimatePresence mode="wait">
          {(status !== "connected" || isInterrupted) ? (
            <motion.div
              key={isInterrupted ? "interrupted" : "entry"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="relative mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className={cn("absolute inset-[-15px] border border-dashed rounded-full", isInterrupted ? "border-red-500/40" : themeClasses.border)}
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    "w-32 h-32 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-2xl",
                    isInterrupted ? "bg-gradient-to-tr from-red-600 to-orange-600 shadow-red-500/30" : themeClasses.gradient,
                    !isInterrupted && (theme === 'purple' ? "shadow-purple-500/30" : "shadow-blue-500/30")
                  )}
                >
                  {isInterrupted ? <MicOff className="w-16 h-16 text-white" /> : <Bot className="w-16 h-16 text-white" />}
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 max-w-xl"
              >
                <div className={cn("flex items-center justify-center gap-3 mb-2", isInterrupted ? "text-red-500" : themeClasses.text)}>
                  {isInterrupted ? <Zap className="w-4 h-4 animate-pulse" /> : <ShieldCheck className="w-4 h-4" />}
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                    {isInterrupted ? "Uplink Terminated Prematurely" : "Neural Profile Sync"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                  {isInterrupted ? "Connection \n Interrupted" : "Voice Identity \n Extraction"}
                </h1>
                <p className={cn(
                  "font-bold uppercase tracking-widest text-[10px] opacity-60",
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                )}>
                  {isInterrupted
                    ? `The connection was lost with ${timeLeft}s remaining. Please re-establish the uplink.`
                    : "Please identify yourself to begin your 60-second voice briefing."}
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12 w-full max-w-sm space-y-4"
              >
                {!isInterrupted && (
                  <div className="relative group">
                    <Terminal className={cn("absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 group-focus-within:opacity-100 transition-opacity", themeClasses.text)} />
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="IDENTIFY YOURSELF..."
                      className={cn(
                        "h-14 border text-lg font-black rounded-xl pl-14 pr-6 transition-all tracking-widest uppercase placeholder:opacity-20",
                        themeClasses.ring,
                        isDarkMode ? "bg-white/[0.03] border-white/10" : "bg-slate-100 border-slate-200"
                      )}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={startMeeting}
                    disabled={(isInterrupted ? false : !userName.trim()) || status === "connecting"}
                    className={cn(
                      "w-full h-16 text-white font-black text-lg rounded-2xl shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group",
                      isInterrupted ? "bg-red-600 hover:bg-red-500 shadow-red-500/20" : themeClasses.bg,
                      !isInterrupted && themeClasses.bgHover,
                      !isInterrupted && (theme === 'purple' ? "shadow-purple-500/20" : "shadow-blue-500/20")
                    )}
                  >
                    {status === "connecting" ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        {isInterrupted ? "RE-ESTABLISH UPLINK" : "ESTABLISH UPLINK"}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  {isInterrupted && (
                    <button
                      onClick={resetSession}
                      className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors"
                    >
                      CANCEL AND START OVER
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col md:flex-row md:h-full"
            >
              {/* Visualizer Left HUD - Responsive Clamped Height */}
              <div className="w-full md:w-[400px] md:h-full p-6 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 bg-slate-900/20 backdrop-blur-md z-20 shrink-0">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", themeClasses.bgAlpha, themeClasses.textLight)}>
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Core Engine</span>
                      <span className="text-sm font-bold uppercase tracking-tight">V-Intel x64</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className={cn("flex justify-between text-[10px] font-black uppercase tracking-widest", themeClasses.textLight)}>
                      <span>Neural Extraction Progress</span>
                      <span>{mappingProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${mappingProgress}%` }}
                        className={cn("h-full", themeClasses.bg, theme === 'purple' ? "shadow-[0_0_10px_rgba(168,85,247,0.8)]" : "shadow-[0_0_10px_rgba(59,130,246,0.8)]")}
                      />
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Identity Extraction</span>
                      <div className={cn("flex items-center gap-1.5", themeClasses.textLight)}>
                        <Loader2 className={cn("w-2 h-2 animate-spin", timeLeft === 0 && "hidden")} />
                        <span className="text-[10px] font-black tabular-nums">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative flex flex-col items-center justify-center scale-90 md:scale-100">
                  <div className="aspect-square w-full max-w-[180px] md:max-w-[280px] relative flex items-center justify-center">
                    {/* Premium Circular Visualizer Rings */}
                    <motion.div
                      animate={isRecording ? { scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={cn("absolute inset-0 rounded-full border", themeClasses.border)}
                    />
                    <motion.div
                      animate={agentSpeaking ? { scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] } : {}}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="absolute inset-6 rounded-full border border-indigo-500/20"
                    />
                    <AdvancedVisualizer active={isRecording || agentSpeaking} type={isRecording ? 'pulse' : 'wave'} themeColor={theme} />
                  </div>

                  <div className="mt-8 text-center space-y-2">
                    <span className={cn("text-[10px] font-black uppercase tracking-[0.4em] animate-pulse", themeClasses.text)}>
                      {isRecording ? "Listening..." : agentSpeaking ? "Agent Speaking..." : "Uplink Standby"}
                    </span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-50">
                      Capturing high-fidelity voice metrics
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={toggleMic}
                    disabled={agentSpeaking || timeLeft === 0}
                    className={cn(
                      "w-full h-24 rounded-[2rem] font-black text-xl flex flex-col items-center justify-center gap-2 transition-all shadow-2xl",
                      isRecording
                        ? "bg-red-600 border border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)] text-white"
                        : timeLeft === 0
                          ? "bg-slate-800 border-white/5 text-slate-500 cursor-not-allowed"
                          : cn(themeClasses.bg, themeClasses.bgHover, "text-white border shadow-lg", theme === 'purple' ? "border-purple-400 shadow-purple-500/20" : "border-blue-400 shadow-blue-500/20")
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                      {timeLeft === 0 ? "SESSION ENDED" : isRecording ? "MUTE" : "TALK NOW"}
                    </div>
                    <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-70">
                      {timeLeft === 0 ? "Neural profile locked" : "Push to Command"}
                    </span>
                  </Button>

                  <button
                    onClick={endMeeting}
                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-red-400 transition-colors"
                  >
                    TERMINATE UPLINK
                  </button>
                </div>
              </div>

              {/* HUD Chat Panels Right */}
              <div className="flex-1 flex flex-col md:h-full">
                <ScrollArea className="flex-1 md:h-full w-full" ref={scrollAreaRef}>
                  <div className="p-6 md:p-10 pt-10 md:pt-20 space-y-8 max-w-3xl mx-auto pb-40">
                    {transcripts.length === 0 && (
                      <div className="flex flex-col items-center space-y-4 opacity-10 py-12">
                        <Network className="w-12 h-12" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Neural Inputs...</span>
                      </div>
                    )}
                    {transcripts.map((t, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: t.speaker === "user" ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex gap-6 ${t.speaker === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xl flex-shrink-0 mt-1",
                          t.speaker === "user"
                            ? (theme === 'purple' ? "bg-purple-600/10 border-purple-500/30 text-purple-400" : "bg-blue-600/10 border-blue-500/30 text-blue-400")
                            : "bg-indigo-600/10 border-indigo-500/30 text-indigo-400"
                        )}>
                          {t.speaker === "user" ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                        </div>
                        <div className={cn(
                          "rounded-[1.5rem] px-6 py-5 border backdrop-blur-xl relative group max-w-[85%]",
                          t.speaker === "user"
                            ? cn("border-white/10 rounded-tr-none", isDarkMode ? "bg-white/[0.03] text-white" : "bg-slate-200/50 text-slate-900 border-slate-300/50")
                            : cn("border-indigo-500/20 rounded-tl-none shadow-lg shadow-indigo-500/5", isDarkMode ? "bg-indigo-500/10 text-slate-100" : "bg-indigo-50 text-indigo-900 border-indigo-200")
                        )}>
                          {/* HUD Decoration Corner */}
                          <div className="absolute top-0 right-0 p-2 opacity-20">
                            <span className={cn("text-[8px] font-black uppercase tracking-widest", isDarkMode ? "text-slate-500" : "text-slate-400")}>
                              {t.speaker === 'user' ? 'RX_DATA' : 'TX_DATA'}
                            </span>
                          </div>

                          <p className="text-sm md:text-base font-medium leading-relaxed">
                            {t.text}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    {agentSpeaking && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                          <Bot className="w-6 h-6" />
                        </div>
                        <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl px-6 py-4 flex gap-2 items-center h-12">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse [animation-delay:0.4s]" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>

                {/* Bottom Floating Header for Mobile / Tablet */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 py-2 px-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl opacity-40">
                  <span className="text-[8px] font-black uppercase tracking-[0.4em]">Live_Stream.v7</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Finishing Action - Only shows when 1-minute briefing is 100% complete */}
      <AnimatePresence>
        {status === "connected" && timeLeft === 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-10 right-10 z-50"
          >
            <button
              onClick={() => router.push("/dashboard")}
              className="h-20 px-12 bg-green-600 hover:bg-green-500 text-white font-black rounded-full shadow-[0_0_40px_rgba(34,197,94,0.4)] flex items-center gap-4 border border-green-400 transition-all active:scale-95 group"
            >
              <Sparkles className="w-6 h-6 animate-pulse" />
              FINALIZE ONBOARDING
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AdvancedVisualizer({ active, type, themeColor }: { active: boolean; type: 'pulse' | 'wave'; themeColor: 'purple' | 'blue' }) {
  const isPurple = themeColor === 'purple'
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Core Circle */}
      <motion.div
        animate={active ? { scale: [1, 1.15, 1], opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
        className={cn(
          "w-32 h-32 rounded-full border-4 flex items-center justify-center relative",
          type === 'pulse' ? "border-red-500/40" : (isPurple ? "border-purple-500/40" : "border-blue-500/40")
        )}
      >
        <div className={cn(
          "w-24 h-24 rounded-full bg-gradient-to-tr opacity-20 blur-xl",
          type === 'pulse' ? "from-red-600 to-orange-600" : (isPurple ? "from-purple-600 to-indigo-600" : "from-blue-600 to-indigo-600")
        )} />
        <Waves className={cn("w-12 h-12 relative z-10", type === 'pulse' ? "text-red-400" : (isPurple ? "text-purple-400" : "text-blue-400"))} />
      </motion.div>

      {/* Orbiting Elements */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 5 + i * 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className={cn(
            "w-2 h-2 rounded-full absolute top-0 left-1/2 -translate-x-1/2",
            type === 'pulse' ? "bg-red-400 shadow-[0_0_10px_red]" : (isPurple ? "bg-purple-400 shadow-[0_0_10px_purple]" : "bg-blue-400 shadow-[0_0_10px_blue]")
          )} />
        </motion.div>
      ))}
    </div>
  )
}

function NeuralMatrixBackground({ active, themeColor }: { active: boolean; themeColor: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Grid Pattern */}
      <svg className={cn(
        "absolute inset-0 w-full h-full",
        active ? "opacity-[0.08]" : "opacity-[0.03]"
      )}>
        <pattern id="matrix-conversation" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="currentColor" className={themeColor} />
          <line x1="2" y1="2" x2="80" y2="2" stroke="currentColor" strokeWidth="0.5" className={themeColor + "/20"} />
        </pattern>
        <rect width="100%" height="100%" fill="url(#matrix-conversation)" />
      </svg>

      {/* Matrix Data Lines */}
      <div className="absolute inset-0 opacity-[0.04]">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 10 + i * 4, repeat: Infinity, ease: "linear" }}
            className={cn("absolute w-px h-full bg-gradient-to-b from-transparent to-transparent", themeColor.includes('purple') ? "via-purple-500" : "via-blue-500")}
            style={{ left: `${20 + i * 15}%` }}
          />
        ))}
      </div>
    </div>
  )
}
