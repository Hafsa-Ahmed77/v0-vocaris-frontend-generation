"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Menu, X, LogOut, User as UserIcon, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { logout } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"

interface UserProfile {
  first_name?: string
  last_name?: string
  email?: string
  profile_picture_url?: string
  name?: string
  picture?: string
}

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse user from local storage", e)
      }
    }

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      router.replace("/auth")
      router.refresh()
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
    <header className="fixed top-0 left-0 z-[100] w-full transition-all duration-500">
      <div className="mx-auto flex h-16 lg:h-20 max-w-full items-center justify-between px-3 lg:px-6 relative">
        {/* Logo - Far Left */}
        <Link href="/" className="transition-all hover:scale-105 active:scale-95 group shrink-0">
          <Logo className="scale-[0.7] lg:scale-100 origin-left drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
        </Link>

        {/* Navigation - Absolute Center (Hidden on Mobile) */}
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-4">
          {[
            { label: "How it works", href: "/#how-it-works" },
            { label: "Contact", href: "/#contact" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-6 py-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white/80 hover:text-blue-600 dark:hover:text-cyan-400 hover:border-blue-500/50 dark:hover:border-cyan-400/50 transition-all shadow-lg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Controls - Far Right */}
        <div className="flex items-center gap-1.5 lg:gap-4 lg:pl-4 lg:border-l border-slate-200/50 dark:border-white/10 shrink-0">
          <div className="scale-75 lg:scale-100">
            <ThemeToggle />
          </div>

            {isLoggedIn ? (
              <div className="flex items-center" ref={dropdownRef}>
                {/* User Profile Trigger */}
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <Avatar className="h-9 w-9 rounded-lg ring-1 ring-white/10 overflow-hidden bg-slate-800">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </motion.button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl bg-[#0F172A] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110]"
                      >
                        {/* Header Info */}
                        <div className="p-4 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5 text-center">
                          <div className="mx-auto w-12 h-12 mb-3 relative">
                            {avatarUrl ? (
                              <Image
                                src={avatarUrl}
                                alt={displayName}
                                width={48}
                                height={48}
                                className="rounded-2xl object-cover ring-2 ring-blue-500/20"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-base font-black">
                                {initials}
                              </div>
                            )}
                          </div>
                          <p className="text-sm font-bold text-white truncate px-2">{displayName}</p>
                          <p className="text-[11px] text-slate-500 truncate px-2">{user?.email}</p>
                        </div>

                        {/* Actions */}
                        <div className="p-2 space-y-1">
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <UserIcon className="size-4" />
                            My Dashboard
                          </Link>

                          <div className="h-px bg-white/5 mx-2 my-1" />

                          <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-400/10 rounded-xl transition-all disabled:opacity-50"
                          >
                            <LogOut className="size-4" />
                            {isLoggingOut ? "Logging out..." : "Log out"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-blue-500/20 transition-all font-bold rounded-xl px-8 h-11"
              >
                <Link href="/auth">Sign in</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-indigo-950 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg lg:hidden transition-colors"
              aria-label="Toggle menu"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </button>
          </div>
        </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0A0F1C]/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/#how-it-works"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-indigo-950 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-2"
                >
                  How it works
                </Link>
                <Link
                  href="/#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-indigo-950 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-2"
                >
                  Contact
                </Link>
              </nav>
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Theme</span>
                <ThemeToggle />
              </div>
              {!isLoggedIn && (
                <div className="pt-2">
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full text-indigo-950 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/5 font-bold justify-start px-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/auth">Sign in</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
