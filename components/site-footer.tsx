"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { motion } from "framer-motion"

export function SiteFooter() {
  return (
    <footer className="relative border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f172a] overflow-hidden transition-colors duration-500">
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="py-16 grid gap-12 md:grid-cols-3 items-center">
          {/* Brand & Description */}
          <div className="space-y-6">
            <Link href="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
              <Logo />
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
              Your intelligent meeting partner for seamless conversation and smart collaboration across your workflow.
            </p>
          </div>

          {/* Navigation Links (Maintain original links only) */}
          <nav className="flex justify-center md:justify-center gap-10">
            <div className="flex flex-col gap-3">
              <Link href="/about" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest text-[10px]">
                About
              </Link>
              <Link href="/contact" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest text-[10px]">
                Contact
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/privacy" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest text-[10px]">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest text-[10px]">
                Terms
              </Link>
            </div>
          </nav>

          {/* Copyright Section */}
          <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] md:text-right">
            <p>© {new Date().getFullYear()} Vocaris Inc.</p>
            <p className="mt-1 opacity-60">All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
