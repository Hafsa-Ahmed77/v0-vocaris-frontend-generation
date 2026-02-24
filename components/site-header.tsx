"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Menu, X } from "lucide-react"

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
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
                <div className="hidden sm:block">
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="text-white hover:text-blue-400 hover:bg-white/5 font-bold transition-all"
                  >
                    <Link href="/auth">Sign in</Link>
                  </Button>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md hover:shadow-lg transition-all font-bold rounded-xl"
                >
                  <Link href="/auth">Get started</Link>
                </Button>
              </>
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
