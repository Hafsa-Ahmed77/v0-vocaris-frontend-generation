"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/landing/hero"
import { WhatIsVocaris } from "@/components/landing/what-is-vocaris"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { WhyVocaris } from "@/components/landing/why-vocaris"
import { TechStack } from "@/components/landing/tech-stack"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 overflow-x-hidden selection:bg-blue-900/20">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <WhatIsVocaris />
        <HowItWorks />
        <Features />
        <WhyVocaris />
        <TechStack />
      </main>
      <SiteFooter />
    </div>
  )
}
