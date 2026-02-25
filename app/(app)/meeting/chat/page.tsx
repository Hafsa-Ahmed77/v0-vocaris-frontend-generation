"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Cpu, Sparkles, Loader2, Zap, ArrowLeft, Terminal, Shield, Network, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"

type Message = {
  role: "user" | "ai"
  content: string
}

export default function MeetingChatPage() {
  const params = useSearchParams()
  const router = useRouter()
  const botId = params.get("botId")

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [initProgress, setInitProgress] = useState(0)
  const [initStatus, setInitStatus] = useState("LOCATING_TRANSCRIPT")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 10 Second Initialization Sequence
  useEffect(() => {
    if (!botId) return

    const duration = 10000
    const interval = 100
    const steps = duration / interval
    let currentStep = 0

    const statuses = [
      { threshold: 0, text: "INITIALIZING_NEURAL_LINK" },
      { threshold: 25, text: "LOCATING_TRANSCRIPT_BLOCKS" },
      { threshold: 50, text: "SYNTHESIZING_SEMANTIC_INDEX" },
      { threshold: 75, text: "CALIBRATING_QUERY_ENGINE" },
      { threshold: 90, text: "STABILIZING_CONTEXT_WINDOW" }
    ]

    const timer = setInterval(() => {
      currentStep++
      const progress = (currentStep / steps) * 100
      setInitProgress(progress)

      const currentStatus = [...statuses].reverse().find(s => progress >= s.threshold)
      if (currentStatus) setInitStatus(currentStatus.text)

      if (currentStep >= steps) {
        clearInterval(timer)
        setIsInitializing(false)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [botId])

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  useEffect(() => scrollToBottom(), [messages])

  if (!botId) return (
    <div className="flex-1 flex items-center justify-center p-6 bg-transparent">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 backdrop-blur-3xl shadow-2xl dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] max-w-xl w-full"
      >
        <div className="w-16 h-16 md:w-24 md:h-24 bg-blue-500/10 border border-blue-500/20 rounded-[1.8rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto text-blue-600 dark:text-blue-500 shadow-xl dark:shadow-[0_0_40px_rgba(59,130,246,0.2)]">
          <MessageSquare className="w-8 h-8 md:w-12 md:h-12" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Meeting Chat</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] max-w-[280px] mx-auto leading-loose text-balance">
            Unlock Meeting Insights. Your chat interactions and summary arise here.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] md:rounded-[1.8rem] h-12 md:h-16 px-6 md:px-12 font-bold text-sm md:text-lg shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
        >
          Return to Command Center
        </Button>
      </motion.div>
    </div>
  )

  const askQuestion = async () => {
    if (!input.trim() || loading) return

    const userMsg: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const data = await apiFetch("/meeting-query", {
        method: "POST",
        body: JSON.stringify({ botId, query: userMsg.content }),
      })
      setMessages((prev) => [...prev, { role: "ai", content: data.answer || "I've analyzed the transcript, but I couldn't find a specific answer for that. Could you try rephrasing?" }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "I encountered an error while analyzing the transcript. This might be because the meeting is still being processed. Please try again in a moment." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      askQuestion()
    }
  }

  return (
    <div className="flex flex-col h-full relative selection:bg-blue-500/30 overflow-hidden bg-slate-50 dark:bg-slate-800">
      {/* HUD Background Engine */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-20 dark:opacity-40">
          <div className="absolute top-[10%] left-[10%] w-px h-full bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
          <div className="absolute top-[10%] right-[10%] w-px h-full bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
          <div className="absolute top-[20%] left-0 w-full h-px bg-blue-500/15" />
          <div className="absolute bottom-[20%] left-0 w-full h-px bg-blue-500/15" />
        </div>

        {/* Dynamic Mesh */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-white dark:bg-transparent">
          <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-blue-600/[0.08] dark:bg-blue-600/[0.15] rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-indigo-600/[0.08] dark:bg-indigo-600/[0.15] rounded-full blur-[140px] animate-pulse [animation-delay:2s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.3)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#1e293b_100%)] opacity-50" />
        </div>

        {/* Cyber Grids */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)]" />
      </div>

      {/* Initialization HUD Overlay */}
      <AnimatePresence>
        {isInitializing && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 backdrop-blur-xl"
          >
            <div className="w-full max-w-lg px-6 md:px-12 space-y-12 relative">
              {/* Scanning Line Animation */}
              <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,1)] z-10"
              />

              <div className="flex flex-col items-center gap-10">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-40 h-40 rounded-full border border-dashed border-blue-500/30 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="w-32 h-32 rounded-full border border-blue-500/20 border-t-blue-500/60"
                    />
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu className="w-14 h-14 text-blue-500 animate-pulse shadow-2xl" />
                  </div>

                  {/* HUD Data Bits */}
                  <div className="absolute -top-4 -left-4 text-[8px] font-black text-blue-500/40 font-mono">X-882: NODE_READY</div>
                  <div className="absolute -bottom-4 -right-4 text-[8px] font-black text-blue-500/40 font-mono">SYNC: {Math.round(initProgress)}MS</div>
                </div>

                <div className="space-y-4 text-center">
                  <motion.h2
                    key={initStatus}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-[0.4em]"
                  >
                    {initStatus}
                  </motion.h2>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-blue-500/50" />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.3em]">SECURE_NEURAL_SYNTHESIS</p>
                    <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-blue-500/50" />
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <div className="relative h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden border border-slate-300 dark:border-white/10 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${initProgress}%` }}
                      className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-400 dark:from-blue-500 dark:via-indigo-500 dark:to-cyan-400 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                    />
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-ping" />
                      <span className="text-[9px] font-black text-blue-500/60 font-mono tracking-widest">ENCRYPTING_TUNNEL</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 font-mono">{Math.round(initProgress)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto px-6 md:px-12 pt-12 pb-8 relative z-10 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12">
          {messages.length === 0 && !isInitializing && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center space-y-10 mt-20"
            >
              <div className="relative group cursor-pointer">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 bg-blue-600/20 blur-[60px] rounded-full"
                />
                <div className="relative w-36 h-36 rounded-[3rem] bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-2xl transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
                  <Sparkles className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                  {/* HUD Accents */}
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-[0.1em]">Intelligence Active</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Context Window Ready</Badge>
                  <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">RAG Engine Online</Badge>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest max-w-lg leading-relaxed">
                  The semantic index is compiled. Type a query to unlock meeting insights.
                </p>
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex items-start gap-6 group/msg",
                  m.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={cn(
                    "mt-2 shrink-0 w-12 h-12 rounded-[1.25rem] flex items-center justify-center border shadow-xl relative z-10 overflow-hidden",
                    m.role === "user"
                      ? "bg-slate-900 dark:bg-indigo-600 border-slate-800 dark:border-indigo-500 text-white"
                      : "bg-blue-600 dark:bg-blue-600 border-blue-500 dark:border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  {m.role === "user" ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                </motion.div>

                <div
                  className={cn(
                    "max-w-[70%] rounded-[2rem] px-8 py-6 text-base leading-loose shadow-2xl transition-all duration-500 relative",
                    m.role === "user"
                      ? "bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-tr-none hover:border-indigo-500/30"
                      : "bg-gradient-to-br from-slate-100 to-white dark:from-blue-500/[0.05] dark:to-blue-600/[0.02] border border-slate-200 dark:border-blue-500/20 text-slate-700 dark:text-slate-100 rounded-tl-none backdrop-blur-3xl hover:border-blue-400/50 shadow-blue-900/10"
                  )}
                >
                  {/* Subtle Decal for AI messages */}
                  {m.role === "ai" && (
                    <div className="absolute top-4 right-6 opacity-5 dark:opacity-10">
                      <Shield className="w-12 h-12 text-blue-500" />
                    </div>
                  )}
                  <p className="relative z-10 font-medium tracking-tight whitespace-pre-wrap">{m.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-6">
              <div className="w-12 h-12 rounded-[1.25rem] bg-blue-600 border border-blue-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div className="bg-slate-100 dark:bg-blue-500/[0.08] border border-slate-200 dark:border-blue-500/20 rounded-[2rem] px-10 py-6 flex flex-col gap-2 backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center gap-4">
                  <Network className="w-4 h-4 text-blue-500 animate-pulse" />
                  <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] animate-pulse">Scanning Memory Bands...</span>
                </div>
                <div className="h-1 w-32 bg-slate-200 dark:bg-blue-500/20 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full w-full bg-blue-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-20" />
        </div>
      </main>

      {/* Futuristic floating glass console */}
      <footer className="relative z-20 pb-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto relative">
          {/* Console HUD Label */}
          <div className="absolute -top-10 left-10 flex items-center gap-3 opacity-40 group/label">
            <Terminal className="w-3 h-3 text-blue-500" />
            <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.5em] group-hover/label:text-blue-500 transition-colors">V-INTEL_TERMINAL :: STABLE</span>
          </div>

          <div className="relative group/console">
            {/* Glow Background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[3rem] blur-2xl opacity-0 group-focus-within/console:opacity-100 transition-opacity duration-700" />

            <div className="relative flex items-end gap-4 p-3 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-[2.8rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.4)] backdrop-blur-3xl ring-1 ring-white/20 transition-all duration-500 focus-within:ring-blue-500/40 focus-within:-translate-y-1">
              <div className="pl-6 pb-6 pr-2">
                <div className="p-3 rounded-full bg-slate-50 dark:bg-white/5 text-slate-400 group-hover/console:text-blue-500 transition-colors">
                  <PlusCircleIcon className="w-6 h-6" />
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Query the neural network..."
                className="flex-1 bg-transparent border-none py-6 px-2 text-lg font-medium text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-indigo-900/40 outline-none resize-none min-h-[72px] max-h-48 custom-scrollbar"
                rows={1}
              />
              <div className="pr-4 pb-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={askQuestion}
                    disabled={loading || !input.trim() || isInitializing}
                    className={cn(
                      "h-16 w-16 rounded-[1.8rem] transition-all duration-500 shadow-2xl relative overflow-hidden group/btn",
                      input.trim()
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/40"
                        : "bg-slate-200 dark:bg-white/5 text-slate-400 grayscale opacity-40 cursor-not-allowed"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1s_infinite]" />
                    <Send className="h-7 w-7 relative z-10" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between px-10">
            <div className="flex items-center gap-3">
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                <div className="relative w-2 h-2 rounded-full bg-green-500" />
              </div>
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] opacity-60">Neural Uplink Persistent</span>
            </div>
            <div className="flex items-center gap-6 opacity-40">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-slate-500" />
              <p className="text-[9px] text-slate-500 dark:text-slate-500 uppercase tracking-[0.4em] font-black">
                PROTOCOL_v2.5.9
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function PlusCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm", className)}>
      {children}
    </span>
  )
}
