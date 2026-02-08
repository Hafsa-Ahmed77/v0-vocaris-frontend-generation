"use client"

import useSWR from "swr"
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings"
import { MeetingHistory } from "@/components/dashboard/meeting-history"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { getUpcomingMeetings, getMeetingHistory } from "@/lib/api"

// 🔁 SWR fetcher (existing – untouched)
const fetcher = () => getUpcomingMeetings()

export default function DashboardPage() {
  const [offset, setOffset] = useState(0)
  const limit = 50 
  // ================= Upcoming Meetings (AS IT IS) =================
  const { data, isLoading, error } = useSWR(
    "calendar-events",
    async () => {
      const token = localStorage.getItem("token")
      console.log("🔑 Dashboard Token:", token)

      if (!token) {
        console.warn("❌ No token found")
        return null
      }

      console.log("📡 Calling calendar events API...")
      const res = await getUpcomingMeetings()
      console.log("✅ Calendar API response:", res)
      return res
    }
  )

  // ================= Meeting History (NEW – SAME STYLE) =================
  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useSWR(
    ["meeting-history", offset], 
    async () => {
      const token = localStorage.getItem("token")
      if (!token) return null
  
      console.log("📡 Calling meeting history API...")
      const res = await getMeetingHistory(limit, offset) // <-- pass limit & offset
      console.log("📜 Meeting history API response:", res)
  
      return res
    },
    { keepPreviousData: true }
  )
  
  

  if (error) {
    return <div className="text-red-500">Failed to load calendar events</div>
  }

  if (historyError) {
    return <div className="text-red-500">Failed to load meeting history</div>
  }
// Handle "Load More"
const handleLoadMore = () => {
  setOffset((prev) => prev + limit)
}

const hasMore =
  historyData && historyData.total
    ? offset + limit < historyData.total
    : false
  return (
    <div className="grid gap-4">
      {/* ================= Upcoming Meetings ================= */}
      <section>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ) : (
              <>
                {/* Empty state */}
                {data?.events?.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No upcoming meetings in the next 15 days
                  </p>
                )}

                <UpcomingMeetings
                  items={
                    data?.events?.map((e: any) => ({
                      id: e.event_id,
                      title: e.title,
                      with: e.organizer,
                      start_time: e.start_time,
                      end_time: e.end_time,
                      meeting_url: e.meeting_url,
                      auto_join_enabled: e.auto_join_enabled,
                    })) || []
                  }
                />
              </>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ================= Meeting History ================= */}
      <section>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Meeting History</CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading && offset === 0 ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ) : (
              <>
                {historyData?.meetings?.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No past meetings found
                  </p>
                )}
                <MeetingHistory
                  items={historyData?.meetings?.map((m: any) => ({
                    id: m.id,
                    start_time: m.start_time,
                    end_time: m.end_time,
                    duration: m.duration_seconds,
                    meeting_url: m.meeting_url,
                    status: m.status,
                  })) || []}
                />
                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-4 flex justify-center">
                    <button
  onClick={handleLoadMore}
  disabled={historyLoading}
  className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
>
  {historyLoading ? "Loading…" : "Load More"}
</button>

                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
