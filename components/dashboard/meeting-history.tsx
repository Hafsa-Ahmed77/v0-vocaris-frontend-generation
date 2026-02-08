import { CalendarDays, Video, Clock } from "lucide-react"

type HistoryMeeting = {
  id: string
  start_time?: string
  end_time?: string
  duration?: number // seconds
  meeting_url?: string
  status?: string
}

export function MeetingHistory({ items }: { items: HistoryMeeting[] }) {
  return (
    <ul className="space-y-3">
      {items.map((m) => {
        const start = m.start_time ? new Date(m.start_time) : null
        const end = m.end_time ? new Date(m.end_time) : null

        const durationMinutes = m.duration
          ? Math.round(m.duration / 60)
          : null

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
                <div className="font-medium truncate">
                  Past Meeting
                </div>

                {start && end && (
                  <div className="text-sm text-muted-foreground">
                    {start.toLocaleDateString()} •{" "}
                    {start.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {end.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}

                {durationMinutes !== null && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="size-3" />
                    Duration: {durationMinutes} min
                  </div>
                )}

                {m.meeting_url && (
                  <a
                    href={m.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary mt-1 hover:underline"
                  >
                    <Video className="size-3" />
                    Open Meeting Link
                  </a>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <span
                className={`text-xs px-3 py-1 rounded-full capitalize ${
                  m.status === "ended"
                    ? "bg-green-100 text-green-700"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {m.status || "completed"}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
