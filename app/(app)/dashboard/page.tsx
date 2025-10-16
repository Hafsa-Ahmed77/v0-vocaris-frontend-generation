"use client"

import useSWR from "swr"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings"
import { MeetingSummariesTable } from "@/components/dashboard/meeting-summaries-table"
import { RAGChatWidget } from "@/components/chat/rag-chat-widget"
import {
  aiParticipationData,
  getOverviewMetrics,
  getUpcomingMeetings,
  getMeetingSummaries,
} from "@/lib/placeholders/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

const fetcher = (key: string, ...args: any[]) =>
  // simple fetcher over placeholder functions
  (async () => {
    switch (key) {
      case "overview":
        return getOverviewMetrics()
      case "upcoming":
        return getUpcomingMeetings()
      case "summaries":
        return getMeetingSummaries()
      default:
        return null
    }
  })()

export default function DashboardPage() {
  const { data: overview, isLoading: loadingOverview } = useSWR(["overview"], fetcher)
  const { data: upcoming, isLoading: loadingUpcoming } = useSWR(["upcoming"], fetcher)
  const { data: summaries, isLoading: loadingSummaries } = useSWR(["summaries"], fetcher)

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <section>
          {loadingOverview ? <Skeleton className="h-28 w-full rounded-xl" /> : <OverviewCards data={overview} />}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>AI Participation</CardTitle>
            </CardHeader>
            <CardContent className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aiParticipationData} margin={{ right: 16, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="var(--brand-cyan)" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingUpcoming ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ) : (
                <UpcomingMeetings items={upcoming || []} />
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Meeting Summaries</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSummaries ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full rounded-xl" />
                  <Skeleton className="h-8 w-full rounded-xl" />
                </div>
              ) : (
                <MeetingSummariesTable rows={summaries || []} />
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      <aside className="lg:col-span-1">
        <RAGChatWidget />
      </aside>
    </div>
  )
}
