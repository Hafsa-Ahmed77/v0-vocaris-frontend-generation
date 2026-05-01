"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, LogOut, User as UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { logout } from "@/lib/api"
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
  const [scrolled, setScrolled] = useState(false)
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

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("scroll", handleScroll)
    }
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
    <header
      className={`fixed top-0 left-0 z-[100] w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="transition-all hover:scale-105 active:scale-95 group shrink-0">
          <Logo className="scale-[0.85] lg:scale-100 origin-left" />
        </Link>

        {/* Navigation — Center (Hidden on Mobile) */}
        <nav className="hidden lg:flex items-center gap-2">
          {[
            { label: "How it Works", href: "/#how-it-works" },
            { label: "Features", href: "/#features" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-50 transition-all"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-4 shrink-0">
          {isLoggedIn ? (
            <div className="flex items-center" ref={dropdownRef}>
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <Avatar className="h-10 w-10 rounded-full overflow-hidden bg-slate-100">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] text-white text-xs font-black uppercase">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-[110]"
                    >
                      <div className="p-5 bg-slate-50 border-b border-slate-100 text-center">
                        <div className="mx-auto w-14 h-14 mb-3 relative">
                          {avatarUrl ? (
                            <Image
                              src={avatarUrl}
                              alt={displayName}
                              width={56}
                              height={56}
                              className="rounded-full object-cover ring-4 ring-white shadow-sm"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center text-white text-lg font-black ring-4 ring-white shadow-sm mx-auto">
                              {initials}
                            </div>
                          )}
                        </div>
                        <p className="text-base font-bold text-[#0A192F] truncate font-outfit">{displayName}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>

                      <div className="p-3 space-y-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 rounded-xl transition-all"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <UserIcon className="size-4.5" />
                          My Dashboard
                        </Link>

                        <div className="h-px bg-slate-100 mx-2 my-2" />

                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                        >
                          <LogOut className="size-4.5" />
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
              className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-bold rounded-full px-6 h-11 shadow-[0_4px_15px_rgba(30,58,138,0.2)] transition-all hover:shadow-[0_4px_20px_rgba(30,58,138,0.3)] hover:-translate-y-0.5"
            >
              <Link href="/auth">Sign in</Link>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full lg:hidden transition-colors"
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
            className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-2xl overflow-hidden shadow-lg"
          >
            <div className="p-6 space-y-6">
              <nav className="flex flex-col gap-2">
                {[
                  { label: "How it Works", href: "/#how-it-works" },
                  { label: "Features", href: "/#features" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold text-[#0A192F] hover:text-[#1E3A8A] hover:bg-slate-50 transition-colors py-3 px-4 rounded-xl"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              {!isLoggedIn && (
                <div className="pt-6 border-t border-slate-100">
                  <Button
                    asChild
                    className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-bold rounded-xl h-12"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/auth">Sign in with Google</Link>
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
