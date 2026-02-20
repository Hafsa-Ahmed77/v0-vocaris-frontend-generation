"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowLeft,
    ArrowRight,
    Sparkles,
    Loader2,
    CheckCircle2,
    FileText,
    Zap,
    Layout
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

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
    const [userName, setUserName] = useState("")
    const [currentAnswer, setCurrentAnswer] = useState("")
    const [loading, setLoading] = useState(false)
    const [formState, setFormState] = useState<FormState | null>(null)
    const [step, setStep] = useState(0) // 0: Start, 1: Questions, 2: Completed

    // Load username from local storage if available
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
    }, [])

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
        <div className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-hidden selection:bg-blue-500/30">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            {/* Header */}
            <header className="relative z-50 h-20 flex items-center justify-between px-6 bg-[#020617]/50 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-2">
                        <Layout className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-bold tracking-tight">Quick Setup</span>
                    </div>
                </div>

                {formState && (
                    <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                            Questions: {formState.total_answers}
                        </span>
                    </div>
                )}
            </header>

            <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-12 flex flex-col relative z-10">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex-1 flex flex-col items-center justify-center space-y-12"
                        >
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/10">
                                    <FileText className="w-10 h-10 text-blue-400" />
                                </div>
                                <h1 className="text-4xl font-black tracking-tight">
                                    Guided Configuration
                                </h1>
                                <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                                    Answer a few intelligence-driven questions to tailor Vocaris to your specific meeting style.
                                </p>
                            </div>

                            <div className="w-full max-w-sm space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                                        Your Name
                                    </label>
                                    <Input
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Enter name..."
                                        className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-xl focus:ring-2 focus:ring-blue-500/30 transition-all"
                                    />
                                </div>
                                <Button
                                    onClick={handleStart}
                                    disabled={!userName.trim() || loading}
                                    className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Start Setup"}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 1 && formState && (
                        <motion.div
                            key="questions"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="space-y-12">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                                        <span>Current Progress</span>
                                        <span>AI Analysis in process</span>
                                    </div>
                                    <Progress value={(formState.total_answers || 0) * 20} className="h-1.5 bg-white/5" />
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Sparkles className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div className="space-y-4">
                                            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                                                {formState.question}
                                            </h2>
                                            {formState.message && (
                                                <p className="text-slate-400 text-lg leading-relaxed">
                                                    {formState.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="relative group p-[2px] rounded-[2rem] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 focus-within:from-blue-500 focus-within:to-indigo-500 transition-all duration-500">
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
                                            placeholder="Type your response..."
                                            className="w-full min-h-[160px] bg-[#020617] border-none rounded-[1.95rem] p-8 text-xl text-white placeholder:text-slate-600 outline-none resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        size="lg"
                                        onClick={handleAnswer}
                                        disabled={!currentAnswer.trim() || loading}
                                        className="h-16 px-10 bg-white text-[#020617] hover:bg-slate-100 font-bold rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                Next Question
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="completed"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
                        >
                            <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-[2.5rem] flex items-center justify-center mb-4 relative">
                                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />
                                <CheckCircle2 className="w-12 h-12 text-green-400 relative z-10" />
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-4xl font-black tracking-tight">
                                    Neural Sync Complete
                                </h1>
                                <p className="text-slate-400 text-lg max-w-sm mx-auto">
                                    Your profile has been successfully manually configured. You're ready to start your first session.
                                </p>
                            </div>

                            <div className="pt-8 w-full max-w-xs mx-auto">
                                <Button
                                    onClick={() => router.push("/dashboard")}
                                    className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-blue-900/40 transition-all group"
                                >
                                    Enter Dashboard
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {step < 2 && (
                <footer className="relative z-50 p-6 text-center">
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-700">
                        Guided by Vocaris Intelligence
                    </p>
                </footer>
            )}
        </div>
    )
}
