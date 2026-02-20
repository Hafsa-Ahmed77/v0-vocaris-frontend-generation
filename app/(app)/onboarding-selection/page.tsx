"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    AudioLines,
    FileText,
    ArrowRight,
    Moon,
    Home,
    Video,
    Zap,
    User,
    Sparkles
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export default function OnboardingSelectionPage() {
    const router = useRouter()
    const [selected, setSelected] = useState<"voice" | "form" | null>(null)

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
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter">Vocaris</span>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
                    <Moon className="w-5 h-5 text-slate-400" />
                </Button>
            </header>

            <main className="flex-1 w-full max-w-lg mx-auto px-6 py-10 flex flex-col relative z-10">
                {/* Progress Tracker */}
                <div className="space-y-6 mb-12">
                    <div className="flex gap-2 h-1.5">
                        <div className="flex-1 bg-blue-600 rounded-full" />
                        <div className="flex-1 bg-white/10 rounded-full" />
                        <div className="flex-1 bg-white/10 rounded-full" />
                    </div>
                </div>

                {/* Hero Section */}
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Choose your <br />
                        <span className="text-blue-500">onboarding</span>
                    </h1>
                    <p className="text-slate-400 font-medium leading-relaxed">
                        How would you like to introduce yourself to your new AI meeting partner?
                    </p>
                </div>

                {/* Choice Cards */}
                <div className="space-y-4">
                    {/* Voice Briefing Card */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push("/onboarding-conversation")}
                        className="w-full text-left p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl hover:bg-white/[0.06] hover:border-blue-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-start justify-between relative z-10">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
                                <AudioLines className="w-8 h-8 text-indigo-400" />
                            </div>
                            <ArrowRight className="w-6 h-6 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>

                        <div className="space-y-3 relative z-10">
                            <h3 className="text-xl font-bold">1-Minute Voice Briefing</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Just talk! Our AI will extract your preferences and goals from a short recording.
                            </p>

                            <div className="flex gap-2 pt-2">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Recommended
                                </span>
                                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                                    Fastest
                                </span>
                            </div>
                        </div>
                    </motion.button>

                    {/* Form Card */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push("/onboarding-form")}
                        className="w-full text-left p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl hover:bg-white/[0.06] transition-all group relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between">
                            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                                <FileText className="w-8 h-8 text-blue-400" />
                            </div>
                            <ArrowRight className="w-6 h-6 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xl font-bold">Quick Form Setup</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Answer a few structured questions to configure your dashboard manually.
                            </p>
                        </div>
                    </motion.button>
                </div>

                <div className="mt-12 text-center space-y-6">
                    <p className="text-xs text-slate-500">
                        You can always change these settings later in your profile.
                    </p>
                    <Button
                        variant="link"
                        onClick={() => router.push("/dashboard")}
                        className="text-slate-400 hover:text-white font-bold"
                    >
                        Skip for now
                    </Button>
                </div>
            </main>

            {/* Bottom Navigation */}
            <footer className="relative z-50 bg-[#020617]/80 backdrop-blur-2xl border-t border-white/5 px-6 py-4 flex items-center justify-between lg:hidden">
                <NavButton icon={<Home className="w-5 h-5" />} label="Home" active />
                <NavButton icon={<Video className="w-5 h-5" />} label="Meetings" />
                <NavButton icon={<Zap className="w-5 h-5" />} label="Insights" />
                <NavButton icon={<User className="w-5 h-5" />} label="Profile" />
            </footer>
        </div>
    )
}

function NavButton({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <button className={`flex flex-col items-center gap-1.5 transition-colors ${active ? 'text-blue-500' : 'text-slate-600 hover:text-slate-400'}`}>
            {icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </button>
    )
}
