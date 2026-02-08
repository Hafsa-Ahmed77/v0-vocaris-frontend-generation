import { useState } from "react"
import { CalendarDays, Video } from "lucide-react"
import { enableAutoJoin } from "@/lib/api"
import { disableAutoJoin } from "@/lib/api"
import { mutate } from "swr"

type Meeting = {
  id: string
  title: string
  with: string
  start_time?: string
  end_time?: string
  meeting_url?: string
  auto_join_enabled?: boolean 
}

export function UpcomingMeetings({ items }: { items: Meeting[] }) {
  const [loadingIds, setLoadingIds] = useState<string[]>([])
  const [enabledIds, setEnabledIds] = useState<string[]>([])

  const handleAutoJoin = async (eventId: string) => {
    if (loadingIds.includes(eventId)) return
  
    try {
      setLoadingIds((prev) => [...prev, eventId])
      await enableAutoJoin(eventId)
      mutate("calendar-events")
      // ❌ enabledIds update hata do
    } catch (err) {
      console.error(err)
      alert("❌ Failed to enable auto join")
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== eventId))
    }
  }
  
  
  const handleDisableAutoJoin = async (eventId: string) => {
    if (loadingIds.includes(eventId)) return
  
    try {
      setLoadingIds((prev) => [...prev, eventId])
      await disableAutoJoin(eventId)
      mutate("calendar-events")
    } catch (err) {
      console.error(err)
      alert("❌ Failed to disable auto join")
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== eventId))
    }
  }
  
  
  return (
    <ul className="space-y-3">
      {items.map((m) => {
        const isLoading = loadingIds.includes(m.id)
        const isEnabled = m.auto_join_enabled === true


        const start = m.start_time ? new Date(m.start_time) : null
        const end = m.end_time ? new Date(m.end_time) : null

        return (
          <li
            key={m.id}
            className="rounded-2xl border bg-background p-4 flex items-center justify-between"
          >
            {/* LEFT */}
            <div className="flex gap-4 min-w-0">
              <div className="mt-1">
                <CalendarDays className="size-5 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <div className="font-medium truncate">{m.title}</div>

                {start && end && (
                  <div className="text-sm text-muted-foreground">
                    {start.toLocaleDateString()} •{" "}
                    {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
                    –{" "}
                    {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Organizer: {m.with}
                </div>

                {m.meeting_url && (
                  <a
                    href={m.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary mt-1 hover:underline"
                  >
                    <Video className="size-3" />
                    Join Google Meet
                  </a>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center">
            {isEnabled ? (
  <button
    onClick={() => handleDisableAutoJoin(m.id)}
    disabled={isLoading}
    className={`text-sm px-4 py-2 rounded-xl bg-red-500 text-white transition ${
      isLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
    }`}
  >
    {isLoading ? "Disabling…" : "Disable Auto Join"}
  </button>
) : (
  <button
    onClick={() => handleAutoJoin(m.id)}
    disabled={isLoading}
    className={`text-sm px-4 py-2 rounded-xl bg-black text-white transition ${
      isLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
    }`}
  >
    {isLoading ? "Enabling…" : "Enable Auto Join"}
  </button>
)}

            </div>
          </li>
        )
      })}
    </ul>
  )
}
