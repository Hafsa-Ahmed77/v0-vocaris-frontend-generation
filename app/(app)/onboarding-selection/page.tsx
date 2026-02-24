"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
    AudioLines,
    FileText,
    ArrowRight,
    Moon,
    Sun,
    Sparkles,
    Cpu,
    Network
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function OnboardingSelectionPage() {
    const router = useRouter()
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [selectedMode, setSelectedMode] = useState<string | null>(null)

    return (
        <div className={cn(
            "h-screen transition-colors duration-700 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col relative",
            isDarkMode ? "bg-[#161e2e] text-white" : "bg-slate-50 text-slate-900"
        )}>
            {/* Neural Matrix Background - Unique constallation engine */}
            <NeuralMatrixBackground active={isDarkMode} />

            {/* Premium Header - Re-positioned for balance and visibility */}
            <header className="relative z-50 h-28 flex items-center justify-between px-6 md:px-12 border-b border-transparent pt-4">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push("/dashboard")}>
                    <motion.div
                        whileHover={{ rotate: 180, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40"
                    >
                        <Sparkles className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-tighter uppercase leading-none">Vocaris</span>
                        <span className="text-[9px] font-black tracking-[0.5em] text-blue-500 mt-1 opacity-90">INTELLIGENCE</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Premium Theme Switcher */}
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={cn(
                            "relative w-14 h-7 rounded-full p-1 transition-all duration-500 border overflow-hidden",
                            isDarkMode ? "bg-slate-800 border-white/10" : "bg-white border-slate-200 shadow-inner"
                        )}
                    >
                        <motion.div
                            animate={{ x: isDarkMode ? 28 : 0 }}
                            className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center shadow-sm relative z-10",
                                isDarkMode ? "bg-blue-600 text-white" : "bg-orange-500 text-white"
                            )}
                        >
                            {isDarkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                        </motion.div>
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full max-w-4xl mx-auto px-6 flex flex-col justify-center relative z-10 -mt-8">
                {/* Hero HUD */}
                <div className="flex flex-col items-center text-center space-y-4 mb-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-4 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-md"
                    >
                        <span className="text-[9px] font-black tracking-[0.3em] text-blue-500 uppercase">Getting Started</span>
                    </motion.div>

                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]">
                            Setup your <br />
                            <span className="text-blue-600 dark:text-blue-400">assistant</span>
                        </h1>
                        <p className={cn(
                            "text-xs md:text-sm font-bold uppercase tracking-widest max-w-lg mx-auto",
                            isDarkMode ? "text-slate-300" : "text-slate-600"
                        )}>
                            Pick how you want to introduce yourself to your AI partner.
                        </p>
                    </div>
                </div>

                {/* Grid - No Scrollbars */}
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    <SelectionCard
                        title="Quick Voice Intro"
                        desc="Just talk for 1 minute! Our AI will learn about your goals and style automatically."
                        icon={<AudioLines className="w-8 h-8" />}
                        tags={["Fastest", "Recommended"]}
                        isSelected={selectedMode === 'voice'}
                        onClick={() => {
                            setSelectedMode('voice')
                            localStorage.setItem("vocaris_theme", "purple")
                            setTimeout(() => router.push("/onboarding-conversation?theme=purple"), 600)
                        }}
                        isDark={isDarkMode}
                        type="voice"
                    />

                    <SelectionCard
                        title="Simple Setup Form"
                        desc="Prefer typing? Fill out a quick form to set your preferences manually."
                        icon={<FileText className="w-8 h-8" />}
                        tags={["Manual", "Easy"]}
                        isSelected={selectedMode === 'form'}
                        onClick={() => {
                            setSelectedMode('form')
                            localStorage.setItem("vocaris_theme", "blue")
                            setTimeout(() => router.push("/onboarding-form?theme=blue"), 600)
                        }}
                        isDark={isDarkMode}
                        type="form"
                    />
                </div>

                <div className="mt-10 text-center">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className={cn(
                            "text-[10px] font-black uppercase tracking-[0.4em] hover:text-blue-500 transition-all group flex items-center justify-center mx-auto",
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                        )}
                    >
                        Skip for now <ArrowRight className="w-3 h-3 ml-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </main>

            <footer className="relative z-50 p-6 flex justify-between items-center opacity-30 select-none">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="text-[8px] font-black uppercase tracking-widest">System_Active</span>
                </div>
                <div className="text-[8px] font-black uppercase tracking-widest">
                    V-INTEL_v2.5.9
                </div>
            </footer>
        </div>
    )
}

