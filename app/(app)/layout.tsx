"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Menu, Home } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
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

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {pathname === "/dashboard" && (
                <motion.div
                  whileHover={{ scale: 1.1, y: -1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="relative rounded-xl w-9 h-9 sm:w-10 sm:h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-500/20 text-slate-600 dark:text-blue-400 shadow-sm hover:shadow-blue-500/20 hover:border-blue-500 transition-all group overflow-hidden"
                  >
                    <Link href="/">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.3)_0%,transparent_70%)] blur-md transition-opacity" />
                      <Home className="size-4 sm:size-5 relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all" />
                    </Link>
                  </Button>
                </motion.div>
              )}
              <ThemeToggle />
              <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block" />

              {/* Conditional Indicator or Action Portal */}
              {pathname === "/meeting/scrum" ? (
                <div id="scrum-header-action" className="flex items-center min-w-0" />
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live</span>
                </div>
              )}
            </div>
          </header>

          {/* <Topbar /> */}
          <main className="flex-1 p-4 lg:p-10">{children}</main>
        </div>
      </div>
    </div>
  )
}
