"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { ContactUs } from "@/components/landing/contact-us"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LandingPage() {
  const router = useRouter()


  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        {/* <Features /> */}
        <ContactUs />
      </main>
      <SiteFooter />
    </div>
  )
}