function SelectionCard({ title, desc, icon, tags, onClick, isDark, type, isSelected }: any) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    // Magnetic Pull Logic
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const iconX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 15 })
    const iconY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 15 })

    // Perspective Tilt
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { stiffness: 100, damping: 20 })
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { stiffness: 100, damping: 20 })

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
    }

    const isVoice = type === 'voice'
    const accentColor = isVoice ? "purple" : "blue"

    // Glow calculation
    const glowClass = isSelected
        ? (isVoice ? "shadow-[0_0_50px_rgba(168,85,247,0.3)] border-purple-500/60" : "shadow-[0_0_50px_rgba(59,130,246,0.3)] border-blue-500/60")
        : (isHovered
            ? (isVoice ? "shadow-[0_0_40px_rgba(168,85,247,0.2)] border-purple-500/40" : "shadow-[0_0_40px_rgba(59,130,246,0.2)] border-blue-500/40")
            : (isVoice ? "border-purple-500/15 shadow-[0_0_20px_rgba(168,85,247,0.08)]" : "border-blue-500/15 shadow-[0_0_20px_rgba(59,130,246,0.08)]"))

    return (
        <motion.div
            ref={cardRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { setIsHovered(false); mouseX.set(0); mouseY.set(0) }}
            // Touch support: ensures hover-like state on touch
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            style={{ rotateX, rotateY, perspective: 1000 }}
            onClick={onClick}
            className="group cursor-pointer relative touch-manipulation"
        >
            {/* Background Glow Layer */}
            <div className={cn(
                "absolute inset-0 rounded-[2.5rem] transition-all duration-500 blur-2xl opacity-[0.03] group-hover:opacity-100",
                isVoice ? "bg-purple-500" : "bg-blue-500"
            )} />

            <div className={cn(
                "relative h-full p-6 md:p-8 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden z-10",
                // Blur fix: Reduced backdrop-blur on selection to keep content sharp
                isSelected
                    ? (isDark ? "bg-slate-800/90 backdrop-blur-none" : "bg-white backdrop-blur-none")
                    : (isDark
                        ? "bg-slate-900/60 backdrop-blur-3xl"
                        : "bg-white/80 backdrop-blur-3xl shadow-xl shadow-slate-200/50"),
                glowClass
            )}>

                <div className="relative z-10 space-y-6 md:space-y-8">
                    <div className="flex items-center justify-between">
                        <motion.div
                            style={{ x: iconX, y: iconY }}
                            className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl border",
                                isDark
                                    ? (isVoice ? "bg-purple-500/10 border-purple-500/20 text-purple-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400")
                                    : (isVoice ? "bg-purple-50 border-purple-200 text-purple-600" : "bg-blue-50 border-blue-200 text-blue-600")
                            )}
                        >
                            {icon}
                        </motion.div>

                        {/* Animated Visualizers */}
                        <div className="flex-1 flex justify-end pr-4">
                            {isVoice ? (
                                <VoiceWave active={isHovered || isSelected} color={isDark ? "#a855f7" : "#9333ea"} />
                            ) : (
                                <FormPulse active={isHovered || isSelected} color={isDark ? "#3b82f6" : "#2563eb"} />
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className={cn(
                            "text-2xl md:text-3xl font-black tracking-tight uppercase",
                            isDark ? "text-white" : "text-slate-900"
                        )}>{title}</h3>
                        <p className={cn(
                            "text-sm md:text-base font-bold leading-relaxed",
                            isDark ? "text-slate-200" : "text-slate-700"
                        )}>
                            {desc}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 md:pt-4">
                        <div className="flex gap-2">
                            {tags.map((tag: string) => (
                                <span key={tag} className={cn(
                                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                    isDark ? "bg-white/10 border-white/10 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"
                                )}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <motion.div
                            animate={(isHovered || isSelected) ? { x: 5, scale: 1.1 } : { x: 0, scale: 1 }}
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 shadow-lg",
                                isVoice
                                    ? (isDark ? "bg-purple-600 text-white" : "bg-purple-600 text-white")
                                    : (isDark ? "bg-blue-600 text-white" : "bg-blue-600 text-white")
                            )}
                        >
                            <ArrowRight className="w-5 h-5" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function VoiceWave({ active, color }: { active: boolean; color: string }) {
    return (
        <div className="flex items-center gap-1 h-8">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={active ? {
                        height: [8, 24, 12, 28, 8],
                    } : { height: 6 }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                    }}
                    className="w-1 rounded-full"
                    style={{ backgroundColor: color }}
                />
            ))}
        </div>
    )
}

function FormPulse({ active, color }: { active: boolean; color: string }) {
    return (
        <div className="relative w-8 h-8 flex items-center justify-center">
            <motion.div
                animate={active ? {
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0.2, 0.5]
                } : { scale: 1, opacity: 0.2 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-lg"
                style={{ backgroundColor: color }}
            />
            <motion.div
                animate={active ? {
                    scale: [1, 1.2, 1],
                } : { scale: 1 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-4 h-4 rounded-sm border-2"
                style={{ borderColor: color }}
            />
        </div>
    )
}

function NeuralMatrixBackground({ active }: { active: boolean }) {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {/* Grid Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.08]">
                <pattern id="matrix-p" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-blue-500" />
                    <line x1="2" y1="2" x2="80" y2="2" stroke="currentColor" strokeWidth="0.5" className="text-blue-500/20" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#matrix-p)" />
            </svg>

            {/* Subtle Aura Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none">
                <div className="absolute top-0 left-0 w-[60%] h-[60%] bg-blue-600/[0.03] rounded-full blur-[140px]" />
                <div className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-indigo-600/[0.03] rounded-full blur-[140px]" />
            </div>

            {/* Matrix Data Lines */}
            <div className="absolute inset-0 opacity-[0.02]">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
                        className="absolute w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent"
                        style={{ left: `${25 + i * 25}%` }}
                    />
                ))}
            </div>
        </div>
    )
}
