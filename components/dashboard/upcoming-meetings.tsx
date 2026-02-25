"use client"

import { useState } from "react"
import { Clock, Wifi, WifiOff, CalendarX, ExternalLink } from "lucide-react"
import { enableAutoJoin, disableAutoJoin } from "@/lib/api"
import { mutate } from "swr"
import { cn } from "@/lib/utils"

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

  const handleAutoJoin = async (eventId: string) => {
    if (loadingIds.includes(eventId)) return
    try {
      setLoadingIds((prev) => [...prev, eventId])
      await enableAutoJoin(eventId)
      mutate("calendar-events")
    } catch (err) {
      console.error(err)
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
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== eventId))
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-slate-100 shadow-sm text-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
          <CalendarX className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-600">No upcoming meetings</p>
          <p className="text-xs text-slate-400 mt-0.5">Your calendar is clear right now</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {items.map((m) => {
        const isLoading = loadingIds.includes(m.id)
        const isEnabled = m.auto_join_enabled === true

        const start = m.start_time ? new Date(m.start_time) : null
        const end = m.end_time ? new Date(m.end_time) : null

        const month = start?.toLocaleString("default", { month: "short" }).toUpperCase()
        const day = start?.getDate()
        const weekday = start?.toLocaleString("default", { weekday: "short" })

        const hostName = (() => {
          if (!m.meeting_url) return null
          try { return new URL(m.meeting_url).hostname.replace("www.", "") } catch { return m.meeting_url }
        })()

        const platformColor = hostName?.includes("google") ? "bg-blue-500"
          : hostName?.includes("zoom") ? "bg-sky-500"
            : hostName?.includes("teams") ? "bg-indigo-500"
              : "bg-slate-400"

        return (
          <div
            key={m.id}
            className={cn(
              "group relative bg-white border rounded-[2rem] shadow-sm hover:shadow-md overflow-hidden transition-all duration-300",
              isEnabled ? "border-green-100/50 hover:border-green-200" : "border-slate-100 hover:border-blue-100"
            )}
          >
            {/* Left accent stripe */}
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-1",
              isEnabled ? "bg-gradient-to-b from-green-400 to-emerald-500" : "bg-gradient-to-b from-blue-300 to-indigo-400 opacity-40 group-hover:opacity-100 transition-opacity"
            )} />

            <div className="flex items-center gap-5 p-6 pl-7">
              {/* Date badge */}
              <div className={cn(
                "shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-0.5 border shadow-sm",
                isEnabled ? "bg-green-50/50 border-green-100/50" : "bg-blue-50/50 border-blue-100/50"
              )}>
                <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 leading-none">{weekday}</span>
                <span className={cn("text-[10px] font-black tracking-widest leading-none mt-1", isEnabled ? "text-green-500" : "text-blue-400")}>{month ?? "—"}</span>
                <span className={cn("text-2xl font-black leading-none", isEnabled ? "text-green-600" : "text-blue-600")}>{day ?? "—"}</span>
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <h3 className="text-base font-black text-slate-900 truncate tracking-tight">{m.title}</h3>
                  <span className={cn(
                    "shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm transition-colors",
                    isEnabled
                      ? "bg-green-500 text-white border-green-400"
                      : "bg-slate-50 text-slate-400 border-slate-100"
                  )}>
                    {isEnabled ? "Auto-Join Active" : "Pending"}
                  </span>
                </div>

                {start && end && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <Clock className="size-3.5 shrink-0 text-slate-300" />
                    <span>
                      {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {" – "}
                      {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}

                {/* Footer row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-3 border-t border-slate-50 gap-4">
                  {hostName ? (
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={cn("w-2.5 h-2.5 rounded-full shrink-0 ring-4 ring-slate-50/50", platformColor)} />
                      <span className="text-[11px] text-slate-500 font-bold tracking-tight truncate max-w-[140px] md:max-w-none">{hostName}</span>
                      {m.meeting_url && (
                        <a href={m.meeting_url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-blue-500 transition-all shrink-0">
                          <ExternalLink className="size-3.5" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <span />
                  )}

                  <button
                    onClick={() => isEnabled ? handleDisableAutoJoin(m.id) : handleAutoJoin(m.id)}
                    disabled={isLoading}
                    className={cn(
                      "flex items-center justify-center gap-2 px-6 py-2.5 sm:px-4 sm:py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm w-full sm:w-auto",
                      isEnabled
                        ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100 hover:shadow"
                        : "bg-blue-600 text-white border-blue-500 hover:bg-blue-700 hover:shadow-md active:translate-y-0"
                    )}
                  >
                    {isLoading
                      ? <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin inline-block" />
                      : isEnabled
                        ? <><WifiOff className="size-3.5" /> Disable</>
                        : <><Wifi className="size-3.5" /> Enable Bot</>
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
