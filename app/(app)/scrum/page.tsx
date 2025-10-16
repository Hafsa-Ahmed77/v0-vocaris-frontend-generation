"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function ScrumPage() {
  const [yesterday, setYesterday] = useState("")
  const [today, setToday] = useState("")
  const [blockers, setBlockers] = useState("")
  const { toast } = useToast()

  function send(destination: "slack" | "clickup") {
    // Placeholder integration
    toast({
      title: `Sent to ${destination === "slack" ? "Slack" : "ClickUp"}`,
      description: "Your scrum update was queued successfully.",
    })
  }

  const preview = `Yesterday: ${yesterday || "-"}\nToday: ${today || "-"}\nBlockers: ${blockers || "-"}`

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Daily Update</CardTitle>
          <CardDescription>Share your progress and blockers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="yesterday">Yesterday</Label>
            <Textarea id="yesterday" value={yesterday} onChange={(e) => setYesterday(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="today">Today</Label>
            <Textarea id="today" value={today} onChange={(e) => setToday(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="blockers">Blockers</Label>
            <Textarea id="blockers" value={blockers} onChange={(e) => setBlockers(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <pre className="whitespace-pre-wrap rounded-xl bg-muted p-4 text-sm">{preview}</pre>
          <div className="flex gap-2">
            <Button onClick={() => send("slack")}>Send to Slack</Button>
            <Button variant="outline" onClick={() => send("clickup")}>
              Send to ClickUp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
