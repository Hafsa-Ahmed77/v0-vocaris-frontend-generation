"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowLeft,
    ArrowRight,
    Sparkles,
    Loader2,
    CheckCircle2,
    FileText,
    Zap,
    Layout,
    ShieldCheck,
    Cpu,
    Network,
    Terminal,
    Dna,
    Moon,
    Sun
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type FormState = {
    status: string
    question_id?: number | null
    question?: string
    message?: string
    total_answers: number
    all_answers?: Record<string, string>
}

export default function OnboardingFormPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [userName, setUserName] = useState("")
    const [currentAnswer, setCurrentAnswer] = useState("")
    const [loading, setLoading] = useState(false)
    const [formState, setFormState] = useState<FormState | null>(null)
    const [step, setStep] = useState(0) // 0: Start, 1: Questions, 2: Completed
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [theme, setTheme] = useState<"purple" | "blue">("blue")

    // Load username and theme from local storage or URL
    useEffect(() => {
        const userStr = localStorage.getItem("user")
        if (userStr) {
            try {
                const user = JSON.parse(userStr)
                setUserName(user.full_name || user.name || "")
            } catch (e) {
                console.error("Failed to parse user from local storage", e)
            }
        }

        const themeParam = searchParams.get("theme") as "purple" | "blue"
        const savedTheme = localStorage.getItem("vocaris_theme") as "purple" | "blue"
        if (themeParam && (themeParam === "purple" || themeParam === "blue")) {
            setTheme(themeParam)
        } else if (savedTheme && (savedTheme === "purple" || savedTheme === "blue")) {
            setTheme(savedTheme)
        }
    }, [searchParams])

    // Theme dynamic classes helper
    const themeClasses = {
        text: theme === "purple" ? "text-purple-500" : "text-blue-500",
        textLight: theme === "purple" ? "text-purple-400" : "text-blue-400",
        bg: theme === "purple" ? "bg-purple-600" : "bg-blue-600",
        bgHover: theme === "purple" ? "bg-purple-500" : "bg-blue-500",
        bgAlpha: theme === "purple" ? "bg-purple-500/5" : "bg-blue-500/5",
        bgAlphaStrong: theme === "purple" ? "bg-purple-500/10" : "bg-blue-500/10",
        border: theme === "purple" ? "border-purple-500/10" : "border-blue-500/10",
        borderAlpha: theme === "purple" ? "border-purple-500/20" : "border-blue-500/20",
        ring: theme === "purple" ? "focus:ring-purple-500/40" : "focus:ring-blue-500/40",
        gradient: theme === "purple" ? "from-purple-600 to-indigo-600" : "from-blue-600 to-indigo-600",
        selection: theme === "purple" ? "selection:bg-purple-500/30" : "selection:bg-blue-500/30",
        atmosGlow: theme === "purple" ? (isDarkMode ? "bg-purple-600/[0.05]" : "bg-purple-400/[0.1]") : (isDarkMode ? "bg-blue-600/[0.05]" : "bg-blue-400/[0.1]"),
        shadow: theme === "purple" ? "shadow-purple-500/20" : "shadow-blue-500/20",
        visualizerBorder: theme === "purple" ? "border-purple-500/20" : "border-blue-500/20"
    }

    const handleStart = async () => {
        if (!userName.trim()) return
        setLoading(true)
        try {
            const res = await fetch("/api/form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_name: userName }),
            })
            const data = await res.json()
            setFormState(data)
            setStep(1)
        } catch (error) {
            console.error("Failed to start form", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAnswer = async () => {
        if (!currentAnswer.trim() || !formState) return
        setLoading(true)
        try {
            const res = await fetch("/api/form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_name: userName,
                    question_id: formState.question_id,
                    answer: currentAnswer
                }),
            })
            const data = await res.json()
            setFormState(data)
            setCurrentAnswer("")

            if (data.status === "completed") {
                setStep(2)
            }
        } catch (error) {
            console.error("Failed to submit answer", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={cn(
            "min-h-dvh max-w-[100vw] overflow-hidden transition-colors duration-700 flex flex-col relative font-sans",
            themeClasses.selection,
            isDarkMode ? "bg-[#161e2e] text-white" : "bg-slate-50 text-slate-900"
        )}>
            {/* Neural Matrix Background Engine */}
            <NeuralMatrixBackground active={isDarkMode} themeColor={theme === 'purple' ? 'text-purple-500' : 'text-blue-500'} />

            {/* Atmos Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[120px]",
                    themeClasses.atmosGlow
                )} />
                <div className={cn(
                    "absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[120px]",
                    isDarkMode ? "bg-indigo-600/[0.05]" : "bg-indigo-400/[0.1]"
                )} />
            </div>

            <header className={cn(
                "relative z-50 h-20 md:h-24 border-b flex items-center justify-between px-6 md:px-8 backdrop-blur-3xl",
                isDarkMode ? "border-white/5 bg-slate-900/40" : "border-slate-200 bg-white/40"
            )}>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className={cn(
                            "p-2.5 rounded-xl border transition-all active:scale-90",
                            isDarkMode ? "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20" : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                        )}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="hidden md:flex flex-col">
                        <div className="flex items-center gap-2">
                            <Zap className={cn("w-3.5 h-3.5 fill-current", themeClasses.text)} />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Profile Setup</span>
                        </div>
                        <span className={cn(
                            "text-[10px] uppercase font-bold tracking-widest mt-0.5",
                            isDarkMode ? "text-slate-500" : "text-slate-400"
                        )}>Setup.Active_v2</span>
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
                                isDarkMode ? (theme === 'purple' ? "bg-purple-600" : "bg-blue-600") + " text-white" : "bg-orange-500 text-white"
                            )}
                        >
                            {isDarkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                        </motion.div>
                    </button>

                    <div className={cn(
                        "hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-full border shadow-lg",
                        theme === 'purple'
                            ? (isDarkMode ? "bg-purple-500/5 border-purple-500/20 shadow-purple-500/10" : "bg-purple-50 border-purple-100 shadow-purple-500/5")
                            : (isDarkMode ? "bg-blue-500/5 border-blue-500/20 shadow-blue-500/10" : "bg-blue-50 border-blue-100 shadow-blue-500/5")
                    )}>
                        <div className={cn(
                            "w-2 h-2 rounded-full",
                            step === 1 ? (theme === 'purple' ? "bg-purple-500" : "bg-blue-500") + " animate-pulse" :
                                step === 2 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-slate-600"
                        )} />
                        <span className={cn("text-[10px] uppercase font-black tracking-[0.2em]", themeClasses.textLight)}>
                            {step === 0 ? "Initialization" : step === 1 ? "Syncing" : "Complete"}
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-4xl mx-auto px-6 flex flex-col relative z-10">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                        >
                            <div className="relative mb-8">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                    className={cn("absolute inset-[-20px] border border-dashed rounded-full", themeClasses.visualizerBorder)}
                                />
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={cn("w-32 h-32 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-2xl", themeClasses.gradient, themeClasses.shadow)}
                                >
                                    <FileText className="w-12 h-12 text-white" />
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-4 max-w-xl"
                            >
                                <div className={cn("flex items-center justify-center gap-3 mb-2", themeClasses.text)}>
                                    <Network className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Information Gathering</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase">
                                    Profile <br /> Configuration
                                </h1>
                                <p className={cn(
                                    "font-bold uppercase tracking-widest text-[10px] opacity-60",
                                    isDarkMode ? "text-slate-400" : "text-slate-600"
                                )}>
                                    Tell us a bit about yourself to customize your experience.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-8 w-full max-w-sm space-y-4"
                            >
                                <div className="relative group">
                                    <Terminal className={cn("absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 group-focus-within:opacity-100 transition-opacity", themeClasses.text)} />
                                    <Input
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="TYPE YOUR NAME..."
                                        className={cn(
                                            "h-14 border text-lg font-black rounded-xl pl-14 pr-6 transition-all tracking-widest uppercase placeholder:opacity-20",
                                            themeClasses.ring,
                                            isDarkMode ? "bg-white/[0.03] border-white/10" : "bg-slate-100 border-slate-200"
                                        )}
                                    />
                                </div>
                                <Button
                                    onClick={handleStart}
                                    disabled={!userName.trim() || loading}
                                    className={cn(
                                        "w-full h-14 text-white font-black text-md rounded-xl shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group",
                                        themeClasses.bg, themeClasses.bgHover, themeClasses.shadow
                                    )}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            START SETUP
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}

                    {step === 1 && formState && (
                        <motion.div
                            key="questions"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="flex-1 flex flex-col py-8 space-y-8"
                        >
                            <div className="flex-1 flex flex-col justify-center space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 shadow-lg", themeClasses.bgAlpha, themeClasses.borderAlpha)}>
                                            <Sparkles className={cn("w-6 h-6", themeClasses.textLight)} />
                                        </div>
                                        <div className={cn("h-px flex-1 bg-gradient-to-r to-transparent", theme === 'purple' ? "from-purple-500/20" : "from-blue-500/20")} />
                                    </div>

                                    <div className="space-y-2">
                                        <h2 className="text-xl md:text-2xl font-black leading-tight tracking-tight uppercase">
                                            {formState.question}
                                        </h2>
                                        {formState.message && (
                                            <p className={cn(
                                                "font-bold uppercase tracking-widest opacity-50 leading-relaxed max-w-xl",
                                                isDarkMode ? "text-slate-400 text-sm md:text-base" : "text-slate-600 text-[10px] md:text-xs"
                                            )}>
                                                {formState.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="relative group space-y-4">
                                    <div className={cn(
                                        "relative p-[1px] rounded-2xl transition-all duration-500 shadow-xl overflow-hidden backdrop-blur-3xl border",
                                        isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200",
                                        theme === 'purple' ? "focus-within:border-purple-500/50" : "focus-within:border-blue-500/50"
                                    )}>
                                        <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none", theme === 'purple' ? "from-purple-500/5" : "from-blue-500/5")} />
                                        <textarea
                                            autoFocus
                                            value={currentAnswer}
                                            onChange={(e) => setCurrentAnswer(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault()
                                                    handleAnswer()
                                                }
                                            }}
                                            placeholder="TYPE YOUR RESPONSE..."
                                            className={cn(
                                                "w-full min-h-[100px] md:min-h-[140px] bg-transparent border-none rounded-2xl p-6 text-lg md:text-xl font-bold placeholder:text-slate-700 outline-none resize-none tracking-wide",
                                                isDarkMode ? "text-white" : "text-slate-900"
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center gap-3 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                                            <Cpu className="w-3 h-3 animate-pulse" />
                                            <span>Analyzing Input Patterns</span>
                                        </div>

                                        <Button
                                            onClick={handleAnswer}
                                            disabled={!currentAnswer.trim() || loading}
                                            className={cn(
                                                "h-16 px-10 text-white font-black text-md rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 group min-w-[200px]",
                                                themeClasses.bg, themeClasses.bgHover, themeClasses.shadow
                                            )}
                                        >
                                            {loading ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <>
                                                    NEXT STEP
                                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="completed"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col items-center justify-center text-center space-y-10"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute inset-[-40px] bg-green-500/10 blur-[60px] rounded-full"
                                />
                                <div className="w-32 h-32 bg-green-500/10 border border-green-500/20 rounded-[3rem] flex items-center justify-center relative z-10 shadow-2xl shadow-green-500/10">
                                    <CheckCircle2 className="w-16 h-16 text-green-400" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-3 text-green-500 mb-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Information Verified</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase">
                                    Setup <br /> Complete
                                </h1>
                                <p className={cn(
                                    "font-bold uppercase tracking-widest text-[10px] opacity-60 max-w-xs mx-auto",
                                    isDarkMode ? "text-slate-400" : "text-slate-600"
                                )}>
                                    Your profile has been successfully updated and synced.
                                </p>
                            </div>

                            <div className="pt-8 w-full max-w-sm mx-auto">
                                <Button
                                    onClick={() => router.push("/dashboard")}
                                    className={cn(
                                        "w-full h-16 text-white font-black text-lg rounded-xl shadow-xl transition-all active:scale-95 group",
                                        themeClasses.bg, themeClasses.bgHover, themeClasses.shadow
                                    )}
                                >
                                    GO TO DASHBOARD
                                    <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <AnimatePresence>
                {step < 2 && (
                    <motion.footer
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                            "relative z-50 h-20 md:h-24 flex items-center justify-center border-t backdrop-blur-3xl",
                            isDarkMode ? "border-white/5 bg-slate-900/40" : "border-slate-200 bg-white/40"
                        )}
                    >
                        <div className={cn(
                            "flex items-center gap-4",
                            isDarkMode ? "text-slate-700" : "text-slate-300"
                        )}>
                            <div className={cn(
                                "w-1 h-1 rounded-full",
                                isDarkMode ? "bg-slate-800" : "bg-slate-200"
                            )} />
                            <p className="text-[10px] uppercase font-black tracking-[0.3em]">
                                Vocaris Core Intelligence v2.0
                            </p>
                            <div className={cn(
                                "w-1 h-1 rounded-full",
                                isDarkMode ? "bg-slate-800" : "bg-slate-200"
                            )} />
                        </div>
                    </motion.footer>
                )}
            </AnimatePresence>
        </div>
    )
}

function NeuralMatrixBackground({ active, themeColor }: { active: boolean; themeColor: string }) {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {/* Grid Pattern */}
            <svg className={cn(
                "absolute inset-0 w-full h-full",
                active ? "opacity-[0.08]" : "opacity-[0.03]"
            )}>
                <pattern id="matrix-form" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="currentColor" className={themeColor} />
                    <line x1="2" y1="2" x2="80" y2="2" stroke="currentColor" strokeWidth="0.5" className={themeColor + "/20"} />
                </pattern>
                <rect width="100%" height="100%" fill="url(#matrix-form)" />
            </svg>

            {/* Matrix Data Lines */}
            <div className="absolute inset-0 opacity-[0.04]">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ duration: 10 + i * 4, repeat: Infinity, ease: "linear" }}
                        className={cn("absolute w-px h-full bg-gradient-to-b from-transparent to-transparent", themeColor.includes('purple') ? "via-purple-500" : "via-blue-500")}
                        style={{ left: `${20 + i * 15}%` }}
                    />
                ))}
            </div>
        </div>
    )
}
