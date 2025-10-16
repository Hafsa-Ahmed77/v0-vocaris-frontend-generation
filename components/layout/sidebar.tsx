"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Bot, CalendarDays, Settings, ListChecks, MessageSquare } from "lucide-react"

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Bot },
  { href: "/meetings/123", label: "Meetings", icon: CalendarDays }, // example detail
  { href: "/scrum", label: "Scrum", icon: ListChecks },
  { href: "/chatbot", label: "Chatbot", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <div className="flex h-dvh flex-col">
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
          V
        </div>
        <span className="font-semibold">Vocaris</span>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-3">
        {nav.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
                active ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 pb-4 text-xs text-muted-foreground">v0.1 • AI-ready workspace</div>
    </div>
  )
}
