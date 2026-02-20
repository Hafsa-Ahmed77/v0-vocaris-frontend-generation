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
    <ul className="space-y-4">
      {items.map((m) => {
        const start = m.start_time ? new Date(m.start_time) : null
        const end = m.end_time ? new Date(m.end_time) : null

        const durationMinutes = m.duration
          ? Math.round(m.duration / 60)
          : null

        return (
          <li
            key={m.id}
            className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.05] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            {/* LEFT */}
            <div className="flex gap-5 min-w-0">
              <div className="mt-1 shrink-0">
                <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20 text-slate-400 group-hover:scale-110 transition-transform">
                  <CalendarDays className="size-6" />
                </div>
              </div>

              <div className="min-w-0 space-y-1.5">
                <div className="font-bold text-lg text-white">
                  Past Meeting Session
                </div>

                {start && end && (
                  <div className="text-sm text-slate-400 flex items-center gap-2">
                    <span className="font-medium text-slate-300">{start.toLocaleDateString()}</span>
                    <span className="text-slate-600">•</span>
                    <span>
                      {start.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      –{" "}
                      {end.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-1">
                  {durationMinutes !== null && (
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      Duration: <span className="text-slate-400 font-medium">{durationMinutes} min</span>
                    </div>
                  )}

                  {m.meeting_url && (
                    <a
                      href={m.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Video className="size-3.5" />
                      View Meeting Link
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="shrink-0">
              <span
                className={`text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider border transition-colors ${m.status === "ended"
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : "bg-white/5 border-white/10 text-slate-400"
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
