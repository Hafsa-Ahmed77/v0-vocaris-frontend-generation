"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-white/10 bg-gradient-to-r from-[#0A0F1C]/90 via-[#111827]/80 to-[#1E293B]/90 backdrop-blur-xl shadow-[0_0_25px_rgba(59,130,246,0.15)]">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 6 }}
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-transform"
            >
              <span className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.4)_0%,transparent_70%)] blur-lg"></span>
              <Sparkles className="w-5 h-5 relative z-10" />
            </motion.div>
            <span className="font-bold text-lg text-white">Vocaris</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-16">
            <Link
              href="/#how-it-works"
              className="text-m font-bold text-white hover:text-cyan-400 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/#contact"
              className="text-m font-bold text-white hover:text-cyan-400 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-indigo-500/20 transition-all font-bold px-6 rounded-xl"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-blue-400 hover:bg-white/5 font-bold transition-all"
                >
                  <Link href="/auth">Sign in</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md hover:shadow-lg transition-all font-bold rounded-xl"
                >
                  <Link href="/auth">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Gradient underline animation */}
      <motion.div
        className="h-1 w-full"
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
