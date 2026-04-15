"use client"

import useSWR, { mutate } from "swr"
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { QuickJoin } from "@/components/dashboard/quick-join"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Zap, MonitorPlay, LayoutDashboard, Search, Filter, SlidersHorizontal, Calendar, ArrowRight, CalendarClock, History, Users, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { getUpcomingMeetings, getMeetingStats, getMeetingHistory, startMeeting, getUserSessions, getUserJobs, getScheduledMeetings, endAllMeetings } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const router = useRouter()
  const [offset, setOffset] = useState(0)
  const [isStartingAgent, setIsStartingAgent] = useState(false)
  const [loadingScheduledIds, setLoadingScheduledIds] = useState<string[]>([])
  const [userName, setUserName] = useState("User")
  const limit = 50

  // Load user info
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserName(user.first_name || user.full_name || user.name || "User")
      } catch (e) {
        console.error("Failed to parse user from local storage", e)
      }
    }
  }, [])

  const { data: sessionData, isLoading: sessionsLoading } = useSWR(
    "user-sessions",
    async () => {
      const token = localStorage.getItem("token")
      if (!token) return null
      return await getUserSessions()
    },
    { refreshInterval: 10000 } // Refresh sessions every 10s
  )

  const activeSessions = sessionData?.sessions?.filter((s: any) => s.is_active) || []

  // Platform stats
  const { data: stats, isLoading: statsLoading } = useSWR("meeting-stats", async () => {
    const token = localStorage.getItem("token")
    if (!token) return null
    return await getMeetingStats()
  })

  const { data, isLoading } = useSWR("calendar-events", async () => {
    const token = localStorage.getItem("token")
    if (!token) return null
    return await getUpcomingMeetings()
  }, { refreshInterval: 30000 })

  const { data: historyData, isLoading: historyLoading } = useSWR(
    ["meeting-history", offset],
    async () => {
      const token = localStorage.getItem("token")
      if (!token) return null
      return await getMeetingHistory(limit, offset)
    },
    { keepPreviousData: true }
  )
  
  const { data: jobsData } = useSWR("user-jobs", async () => {
    const token = localStorage.getItem("token")
    if (!token) return null
    return await getUserJobs()
  })

  const jobs = Array.isArray(jobsData) ? jobsData : (jobsData?.jobs || [])

  const { data: scheduledData, mutate: mutateScheduled } = useSWR("scheduled-meetings", async () => {
    const token = localStorage.getItem("token")
    if (!token) return null
    return await getScheduledMeetings()
  })

  const scheduledMeetings = scheduledData?.meetings || []

  const handleEndAll = async () => {
    if (!window.confirm("Are you sure you want to terminate all active sessions? This action cannot be undone.")) return
    
    try {
      await endAllMeetings()
      toast.success("Successfully sent termination signal to all agents.")
      // Refresh session data
      mutate("user-sessions")
    } catch (err: any) {
      toast.error(err.message || "Failed to terminate sessions")
    }
  }

  const handleDisableScheduled = async (eventId: string) => {
    if (loadingScheduledIds.includes(eventId)) return
    try {
      setLoadingScheduledIds((prev) => [...prev, eventId])
      const { disableAutoJoin } = await import("@/lib/api")
      await disableAutoJoin(eventId)
      toast.success("Auto-join disabled for this meeting")
      mutate("scheduled-meetings")
      mutate("calendar-events")
    } catch (err: any) {
      toast.error(err.message || "Failed to disable auto-join")
    } finally {
      setLoadingScheduledIds((prev) => prev.filter((id) => id !== eventId))
    }
  }

  const handleStartAgent = async (url: string, isScrum: boolean, jobId?: string) => {
    try {
      setIsStartingAgent(true)
      const res = await startMeeting(url, isScrum, isScrum ? "Scrum Meeting" : "New Meeting", jobId)
      toast.success("Agent is joining the meeting!")

      // We still keep these for quick recovery, but the source of truth will be URL
      localStorage.setItem("botId", res.bot_id)
      localStorage.setItem("sessionId", res.session_id || "")
      localStorage.setItem("meetingUrl", url)
      localStorage.setItem("isScrum", String(res.is_scrum ?? isScrum))

      router.push(`/meeting/live?bot_id=${res.bot_id}&is_scrum=${res.is_scrum ?? isScrum}`)
    } catch (err: any) {
      toast.error(err.message || "Failed to start agent")
    } finally {
      setIsStartingAgent(false)
    }
  }

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit)
  }

  const activities = historyData?.meetings?.map((m: any) => ({
    id: m.id,
    type: "summary" as const,
    title: m.meeting_title || "Meeting Summary Generated",
    subtitle: m.meeting_url ? new URL(m.meeting_url).hostname : "Recorded Session",
    timeAgo: m.start_time ? formatDistanceToNow(new Date(m.start_time), { addSuffix: true }) : "recently",
    isScrum: m.is_scrum === true || m.is_scrum === "true" || Number(m.is_scrum) === 1 || m.scrum_mode === true || m.is_scrum_mode === true || m.meeting_title?.toLowerCase().includes("scrum") || false,
    botId: m.bot_id
  })) || []

  // Enhanced filtering for Upcoming Meetings
  const completedUrls = new Set(historyData?.history?.filter((m: any) => m.status === "completed" || m.transcript_count > 0).map((m: any) => m.meeting_url).filter(Boolean))
  const filteredEvents = data?.events?.filter((e: any) => {
    // 1. Skip if already exists in history with transcripts or completed status
    if (e.meeting_url && completedUrls.has(e.meeting_url)) return false

    // 2. Skip if it's strictly in the past (end_time < now)
    if (e.end_time && new Date(e.end_time) < new Date()) return false

    return true
  }) || []

  const meetingCount = data?.events?.length ?? 0
  const activityCount = activities.length

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Welcome Banner: Sapphire Duo (Light & Dark) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gradient-to-br dark:from-[#161E31] dark:to-[#0A0F1E] p-8 border border-[#E0E7FF] dark:border-[#2D3A54] rounded-[2rem] relative overflow-hidden group shadow-xl shadow-blue-500/5 dark:shadow-2xl">
        {/* Glow Effect (Dark Mode only) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-blue-500/10 dark:group-hover:bg-cyan-500/15 transition-colors duration-700" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="px-2 py-0.5 rounded-md bg-blue-500/10 dark:bg-cyan-500/20 text-blue-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20 dark:border-cyan-500/30">
              Active Session
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-[#1E293B] dark:text-white tracking-tight">Welcome, {userName}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium max-w-md">Your AI intelligence layer is synchronized and ready.</p>

          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-[#1E293B] dark:text-white font-bold text-xs backdrop-blur-sm shadow-sm dark:shadow-none">
              <Zap className="size-3.5 fill-blue-500 dark:fill-cyan-500 text-blue-500 dark:text-cyan-500" />
              {statsLoading ? "Scanning..." : `${stats?.active_in_call || 0} Live Sessions`}
            </div>
            {activeSessions.length > 0 && (
                <button 
                  onClick={handleEndAll}
                  className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-black text-[10px] uppercase tracking-wider rounded-lg border border-rose-500/20 transition-all active:scale-95"
                >
                  Terminate All
                </button>
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-[#1E293B] dark:text-white font-bold text-xs backdrop-blur-sm shadow-sm dark:shadow-none">
              <MonitorPlay className="size-3.5 text-slate-400 dark:text-azure-400" />
              {statsLoading ? "—" : `${stats?.total_sessions || 0} Records`}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-[#1E293B] flex items-center justify-center text-blue-600 dark:text-cyan-400 border border-slate-200 dark:border-[#334155] shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.15)] group-hover:shadow-md dark:group-hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-500">
            <LayoutDashboard className="size-10" />
          </div>
        </div>
      </div>

      {/* 🚀 NEW: Live Intelligence Sessions Section */}
      {activeSessions.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Live Intelligence Sessions</h2>
              <div className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 text-[8px] font-black uppercase tracking-widest border border-cyan-500/20">
                {activeSessions.length} Active
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeSessions.map((session: any) => (
              <div
                key={session.bot_id}
                onClick={() => router.push(`/meeting/live?bot_id=${session.bot_id}&is_scrum=${session.is_scrum}`)}
                className="group cursor-pointer relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative bg-white dark:bg-[#161E31] p-6 rounded-[2rem] border border-[#E0E7FF] dark:border-[#2D3A54] group-hover:border-cyan-500/50 transition-all shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                        <Zap className="size-5 fill-current" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[150px]">
                          {session.meeting_title || "Active Meeting"}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase tracking-widest">
                          {session.is_scrum ? "Scrum Mode" : "Analysis Mode"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                        <span className="text-cyan-500 font-black text-[9px] tracking-tight">UPLINK ACTIVE</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] text-slate-500 font-bold">
                          {Math.floor(session.uptime_seconds / 60)}m {session.uptime_seconds % 60}s
                        </p>
                        {session.transcript_count !== undefined && (
                          <>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <div className="flex items-center gap-1 text-blue-500 font-black text-[10px]">
                              <MessageSquare className="size-3" />
                              {session.transcript_count}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                    <span className="text-[10px] text-slate-400 font-bold truncate max-w-[180px]">
                      {session.meeting_url || "Direct Join"}
                    </span>
                    <ArrowRight className="size-4 text-cyan-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* Stats Cards: Sapphire Duo Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        <div className="bg-white dark:bg-gradient-to-b dark:from-[#1E293B] dark:to-[#161E31] rounded-[2rem] p-6 border border-[#E0E7FF] dark:border-[#2D3A54] hover:border-blue-500/30 dark:hover:border-cyan-500/30 transition-all group shadow-xl shadow-blue-500/[0.03] dark:shadow-none hover:shadow-blue-500/[0.08] dark:hover:shadow-cyan-900/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Total Meetings</span>
            <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20">
              <CalendarClock className="size-5" />
            </div>
          </div>
          <p className="text-4xl font-black text-[#1E293B] dark:text-white">{isLoading ? "—" : meetingCount}</p>
          <p className="text-xs text-slate-500 mt-2 font-bold tracking-tight">Active for current week</p>
        </div>

        <div className="bg-white dark:bg-gradient-to-b dark:from-[#1E293B] dark:to-[#161E31] rounded-[2rem] p-6 border border-[#E0E7FF] dark:border-[#2D3A54] hover:border-violet-500/30 transition-all group shadow-xl shadow-blue-500/[0.03] dark:shadow-none hover:shadow-violet-500/[0.08] dark:hover:shadow-violet-900/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Activity History</span>
            <div className="p-2 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-xl border border-violet-500/20">
              <History className="size-5" />
            </div>
          </div>
          <p className="text-4xl font-black text-[#1E293B] dark:text-white">{historyLoading ? "—" : activityCount}</p>
          <p className="text-xs text-slate-500 mt-2 font-bold tracking-tight">Records found in vault</p>
        </div>

        <div className="bg-white dark:bg-gradient-to-br dark:from-[#0A0F1E] dark:to-[#161E31] rounded-[2rem] p-6 border-2 border-blue-500/10 dark:border-cyan-500/20 relative overflow-hidden group shadow-xl shadow-blue-500/5 dark:shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-500/70">Global Telemetry</span>
            <Users className="size-5 text-blue-600 dark:text-cyan-400" />
          </div>
          <p className="text-4xl font-black text-[#1E293B] dark:text-white">{statsLoading ? "—" : stats?.unique_users || 0}</p>
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-tighter">Live</span>
              <span className="text-sm font-black text-blue-600 dark:text-cyan-400">{stats?.active_in_call || 0}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-tighter">Max Capacity</span>
              <span className="text-sm font-black text-blue-400 dark:text-azure-400">{stats?.max_total_sessions || 0}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Action + Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left Column (3/5): Action area */}
        <div className="lg:col-span-3 space-y-6">
          <QuickJoin onStartAgent={handleStartAgent} isLoading={isStartingAgent} jobs={jobs} />

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Upcoming Meetings</h2>
              </div>
              <button className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Calendar Grid</button>
            </div>

            <div className="max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-28 w-full rounded-[2rem] bg-slate-100/50" />
                  <Skeleton className="h-28 w-full rounded-[2rem] bg-slate-100/50" />
                </div>
              ) : (
                <UpcomingMeetings
                  items={filteredEvents.map((e: any) => {
                    const isScheduled = scheduledMeetings.some((sm: any) => sm.event_id === e.event_id || sm.id === e.event_id)
                    return {
                      id: e.event_id,
                      title: e.title,
                      with: e.organizer,
                      start_time: e.start_time,
                      end_time: e.end_time,
                      meeting_url: e.meeting_url,
                      auto_join_enabled: isScheduled || e.auto_join_enabled,
                    }
                  })}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column (2/5): History feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-violet-600 rounded-full" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Recent Meeting History</h2>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-violet-50 dark:bg-violet-900/10 rounded-lg border border-violet-100 dark:border-violet-800/20">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Realtime</span>
            </div>
          </div>

          <div className="max-h-[850px] overflow-y-auto pr-1 no-scrollbar">
            {historyLoading && offset === 0 ? (
              <div className="space-y-3">
                <Skeleton className="h-24 w-full rounded-[2rem] bg-slate-100/50" />
                <Skeleton className="h-24 w-full rounded-[2rem] bg-slate-100/50" />
              </div>
            ) : (
              <RecentActivities
                items={activities}
                onLoadMore={handleLoadMore}
                isLoading={historyLoading}
                hasMore={(historyData?.meetings?.length ?? 0) >= limit}
              />
            )}
          </div>
        </div>
      </div>

    </div>
  )
}


