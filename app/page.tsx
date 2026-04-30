"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { ContactUs } from "@/components/landing/contact-us"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { motion } from "framer-motion"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-x-hidden">
      {/* Global 3D Rotating Grid Background */}
      <div className="fixed inset-0 z-0 flex items-center justify-center perspective-[2000px] opacity-40 dark:opacity-60 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ rotateX: [60, 60], rotateZ: [0, 360] }}
          transition={{ rotateZ: { duration: 150, repeat: Infinity, ease: "linear" } }}
          className="w-[300vw] h-[300vw] absolute border border-blue-500/20 dark:border-blue-500/40 bg-[linear-gradient(to_right,rgba(59,130,246,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.3)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(59,130,246,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.4)_1px,transparent_1px)] bg-[size:100px_100px]"
        />
      </div>

      <SiteHeader />
      <main className="relative z-10 flex-1">
        <Hero />
        <div className="relative">
          <HowItWorks />
          <ContactUs />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
