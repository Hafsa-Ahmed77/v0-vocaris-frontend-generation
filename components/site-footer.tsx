"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"

export function SiteFooter() {
  return (
    <footer className="relative bg-[#0A192F] text-white overflow-hidden pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid gap-12 md:grid-cols-3 items-start mb-16">
          {/* Brand */}
          <div className="space-y-6 text-center md:text-left">
            <Link href="/" className="inline-block transition-all hover:scale-105 active:scale-95 bg-white/5 p-4 rounded-2xl">
              <Logo variant="white" />
            </Link>
            <p className="text-slate-400 text-[15px] font-medium leading-relaxed max-w-xs mx-auto md:mx-0">
              Your AI digital twin for meetings — learns how you speak, attends on your behalf, and gets smarter every session.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-center md:justify-end md:col-span-2 gap-16">
            <div className="space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Product</h4>
              <nav className="flex flex-col gap-4">
                {[
                  { label: "How it Works", href: "/#how-it-works" },
                  { label: "Features", href: "/#features" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-sm font-bold text-slate-300 hover:text-white hover:translate-x-1 transition-all"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Legal</h4>
              <nav className="flex flex-col gap-4">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-sm font-bold text-slate-300 hover:text-white hover:translate-x-1 transition-all"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-500">
            © {new Date().getFullYear()} Vocaris Inc. All rights reserved.
          </p>
          <p className="text-sm font-medium text-slate-500">
            Advancing human collaboration.
          </p>
        </div>
      </div>
    </footer>
  )
}
