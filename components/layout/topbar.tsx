"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/auth/user-menu"
import { useSession } from "next-auth/react"

export function Topbar() {
  const { data: session } = useSession()

  return (
    <div className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b bg-background/70 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Input className="max-w-md" placeholder="Search meetings, people, or actions" aria-label="Search" />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5" />
        </Button>
        <UserMenu session={session} />
      </div>
    </div>
  )
}
