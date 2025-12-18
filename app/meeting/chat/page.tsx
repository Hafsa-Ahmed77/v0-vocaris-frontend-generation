"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Send, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

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

  if (!botId) return <div className="p-10 text-center text-gray-700">Invalid meeting</div>

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  useEffect(() => scrollToBottom(), [messages])

  const askQuestion = async () => {
    if (!input.trim()) return

    const userMsg: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/query-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId, query: userMsg.content }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: "ai", content: data.answer }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Unable to retrieve an answer at the moment. Please try again." },
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
    <section className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white shadow-sm">
        <div>
          <h1 className="text-lg font-semibold">Transcript Chat</h1>
          <p className="text-xs text-gray-500">Ask questions based on your meeting transcript</p>
        </div>

        <Button
          variant="outline"
          className="gap-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white"
          onClick={() => router.push("/start-meeting")}
        >
          <PlusCircle className="h-4 w-4" />
          Start New Meeting
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-2xl ${m.role === "user" ? "ml-auto text-right" : ""}`}>
            <div
              className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-900"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {loading && <p className="text-sm text-gray-500">Analyzing transcript…</p>}
      </main>

      <footer className="border-t border-gray-200 p-4 flex gap-3 bg-white shadow-sm">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the meeting transcript…"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none resize-none focus:border-blue-400"
        />
        <Button onClick={askQuestion} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Send className="h-4 w-4" />
        </Button>
      </footer>
    </section>
  )
}
