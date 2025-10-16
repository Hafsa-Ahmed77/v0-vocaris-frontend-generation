"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

type Msg = { id: string; role: "user" | "assistant"; content: string }

export function RAGMeetingChat({ meetingId }: { meetingId: string }) {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "1", role: "assistant", content: `Ask anything about meeting ${meetingId}.` },
  ])
  const [input, setInput] = useState("")

  function send() {
    if (!input.trim()) return
    const user: Msg = { id: crypto.randomUUID(), role: "user", content: input }
    const bot: Msg = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Placeholder: RAG answer scoped to this meeting transcript, summary, and action items.",
    }
    setMessages((m) => [...m, user, bot])
    setInput("")
  }

  return (
    <Card className="sticky top-20 rounded-2xl">
      <CardHeader>
        <CardTitle>Ask about this meeting</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ScrollArea className="h-64 rounded-xl border p-3">
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                <span
                  className={`inline-block rounded-xl px-3 py-2 text-sm ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex items-center gap-2">
          <Input
            placeholder="e.g. What were the key risks?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            aria-label="Chat prompt"
          />
          <Button onClick={send}>Send</Button>
        </div>
      </CardContent>
    </Card>
  )
}
