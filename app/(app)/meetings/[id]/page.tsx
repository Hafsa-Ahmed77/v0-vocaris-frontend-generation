"use client"

import { useParams } from "next/navigation"
import useSWR from "swr"
import { getMeetingDetails } from "@/lib/placeholders/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { RAGMeetingChat } from "@/components/chat/meeting-chat"
import { Skeleton } from "@/components/ui/skeleton"

export default function MeetingDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useSWR(["meeting", id], () => getMeetingDetails(id))

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/3 rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>{data.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              {data.date} • {data.participants.join(", ")}
            </div>
            <div className="space-y-2">
              {data.transcript.map((t) => (
                <p key={t.time} className="text-sm leading-6">
                  <span className="mr-2 text-muted-foreground">{t.time}</span>
                  <strong className="mr-2">{t.speaker}:</strong>
                  {t.text}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Summaries</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {data.summaries.map((s, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left">{s.title}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 text-sm">
                      {s.points.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <aside className="lg:col-span-1">
        <RAGMeetingChat meetingId={id} />
      </aside>
    </div>
  )
}
