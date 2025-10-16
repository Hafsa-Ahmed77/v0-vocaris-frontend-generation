"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-white/20 dark:border-white/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-accent text-white font-bold text-sm"
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <span className="font-bold text-lg hidden sm:inline">Vocaris</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/auth">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-secondary to-accent text-white">
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
