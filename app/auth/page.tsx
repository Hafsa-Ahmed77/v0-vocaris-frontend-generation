"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { PremiumLoader } from "@/components/ui/premium-loader"
import { ShieldCheck, Zap, BarChart3, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { verifyToken } from "@/lib/api"
import { setAuthCookie } from "@/lib/auth-cookies"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"

export default function AuthPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    document.documentElement.classList.remove("dark")
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setMounted(true)
      setChecking(false)
      return
    }

    verifyToken().then((valid) => {
      if (valid) {
        setAuthCookie(token)
        router.replace("/dashboard")
      } else {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setMounted(true)
        setChecking(false)
      }
    })
  }, [router])

  if (checking || !mounted) {
    return <PremiumLoader message="Initializing Dashboard" subtext="Authenticating Workspace" />
  }

  return (
    <div className="min-h-screen lg:h-screen bg-[#f8faff] text-slate-900 overflow-x-hidden relative selection:bg-blue-500/30 font-sans flex flex-col items-center justify-center p-4 sm:p-6 lg:p-0">

      <main className="relative z-10 flex w-full h-full items-center justify-center max-w-[1400px]">
        
        {/* Decorative Background Element */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden sm:block">
          <div className="absolute top-1/4 -right-20 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-blue-100/40 rounded-full blur-[80px] sm:blur-[120px]" />
          <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-blue-50/40 rounded-full blur-[80px] sm:blur-[120px]" />
        </div>

        <div className="relative z-10 w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Section: Auth Interface */}
          <div className="flex flex-col items-center lg:items-start space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-slate-900 leading-[1.1]">
                The Core of <br />
                <span className="font-medium">Intelligence.</span>
              </h1>
              <p className="text-slate-400 font-medium text-base sm:text-lg max-w-[280px] sm:max-w-sm mx-auto lg:mx-0">
                Connect your account to the intelligent meeting architect and synchronize your workflows.
              </p>
            </div>

            <Card className="w-full max-w-[360px] sm:max-w-sm border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.5rem] bg-white p-6 sm:p-10">
              <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">Access Portal</h2>
                  <p className="text-slate-400 text-xs sm:text-sm">Synchronize with your workspace.</p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="w-full">
                    <GoogleSignInButton className="w-full h-16 sm:h-20 border border-slate-100 rounded-xl flex items-center justify-center gap-3 sm:gap-4 hover:bg-slate-50 transition-all group bg-white shadow-sm ring-1 ring-slate-100/50" />
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Enterprise Protocol Secure</span>
                  </div>
                </div>

                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-relaxed">
                  By connecting, you agree to our <a href="#" className="text-blue-600 font-bold hover:underline">Terms</a> and <a href="#" className="text-blue-600 font-bold hover:underline">Privacy Pact</a>.
                </p>
              </div>
            </Card>
          </div>

          {/* Right Section: Visual elements */}
          <div className="flex flex-col items-center justify-center relative scale-[0.7] sm:scale-[0.85] lg:scale-95 xxl:scale-100 order-1 lg:order-2 h-[350px] sm:h-[450px] lg:h-auto overflow-visible">
            
            {/* Protocol Architecture Mesh */}
            <div className="hidden lg:block absolute inset-0 border border-blue-50/50 rounded-[2rem] -top-12 -bottom-12 -left-8 -right-8 z-0 pointer-events-none" />
            
            <div className="relative z-10 w-full flex flex-col items-center gap-8 lg:gap-12">
              
              <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] w-full max-w-[500px]">
                {/* Real-Time Data Card */}
                <motion.div 
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -left-4 sm:top-0 sm:left-0 p-4 sm:p-6 bg-white border border-slate-100 rounded-[1.2rem] sm:rounded-[1.5rem] shadow-xl w-48 sm:w-60 space-y-3 sm:space-y-4 z-20"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="size-5 sm:size-6 bg-blue-50 flex items-center justify-center rounded">
                      <BarChart3 className="size-2.5 sm:size-3 text-blue-600" />
                    </div>
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-blue-600">Real-Time Data</span>
                  </div>
                  <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold leading-relaxed truncate-3-lines">Metrics extracted from meeting stream in 4.2ms.</p>
                </motion.div>

                {/* AI Synthesis Card */}
                <motion.div 
                   initial={{ opacity: 1, y: 0 }}
                   animate={{ y: [0, 15, 0] }}
                   transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-0 -right-4 sm:bottom-4 sm:right-0 p-4 sm:p-6 bg-white border border-slate-100 rounded-[1.2rem] sm:rounded-[1.5rem] shadow-xl w-48 sm:w-60 space-y-3 sm:space-y-4 z-20"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="size-5 sm:size-6 bg-blue-50 flex items-center justify-center rounded">
                      <Zap className="size-2.5 sm:size-3 text-blue-600" />
                    </div>
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-blue-600">AI Synthesis</span>
                  </div>
                  <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold leading-relaxed truncate-3-lines">Context, tone, and action items analyzed.</p>
                </motion.div>

                {/* Cognitive Sync Card */}
                <motion.div 
                   initial={{ opacity: 0.8 }}
                   animate={{ x: [0, 10, 0] }}
                   transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-2 -right-8 sm:top-4 sm:-right-12 p-4 sm:p-5 bg-white border border-slate-100 rounded-xl shadow-lg w-40 sm:w-52 space-y-2 sm:space-y-3 z-10"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                     <div className="size-1.5 sm:size-2 bg-indigo-500 rounded-full animate-pulse" />
                     <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400">Cognitive Sync</span>
                  </div>
                  <div className="flex gap-1">
                     {[1,2,3,4,5].map(i => <div key={i} className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-1/2" /></div>)}
                  </div>
                </motion.div>

                {/* Behavioral Mapping */}
                <motion.div 
                   initial={{ opacity: 0.8 }}
                   animate={{ y: [0, -8, 0], x: [0, -5, 0] }}
                   transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-8 -left-8 sm:-bottom-12 sm:-left-4 p-4 sm:p-5 bg-white border border-slate-100 rounded-xl shadow-lg w-40 sm:w-52 space-y-2 sm:space-y-3 z-10"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                     <div className="size-4 sm:size-5 bg-emerald-50 flex items-center justify-center rounded">
                        <ShieldCheck className="size-2 sm:size-2.5 text-emerald-600" />
                     </div>
                     <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400">Behavioral Map</span>
                  </div>
                  <div className="h-1 sm:h-1.5 w-full bg-emerald-50 rounded-full overflow-hidden">
                     <div className="h-full w-[85%] bg-emerald-500" />
                  </div>
                </motion.div>

                {/* Auto-Manifest Card */}
                <motion.div 
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ scale: [1, 1.01, 1], y: [0, -5, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 bg-[#1e293b] rounded-[1.2rem] sm:rounded-[1.5rem] p-6 sm:p-8 shadow-2xl z-30"
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Zap className="size-3 sm:size-4 text-blue-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Auto-Manifest</span>
                    </div>
                    <Badge className="bg-[#10b981]/10 text-[#10b981] border-none text-[8px] font-black px-2 py-0.5">ACTIVE</Badge>
                  </div>
                  
                  <div className="space-y-4 mb-4 sm:mb-8">
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-2">
                          <div className="size-4 border border-blue-500 rounded-full flex items-center justify-center">
                             <div className="size-1.5 bg-blue-500 rounded-full" />
                          </div>
                          <div className="h-3 w-3/4 bg-blue-500/10 rounded-full overflow-hidden">
                             <div className="h-full w-2/3 bg-blue-600 rounded-full" />
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="size-4 border border-slate-700 rounded-full" />
                          <div className="h-3 w-1/2 bg-slate-700/30 rounded-full overflow-hidden">
                             <div className="h-full w-1/4 bg-blue-500/20 rounded-full" />
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <ArrowRight className="size-4" />
                  </div>
                </motion.div>
              </div>

              <div className="text-center mt-8">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Protocol Architecture v4.2</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
