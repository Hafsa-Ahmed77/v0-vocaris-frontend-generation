import { CalendarDays } from "lucide-react"

type Meeting = {
  id: string
  title: string
  time: string
  with: string
}

export function UpcomingMeetings({ items }: { items: Meeting[] }) {
  return (
    <ul className="space-y-2">
      {items.map((m) => (
        <li key={m.id} className="flex items-center justify-between rounded-xl border p-3">
          <div className="flex min-w-0 items-center gap-3">
            <CalendarDays className="size-4 text-muted-foreground" />
            <div className="truncate">
              <div className="truncate font-medium">{m.title}</div>
              <div className="text-xs text-muted-foreground">
                {m.time} • {m.with}
              </div>
            </div>
          </div>
          <a className="text-sm text-primary underline underline-offset-4" href={`/meetings/${m.id}`}>
            Open
          </a>
        </li>
      ))}
    </ul>
  )
}
