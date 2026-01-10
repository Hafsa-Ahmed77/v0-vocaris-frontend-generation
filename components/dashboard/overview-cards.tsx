import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Props = {
  data?: {
    totalMeetings: number
    aiParticipationRate: number
    avgResponseTime: string
    actionItemsThisWeek: number
  }
}

export function OverviewCards({ data }: Props) {
  if (!data) return null
  const items = [
    { label: "Total Meetings", value: data.totalMeetings },
    { label: "AI Participation", value: `${data.aiParticipationRate}%`, badge: "↑" },
    { label: "Avg Response", value: data.avgResponseTime },
    { label: "Action Items (7d)", value: data.actionItemsThisWeek },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((i) => (
        <Card key={i.label} className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{i.label}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-2xl font-semibold">{i.value}</div>
            {i.badge && <Badge variant="outline">{i.badge}</Badge>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
