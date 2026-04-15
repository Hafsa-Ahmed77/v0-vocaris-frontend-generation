"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { logout } from "@/lib/api"
import { Logo } from "@/components/logo"
import {
  Bot,
  Settings,
  ListChecks,
  MessageSquare,
  LayoutDashboard,
  Info,
  X,
  LogOut,
  ChevronUp,
  User as UserIcon,
  Briefcase,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/onboarding-jobs", label: "Job Manager", icon: Briefcase },
  { href: "/meeting/scrum", label: "Scrum Analysis", icon: ListChecks },
  { href: "/meeting/chat", label: "Meeting Chat", icon: MessageSquare },
]

const secondaryNav = [
  { href: "/", label: "Help & Support", icon: Info },
  { href: "/settings", label: "Settings", icon: Settings },
]

interface UserProfile {
  first_name?: string
  last_name?: string
  email?: string
  profile_picture_url?: string
  // legacy fallback fields (just in case)
  name?: string
  picture?: string
}

export function Sidebar({ onClose, isMobile }: { onClose?: () => void; isMobile?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [profileExpanded, setProfileExpanded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      router.replace("/auth")
    } catch {
      router.replace("/auth")
    }
  }

  const displayName =
    (user?.first_name
      ? `${user.first_name}${user.last_name ? " " + user.last_name : ""}`
      : null) ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "User"

  const avatarUrl = user?.profile_picture_url || user?.picture || null

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-300 font-sans border-r border-slate-800/50">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/">
          <Logo className="scale-75 origin-left" variant="white" />
        </Link>
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
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8 no-scrollbar">
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

      {/* User Profile Card */}
      <div className="p-3 border-t border-slate-800/50">
        <button
          onClick={() => setProfileExpanded((p) => !p)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-900 transition-all duration-200 group"
        >
          {/* Avatar */}
          <Avatar className="h-9 w-9 rounded-xl ring-1 ring-white/10 overflow-hidden bg-slate-800 shrink-0">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-black uppercase">
              {initials}
            </AvatarFallback>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-slate-950" />
          </Avatar>

          {/* Name & Email */}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-white truncate leading-none mb-0.5">
              {displayName}
            </p>
            <p className="text-[10px] text-slate-500 truncate font-medium">
              {user?.email ?? "—"}
            </p>
          </div>

          <ChevronUp
            className={cn(
              "size-4 text-slate-600 group-hover:text-slate-400 transition-all duration-200",
              profileExpanded ? "rotate-180" : "rotate-0"
            )}
          />
        </button>

        {/* Expanded Logout Option */}
        {profileExpanded && (
          <div className="mt-1 px-1">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 disabled:opacity-50"
            >
              <LogOut className="size-4" />
              {isLoggingOut ? "Logging out…" : "Log out"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
