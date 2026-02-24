"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { ThemeToggle } from "@/components/theme-toggle"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.replace("/auth")
    } else {
      setAuthorized(true)
    }
  }, [router])

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  if (!authorized) return null

  // Check if we are on dashboard or onboarding to remove sidebar/topbar
  const isCustomLayout = pathname === "/onboarding-selection" ||
    pathname === "/onboarding-form" ||
    pathname === "/onboarding-conversation"

  if (isCustomLayout) {
    return <main className="min-h-dvh bg-[#020617]">{children}</main>
  }

  // Determine current page title
  const pageTitle = pathname === "/dashboard" ? "Dashboard" :
    pathname === "/meeting/live" ? "Live Session" :
      pathname === "/meeting/scrum" ? "Scrum Analysis" :
        pathname === "/meeting/chat" ? "Meeting Chat" :
          pathname.startsWith("/meetings") ? "Meetings" :
            pathname.startsWith("/scrum") ? "Scrum Boards" :
              pathname.startsWith("/history") ? "Activity Logs" : "Dashboard"

  return (
    <div className="relative min-h-dvh bg-slate-50 dark:bg-[#0f172a] transition-colors duration-500">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="grid min-h-dvh lg:grid-cols-[280px_1fr]">
        {/* Sidebar container with mobile drawer support */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-[60] w-[280px] transform border-r transition-transform duration-300 ease-in-out lg:relative lg:block lg:translate-x-0 bg-[#0f172a]",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} isMobile={true} />
        </aside>

        <div className="flex min-w-0 flex-col">
          {/* Persistent Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/80 dark:bg-[#0f172a]/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors lg:hidden"
                aria-label="Open Menu"
              >
                <Menu className="size-6" />
              </button>
              <div className="flex flex-col">
                <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">{pageTitle}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 hidden sm:block">Intelligence Overview</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live</span>
              </div>
            </div>
          </header>

          {/* <Topbar /> */}
          <main className="flex-1 p-4 lg:p-10">{children}</main>
        </div>
      </div>
    </div>
  )
}
