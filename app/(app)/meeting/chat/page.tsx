"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Send, PlusCircle, ArrowLeft, Bot, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { apiFetch } from "@/lib/api"
import { SiteHeader } from "@/components/site-header"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  if (!botId) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Invalid Meeting Session</h1>
        <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
      </div>
    </div>
  )

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  useEffect(() => scrollToBottom(), [messages])

  const askQuestion = async () => {
    if (!input.trim() || loading) return

    const userMsg: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const data = await apiFetch("/query-meeting", {
        method: "POST",
        body: JSON.stringify({ botId, query: userMsg.content }),
      })
      setMessages((prev) => [...prev, { role: "ai", content: data.answer }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "I encountered an error while analyzing the transcript. Please try asking again." },
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
    <div className="min-h-screen bg-[#020617] flex flex-col relative selection:bg-blue-500/30 overflow-hidden">

      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 border-b border-white/5 bg-white/[0.01] backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Intelligence Chat
            </h1>
            <p className="text-xs text-slate-500">Analyze meeting insights with Vocaris AI</p>
          </div>
        </div>

        <Button
          variant="outline"
          className="hidden sm:flex gap-2 bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-xl"
          onClick={() => router.push("/start-meeting")}
        >
          <PlusCircle className="h-4 w-4" />
          New Meeting
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60 max-w-md mx-auto mt-20">
            <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Bot className="w-10 h-10 text-blue-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Ask anything</h2>
              <p className="text-sm text-slate-400">
                Type a question about the meeting to get instant answers, summaries, or key takeaways.
              </p>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${m.role === "user"
                ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                }`}>
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-xl ${m.role === "user"
                  ? "bg-white/5 border border-white/10 text-white rounded-tr-none"
                  : "bg-blue-500/10 border border-blue-500/20 text-slate-200 rounded-tl-none backdrop-blur-sm"
                  }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl px-6 py-4 flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="relative z-10 p-4 md:p-6 bg-white/[0.01] backdrop-blur-xl border-t border-white/5">
        <div className="max-w-4xl mx-auto flex gap-4 items-end">
          <div className="relative flex-1 group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Vocaris AI..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all resize-none min-h-[56px] max-h-32"
              rows={1}
            />
          </div>
          <Button
            onClick={askQuestion}
            disabled={loading || !input.trim()}
            className="h-14 w-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="mt-3 text-center text-[10px] text-slate-600 uppercase tracking-widest font-bold">
          Powered by Vocaris Intelligence
        </p>
      </footer>
    </div>
  )
}
