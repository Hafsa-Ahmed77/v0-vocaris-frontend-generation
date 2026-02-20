"use client"

import { useState } from "react"
import { MoreVertical, Clock, Users } from "lucide-react"
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

  return (
    <div className="space-y-6">
      {items.map((m) => {
        const isLoading = loadingIds.includes(m.id)
        const isEnabled = m.auto_join_enabled === true

        const start = m.start_time ? new Date(m.start_time) : null
        const end = m.end_time ? new Date(m.end_time) : null

        const month = start?.toLocaleString("default", { month: "short" }).toUpperCase()
        const day = start?.getDate()

        return (
          <div
            key={m.id}
            className="group block bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start gap-5">
              {/* Date Badge */}
              <div className="shrink-0 w-16 h-20 bg-blue-50 rounded-2xl flex flex-col items-center justify-center border border-blue-100/50">
                <span className="text-[10px] font-black text-blue-400 tracking-widest">{month}</span>
                <span className="text-2xl font-black text-blue-600">{day}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-800 leading-tight truncate px-1">
                      {m.title}
                    </h3>
                    {start && end && (
                      <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                        <Clock className="w-4 h-4" />
                        <span>
                          {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {" "}-{" "}
                          {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                    isEnabled ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
                  )}>
                    {isEnabled ? "Confirmed" : "Pending"}
                  </div>
                </div>

                {/* Footer Section: Attendees & Menu */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-slate-400">U{i}</span>
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">+4</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">7 attendees</span>
                  </div>

                  <button
                    onClick={() => isEnabled ? handleDisableAutoJoin(m.id) : handleAutoJoin(m.id)}
                    disabled={isLoading}
                    className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <MoreVertical className="w-5 h-5" />
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
