"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { motion } from "framer-motion"

export function SiteFooter() {
  return (
    <footer className="relative border-t border-slate-200 dark:border-white/5 bg-transparent overflow-hidden transition-colors duration-500">
      <div className="mx-auto max-w-full px-6 relative z-10">
        <div className="py-20 grid gap-16 md:grid-cols-3 items-center">
          {/* Brand & Description */}
          <div className="space-y-8 text-center md:text-left">
            <Link href="/" className="inline-block transition-all hover:scale-105 active:scale-95">
              <Logo className="drop-shadow-[0_0_10px_rgba(59,130,246,0.2)]" />
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed max-w-xs mx-auto md:mx-0">
              Your intelligent meeting partner for seamless conversation and smart collaboration across your workflow.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex justify-center gap-16">
            <div className="flex flex-col gap-4">
              <Link href="/about" className="text-[10px] font-black text-slate-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-all uppercase tracking-[0.3em] italic">
                About
              </Link>
              <Link href="/contact" className="text-[10px] font-black text-slate-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-all uppercase tracking-[0.3em] italic">
                Contact
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <Link href="/privacy" className="text-[10px] font-black text-slate-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-all uppercase tracking-[0.3em] italic">
                Privacy
              </Link>
              <Link href="/terms" className="text-[10px] font-black text-slate-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-all uppercase tracking-[0.3em] italic">
                Terms
              </Link>
            </div>
          </nav>

          {/* Copyright Section */}
          <div className="text-center md:text-right space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} Vocaris Inc.
            </p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400/60 dark:text-slate-500/40">
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
