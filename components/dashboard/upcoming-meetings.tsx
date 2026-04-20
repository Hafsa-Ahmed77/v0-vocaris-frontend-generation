"use client"

import { useState } from "react"
import { Clock, Wifi, WifiOff, CalendarX, ExternalLink } from "lucide-react"
import { enableAutoJoin, disableAutoJoin } from "@/lib/api"
import { mutate } from "swr"
import { cn } from "@/lib/utils"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Meeting = {
  id: string
  title: string
  with: string
  start_time?: string
  end_time?: string
  meeting_url?: string
  auto_join_enabled?: boolean
}

const MeetingCard = ({ m, isLoading, isEnabled, handleAutoJoin, handleDisableAutoJoin }: any) => {
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
        "group relative bg-white dark:bg-gradient-to-br dark:from-[#161E31] dark:to-[#0A0F1E] border rounded-[2rem] shadow-xl shadow-blue-500/[0.03] dark:shadow-2xl overflow-hidden transition-all duration-300",
        isEnabled
          ? "border-emerald-500/30 dark:border-emerald-500/30 hover:border-emerald-500/50"
          : "border-[#E0E7FF] dark:border-[#2D3A54] hover:border-blue-500/30 dark:hover:border-cyan-500/30"
      )}
    >
      {/* Left accent stripe */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1.5",
        isEnabled ? "bg-emerald-500" : "bg-blue-500 dark:bg-cyan-500 opacity-20 group-hover:opacity-100 transition-opacity"
      )} />

      <div className="flex items-center gap-5 p-6 pl-7">
        {/* Date badge */}
        <div className={cn(
          "shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-0.5 border shadow-inner",
          isEnabled
            ? "bg-emerald-500/10 border-emerald-500/20"
            : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10"
        )}>
          <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 dark:text-slate-500 leading-none">{weekday}</span>
          <span className={cn("text-[10px] font-black tracking-widest leading-none mt-1", isEnabled ? "text-emerald-600 dark:text-emerald-500" : "text-blue-600 dark:text-cyan-500")}>{month ?? "—"}</span>
          <span className={cn("text-2xl font-black leading-none", isEnabled ? "text-emerald-700 dark:text-emerald-400" : "text-[#1E293B] dark:text-white")}>{day ?? "—"}</span>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-1">
            <h3 className="text-base font-black text-[#1E293B] dark:text-white truncate tracking-tight">{m.title}</h3>
            <span className={cn(
              "shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm transition-colors",
              isEnabled
                ? "bg-emerald-500 text-white dark:text-[#0A0F1E] border-emerald-400"
                : "bg-slate-50 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10"
            )}>
              {isEnabled ? "Auto Join Enabled" : "Standby"}
            </span>
          </div>

          {start && end && (
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <Clock className="size-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
              <span>
                {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                {" – "}
                {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          )}

          {/* Footer row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-white/5 gap-4">
            {hostName ? (
              <div className="flex items-center gap-2 min-w-0">
                <div className={cn("w-2.5 h-2.5 rounded-full shrink-0 ring-4 ring-slate-50 dark:ring-white/5", platformColor)} />
                <span className="text-[11px] text-slate-500 dark:text-slate-500 font-bold tracking-tight truncate max-w-[140px] md:max-w-none">{hostName}</span>
                {m.meeting_url && (
                  <a href={m.meeting_url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-cyan-500 transition-all shrink-0">
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
                "flex items-center justify-center gap-2 px-6 py-2.5 sm:px-4 sm:py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-lg w-full sm:w-auto",
                isEnabled
                  ? "bg-slate-50 dark:bg-white/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-slate-100 dark:hover:bg-white/10"
                  : "bg-blue-600 dark:bg-cyan-500 text-white dark:text-[#0A0F1E] border-blue-500 dark:border-cyan-400/50 hover:bg-blue-700 dark:hover:bg-cyan-400 hover:-translate-y-0.5 active:translate-y-0"
              )}
            >
              {isLoading
                ? <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin inline-block" />
                : isEnabled
                  ? <><WifiOff className="size-3.5" /> Disable Agent</>
                  : <><Wifi className="size-3.5" /> Enable Agent</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UpcomingMeetings({ items }: { items: Meeting[] }) {
  const [loadingIds, setLoadingIds] = useState<string[]>([])

  const handleAutoJoin = async (eventId: string) => {
    if (loadingIds.includes(eventId)) return
    try {
      setLoadingIds((prev) => [...prev, eventId])
      await enableAutoJoin(eventId)
      mutate("calendar-events")
      mutate("scheduled-meetings")
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
      mutate("scheduled-meetings")
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== eventId))
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 bg-slate-50 dark:bg-[#0d1117]/50 rounded-2xl border border-slate-200 dark:border-[#2D3A54] text-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/20 flex items-center justify-center">
          <CalendarX className="w-5 h-5 text-blue-500 dark:text-cyan-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No upcoming meetings</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Your calendar is currently clear</p>
        </div>
      </div>
    )
  }

  const maxInitial = 5
  const displayItems = items.slice(0, maxInitial)
  const hasMore = items.length > maxInitial

  return (
    <div className="space-y-4 relative pb-4">
      {displayItems.map((m) => (
        <MeetingCard 
          key={m.id} 
          m={m} 
          isLoading={loadingIds.includes(m.id)} 
          isEnabled={m.auto_join_enabled === true} 
          handleAutoJoin={handleAutoJoin} 
          handleDisableAutoJoin={handleDisableAutoJoin} 
        />
      ))}

      {hasMore && (
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full mt-4 py-4 rounded-[2rem] border border-blue-500/20 dark:border-cyan-500/20 bg-blue-50/50 dark:bg-[#161E31]/50 hover:bg-blue-50 dark:hover:bg-white/5 text-xs font-black uppercase tracking-widest text-blue-600 dark:text-cyan-500 transition-all active:scale-[0.98] shadow-sm">
              Open Complete Schedule ({items.length} Total)
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden bg-slate-50 dark:bg-[#0A0F1E] border-slate-200 dark:border-white/10 flex flex-col sm:rounded-[2rem]">
            <DialogHeader className="p-6 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#161E31] z-10 shadow-sm relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-cyan-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <DialogTitle className="flex items-center gap-3 text-xl font-black text-[#1E293B] dark:text-white">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-cyan-500 border border-blue-500/20">
                    <CalendarX className="w-5 h-5" />
                  </div>
                  Schedule Vault
                </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-[#0A0F1E] relative">
              {items.map((m) => (
                <MeetingCard 
                  key={m.id} 
                  m={m} 
                  isLoading={loadingIds.includes(m.id)} 
                  isEnabled={m.auto_join_enabled === true} 
                  handleAutoJoin={handleAutoJoin} 
                  handleDisableAutoJoin={handleDisableAutoJoin} 
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

