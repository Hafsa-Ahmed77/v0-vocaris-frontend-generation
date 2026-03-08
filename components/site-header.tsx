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
    <header className="sticky top-0 z-[100] w-full">
      <div className="glass border-b border-white/10 bg-gradient-to-r from-[#0A0F1C]/90 via-[#111827]/80 to-[#1E293B]/90 backdrop-blur-xl shadow-[0_0_25px_rgba(59,130,246,0.15)]">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/">
            <Logo />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            <Link
              href="/#how-it-works"
              className="text-base font-black text-white hover:text-cyan-400 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/#contact"
              className="text-base font-black text-white hover:text-cyan-400 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block mr-1">
              <ThemeToggle />
            </div>

            {isLoggedIn ? (
              <div className="flex items-center" ref={dropdownRef}>
                {/* User Profile Trigger */}
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <Avatar className="h-8 w-8 rounded-lg ring-1 ring-white/10 overflow-hidden bg-slate-800">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className={cn("size-3.5 text-slate-400 transition-transform hidden sm:block", isProfileOpen && "rotate-180")} />
                  </motion.button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl bg-[#0F172A] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110]"
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
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md hover:shadow-lg transition-all font-bold rounded-xl px-6"
              >
                <Link href="/auth">Sign in</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-lg md:hidden transition-colors"
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
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden glass border-b border-white/10 bg-[#0A0F1C]/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/#how-it-works"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-white hover:text-cyan-400 transition-colors py-2"
                >
                  How it works
                </Link>
                <Link
                  href="/#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-white hover:text-cyan-400 transition-colors py-2"
                >
                  Contact
                </Link>
              </nav>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Theme</span>
                <ThemeToggle />
              </div>
              {!isLoggedIn && (
                <div className="pt-2">
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full text-white hover:text-blue-400 hover:bg-white/5 font-bold justify-start px-0"
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

      {/* Gradient underline animation */}
      <motion.div
        className="h-0.5 w-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          transformOrigin: "0% 50%",
          background: "linear-gradient(90deg, rgb(99, 102, 241), rgb(56, 189, 248), transparent)",
        }}
      />
    </header>
  )
}
