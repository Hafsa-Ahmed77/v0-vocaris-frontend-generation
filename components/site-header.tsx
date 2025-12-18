"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-white/10 bg-gradient-to-r from-[#0A0F1C]/90 via-[#111827]/80 to-[#1E293B]/90 backdrop-blur-xl shadow-[0_0_25px_rgba(59,130,246,0.15)]">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
  whileHover={{ scale: 1.1, rotate: 6 }}
  className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-transform"
>
  <span className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.4)_0%,transparent_70%)] blur-lg"></span>
  <Sparkles className="w-5 h-5 relative z-10" />
</motion.div>
            <span className="font-bold text-lg hidden sm:inline">Vocaris</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/#how-it-works"
              className="text-sm font-bold text-white hover:text-foreground transition-colors"
            >
              How it works
            </Link>
           
            <Link
              href="/#contact"
              className="text-sm font-bold text-white hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
  asChild
  size="sm"
  className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all"
>

              <Link href="/auth">Sign in</Link>
            </Button>
            <Button
  asChild
  size="sm"
  className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all"
>

              <Link href="/onboarding">Get started</Link>
            </Button>
          </div>
        </div>
      </div>

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
