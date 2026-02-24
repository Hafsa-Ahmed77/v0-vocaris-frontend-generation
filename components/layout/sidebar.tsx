"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Bot,
  Settings,
  ListChecks,
  MessageSquare,
  LayoutDashboard,
  Info,
  X,
  Radio,
  Sparkles
} from "lucide-react"

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/meeting/scrum", label: "Scrum Analysis", icon: ListChecks },
  { href: "/meeting/chat", label: "Meeting Chat", icon: MessageSquare },
]

const secondaryNav = [
  { href: "/", label: "Help & Support", icon: Info },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar({ onClose, isMobile }: { onClose?: () => void; isMobile?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-300 font-sans border-r border-slate-800/50">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-900/20 ring-1 ring-white/20">
            <Bot className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white">Vocaris AI</span>
            <span className="text-[10px] text-slate-500 font-medium leading-none">Intelligence Engine</span>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-slate-500 hover:text-white transition-colors lg:hidden"
            aria-label="Close Menu"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
        <div>
          <p className="px-2 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Workspace</p>
          <nav className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault()
                    if (onClose) onClose()
                    router.push(item.href)
                  }}
                  onMouseEnter={() => router.prefetch(item.href)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20 shadow-inner"
                      : "hover:bg-slate-900 hover:text-white"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className={cn(
                    "size-5 transition-colors",
                    active ? "text-blue-500" : "text-slate-500 group-hover:text-slate-300"
                  )} />
                  {item.label}
                  {active && (
                    <div className="ml-auto w-1 h-4 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div>
          <p className="px-2 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">System</p>
          <nav className="space-y-1">
            {secondaryNav.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault()
                    if (onClose) onClose()
                    router.push(item.href)
                  }}
                  onMouseEnter={() => router.prefetch(item.href)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20"
                      : "hover:bg-slate-900 hover:text-white"
                  )}
                >
                  <Icon className={cn(
                    "size-5 transition-colors",
                    active ? "text-blue-500" : "text-slate-500 group-hover:text-slate-300"
                  )} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info
      <div className="p-4 mt-auto">
        <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Storage Status</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
          </div>
          <p className="text-[10px] text-slate-500">4.5 GB of 10 GB used</p>
        </div>
        <div className="mt-4 px-2 flex items-center justify-between text-[10px] text-slate-600">
          <span>v0.8.2-PRO</span>
          <span className="h-1 w-1 rounded-full bg-slate-700" />
          <span>BETA ACCESS</span>
        </div>
      </div> */}
    </div>
  )
}
