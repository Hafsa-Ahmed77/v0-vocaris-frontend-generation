"use client"

import { motion } from "framer-motion"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface PremiumLoaderProps {
  message?: string
  subtext?: string
  className?: string
}

export function PremiumLoader({ 
  message = "Initializing Dashboard", 
  subtext = "Syncing meeting intelligence and stats",
  className 
}: PremiumLoaderProps) {
  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 font-sans overflow-hidden",
      className
    )}>
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] mix-blend-screen" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex items-center justify-center mb-12">
          {/* Animated Background Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute w-32 h-32 border-t-2 border-r-2 border-blue-500/20 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute w-28 h-28 border-b-2 border-l-2 border-cyan-400/30 rounded-full"
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-24 h-24 bg-blue-500/5 rounded-full blur-xl"
          />
          
          {/* Core Icon Container */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
          >
            <Zap className="w-8 h-8 text-cyan-400 fill-cyan-400/20 animate-pulse" />
            
            {/* Corner Accents */}
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400 rounded-br-sm" />
          </motion.div>
        </div>
        
        {/* Loading Text */}
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-black text-white tracking-[0.3em] uppercase"
          >
            {message}
          </motion.h2>
          
          {/* Progress bar simulation */}
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            />
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
            className="text-[10px] font-bold text-slate-400 tracking-widest uppercase"
          >
            {subtext}
          </motion.p>
        </div>
      </div>
      
      {/* Decorative lines */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
    </div>
  )
}
