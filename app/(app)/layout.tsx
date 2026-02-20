"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.replace("/auth")
    } else {
      setAuthorized(true)
    }
  }, [router])

  if (!authorized) return null

  // Check if we are on dashboard or onboarding to remove sidebar/topbar
  const isCustomLayout = pathname === "/dashboard" ||
    pathname === "/onboarding-selection" ||
    pathname === "/onboarding-form" ||
    pathname === "/onboarding-conversation"

  if (isCustomLayout) {
    return <main className="min-h-dvh bg-[#020617]">{children}</main>
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r lg:block">
        <Sidebar />
      </aside>
      <div className="flex min-w-0 flex-col">
        <Topbar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}
