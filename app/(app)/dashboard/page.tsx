"use client"

import useSWR from "swr"
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { QuickJoin } from "@/components/dashboard/quick-join"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Menu, Moon, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { getUpcomingMeetings, getMeetingHistory, startMeeting } from "@/lib/api"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

export default function DashboardPage() {
  const router = useRouter()
  const [offset, setOffset] = useState(0)
  const [isStartingAgent, setIsStartingAgent] = useState(false)
  const limit = 50

  const { data, isLoading } = useSWR(
    "calendar-events",
    async () => {
      const token = localStorage.getItem("token")
      if (!token) return null
      return await getUpcomingMeetings()
    }
  )

  const {
    data: historyData,
    isLoading: historyLoading,
  } = useSWR(
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
      if (res.meeting_id) {
        router.push(`/onboarding-conversation?meetingId=${res.meeting_id}`)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start agent")
    } finally {
      setIsStartingAgent(false)
    }
  }

  // Map history data to activities format
  const activities = historyData?.meetings?.map((m: any) => ({
    id: m.id,
    type: "summary" as const, // Defaulting to summary to match design aesthetics
    title: m.meeting_title || "Meeting Summary Generated",
    subtitle: m.meeting_url ? new URL(m.meeting_url).hostname : "Recorded Session",
    timeAgo: m.start_time ? formatDistanceToNow(new Date(m.start_time), { addSuffix: true }) : "recently",
    isScrum: m.is_scrum === true || m.is_scrum === "true" || Number(m.is_scrum) === 1 || m.scrum_mode === true || m.is_scrum_mode === true || m.meeting_title?.toLowerCase().includes("scrum") || false,
    botId: m.bot_id
  })) || []

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-10 font-sans">
      <div className="max-w-2xl mx-auto px-6 py-8 md:py-12 space-y-10">

        {/* Header Section */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Agent Dashboard</h1>
              <p className="text-sm font-bold text-slate-400">Ready to automate your next meeting.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-slate-600">
              <Moon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
          </div>
        </header>

        {/* Quick Join Section */}
        <QuickJoin onStartAgent={handleStartAgent} isLoading={isStartingAgent} />

        {/* Upcoming Meetings Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Upcoming Meetings</h2>
            <button className="text-sm font-black text-blue-500 hover:text-blue-600 flex items-center gap-1.5 group">
              View Calendar
              <span className="text-[10px] transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-[2rem] bg-white border border-slate-100" />
              <Skeleton className="h-32 w-full rounded-[2rem] bg-white border border-slate-100" />
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
        </section>

        {/* Recent Activities Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight px-1">Recent Activities</h2>

          {historyLoading && offset === 0 ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-[2rem] bg-white border border-slate-100" />
              <Skeleton className="h-20 w-full rounded-[2rem] bg-white border border-slate-100" />
            </div>
          ) : (
            <RecentActivities items={activities} />
          )}
        </section>

      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
