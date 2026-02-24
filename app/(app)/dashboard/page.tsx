"use client"

import useSWR from "swr"
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { QuickJoin } from "@/components/dashboard/quick-join"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarClock, History, Zap, MonitorPlay, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { getUpcomingMeetings, getMeetingHistory, startMeeting, getMeetingStats } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const router = useRouter()
  const [offset, setOffset] = useState(0)
  const [isStartingAgent, setIsStartingAgent] = useState(false)
  const [userName, setUserName] = useState("User")
  const limit = 50

  // Load user info
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserName(user.full_name || user.name || "User")
      } catch (e) {
        console.error("Failed to parse user from local storage", e)
      }
    }
  }, [])

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
  })

  const { data: historyData, isLoading: historyLoading } = useSWR(
    ["meeting-history", offset],
    async () => {
      const token = localStorage.getItem("token")
      if (!token) return null
      return await getMeetingHistory(limit, offset)
    },
    { keepPreviousData: true }
  )

  const handleStartAgent = async (url: string, isScrum: boolean) => {
    try {
      setIsStartingAgent(true)
      const res = await startMeeting(url, isScrum, isScrum ? "Scrum Meeting" : "New Meeting")
      toast.success("Agent is joining the meeting!")
      localStorage.setItem("botId", res.bot_id)
      localStorage.setItem("sessionId", res.session_id || "")
      localStorage.setItem("meetingUrl", url)
      localStorage.setItem("isScrum", String(res.is_scrum ?? isScrum))
      router.push("/meeting/live")
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

  const meetingCount = data?.events?.length ?? 0
  const activityCount = activities.length

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Welcome Banner (Replacing older header) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100/50 transition-colors duration-500" />
        <div className="relative">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back, {userName}</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium italic">"The best way to predict the future is to automate it."</p>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/50 text-xs font-bold">
              <Zap className={cn("size-3.5 fill-blue-600", stats?.active_in_call > 0 && "animate-pulse")} />
              {statsLoading ? "Scanning..." : `${stats?.active_in_call || 0} Active In-Call`}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-xl border border-green-100/50 text-xs font-bold">
              <MonitorPlay className="size-3.5 fill-green-600" />
              {stats?.total_sessions || 0} Briefings Processed
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <LayoutDashboard className="size-6" />
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meetings</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CalendarClock className="size-5" />
            </div>
          </div>
          <p className="text-4xl font-black text-slate-900">{isLoading ? "—" : meetingCount}</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Scheduled for this week</p>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recordings</span>
            <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
              <History className="size-5" />
            </div>
          </div>
          <p className="text-4xl font-black text-slate-900">{historyLoading ? "—" : activityCount}</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Last 30 days history</p>
        </div>

        <div className="bg-slate-950 rounded-[2rem] p-6 border border-slate-800 shadow-xl text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Platform Stats</span>
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <Users className="size-5 fill-white" />
            </div>
          </div>
          <p className="text-4xl font-black mb-1">{statsLoading ? "—" : stats?.unique_users || 0}</p>
          <p className="text-xs text-slate-400 font-medium">Global Active Intelligent Users</p>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500">Max Load</span>
              <span className="text-sm font-bold text-blue-400">{stats?.max_total_sessions || 0}cap</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500">Live Uplinks</span>
              <span className="text-sm font-bold text-green-400">{stats?.active_in_call || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Action + Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left Column (3/5): Action area */}
        <div className="lg:col-span-3 space-y-6">
          <QuickJoin onStartAgent={handleStartAgent} isLoading={isStartingAgent} />

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
                  items={data?.events?.map((e: any) => ({
                    id: e.event_id,
                    title: e.title,
                    with: e.organizer,
                    start_time: e.start_time,
                    end_time: e.end_time,
                    meeting_url: e.meeting_url,
                    auto_join_enabled: e.auto_join_enabled,
                  })) || []}
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

function LayoutDashboard(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  )
}
