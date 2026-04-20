"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Zap, Link as LinkIcon, Play, Briefcase, ChevronDown, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface QuickJoinProps {
    onStartAgent: (url: string, isScrum: boolean, jobId?: string) => Promise<void>
    isLoading?: boolean
    isJobsLoading?: boolean
    jobs?: any[]
}

export function QuickJoin({ onStartAgent, isLoading, isJobsLoading, jobs = [] }: QuickJoinProps) {
    const [url, setUrl] = useState("")
    const [localError, setLocalError] = useState("")
    const [shake, setShake] = useState(false)
    const [isScrum, setIsScrum] = useState(false)
    const [selectedJobId, setSelectedJobId] = useState<string>("")

    const onboardedJobs = jobs?.filter(job => job.last_session_id) || []
    const hasJobsTotal = jobs?.length > 0
    const hasOnboardedJobs = onboardedJobs.length > 0

    // Auto-select if jobs exist
    useEffect(() => {
        if (hasOnboardedJobs && !selectedJobId) {
            setSelectedJobId(onboardedJobs[0].job_id)
        }
    }, [onboardedJobs, selectedJobId, hasOnboardedJobs])

    const validateUrl = (testUrl: string) => {
        // Standard meet.google.com/xxx-xxxx-xxx or meet.google.com/xxxxxxxxx
        const meetRegex = /^https:\/\/meet\.google\.com\/[a-z0-9-]+$/i
        return meetRegex.test(testUrl.trim())
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalError("")
        
        const selectedHasOnboarding = onboardedJobs.some(j => j.job_id === selectedJobId)
        
        if (!url.trim()) {
            setLocalError("Please enter a meeting link.")
            triggerShake()
            return
        }

        if (!validateUrl(url)) {
            setLocalError("Invalid Format: Link must be a valid Google Meet URL.")
            triggerShake()
            return
        }

        if (!selectedHasOnboarding) {
            setLocalError("Please select a sync-ready Neural Profile.")
            triggerShake()
            return
        }

        try {
            await onStartAgent(url.trim(), isScrum, selectedJobId || onboardedJobs[0]?.job_id)
        } catch (err: any) {
            setLocalError(err.message || "Failed to start agent. Please try again.")
            triggerShake()
        }
    }

    const triggerShake = () => {
        setShake(true)
        setTimeout(() => setShake(false), 500)
    }


    return (
        <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-violet-500/20 rounded-[2.2rem] opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white dark:bg-gradient-to-br dark:from-[#161E31] dark:to-[#0A0F1E] rounded-[2rem] p-8 shadow-xl shadow-blue-500/5 dark:shadow-2xl border border-[#E0E7FF] dark:border-[#2D3A54] overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-cyan-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-colors duration-500 group-hover:bg-blue-500/10 dark:group-hover:bg-cyan-500/10" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-cyan-500 flex items-center justify-center text-white dark:text-[#0A0F1E] shadow-lg shadow-blue-500/20 dark:shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-4 ring-blue-500/10 dark:ring-cyan-500/10">
                            <Zap className="size-5 fill-current" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-[#1E293B] dark:text-white tracking-tight">Quick Join</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none mt-1">Deploy an intelligent agent to any meeting link</p>
                        </div>
                    </div>

                    <div
                        onClick={() => setIsScrum(!isScrum)}
                        className="flex items-center gap-2 cursor-pointer select-none group/toggle px-3 py-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 transition-colors backdrop-blur-md"
                    >
                        <div className={cn(
                            "w-8 h-4 rounded-full p-0.5 transition-all duration-300",
                            isScrum
                                ? "bg-blue-600 dark:bg-cyan-500"
                                : "bg-slate-300 dark:bg-slate-700"
                        )}>
                            <div className={cn(
                                "w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm",
                                isScrum ? "translate-x-4" : "translate-x-0"
                            )} />
                        </div>
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest transition-colors",
                            isScrum
                                ? "text-blue-600 dark:text-cyan-400"
                                : "text-slate-400 dark:text-slate-500"
                        )}>
                            Scrum Mode
                        </span>
                    </div>
                </div>

                {isJobsLoading ? (
                    <div className="mb-4 h-[76px] rounded-xl bg-slate-100/50 dark:bg-white/5 animate-pulse" />
                ) : hasJobsTotal ? (
                    <div className="mb-4 relative animate-in fade-in slide-in-from-top-2 duration-500">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block px-1">
                            Neural Context Required
                        </label>

                        <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                            <SelectTrigger className="w-full h-12 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-[#1E293B] dark:text-white px-11 relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-blue-500 dark:text-cyan-500 pointer-events-none" />
                                <SelectValue placeholder="Select an onboarded job" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-[#0A0F1E] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl">
                                {jobs.map((job) => (
                                    <SelectItem key={job.job_id} value={job.job_id} disabled={!job.last_session_id} className={cn(!job.last_session_id && "opacity-50 blur-[0.3px]")}>
                                        <div className="flex items-center gap-2">
                                            <span>{job.company_name} — {job.role}</span>
                                            {!job.last_session_id && <span className="text-[8px] uppercase font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-sm tracking-widest opacity-80">Pending Sync</span>}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ) : (
                    <div className="mb-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold">Action Restricted</span>
                            <span className="text-xs opacity-90 leading-relaxed">
                                You must create at least one Neural Sync session for a job before deploying an agent to real meetings.
                            </span>
                            <Link href="/onboarding-jobs" className="text-xs font-black uppercase tracking-widest mt-1 hover:underline">
                                Go to Job Manager &rarr;
                            </Link>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit} className={cn("flex flex-col sm:flex-row gap-3 relative transition-transform duration-300", shake && "animate-shake")}>
                    <div className="flex-1 relative">
                        <LinkIcon className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors",
                            localError ? "text-red-500" : "text-slate-400 dark:text-slate-500"
                        )} />
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value)
                                if (localError) setLocalError("")
                            }}
                            placeholder="Paste Google Meet URL..."
                            className={cn(
                                "w-full pl-11 pr-4 h-14 bg-slate-50 dark:bg-white/5 border rounded-2xl text-sm font-bold text-[#1E293B] dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none transition-all shadow-inner dark:shadow-none",
                                localError 
                                    ? "border-red-500/50 ring-2 ring-red-500/10 focus:border-red-500 focus:ring-red-500/20" 
                                    : "border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20 focus:border-blue-500/50 dark:focus:border-cyan-500/50"
                            )}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !url || !hasOnboardedJobs}
                        className="h-14 px-8 bg-blue-600 dark:bg-cyan-500 text-white dark:text-[#0A0F1E] rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/20 hover:bg-blue-700 dark:hover:bg-cyan-400 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-blue-500/30 dark:border-cyan-400/30"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 dark:border-[#0A0F1E]/30 border-t-white dark:border-t-[#0A0F1E] rounded-full animate-spin" />
                        ) : (
                            <>
                                Start Agent
                                <Play className="size-4 fill-current" />
                            </>
                        )}
                    </button>
                </form>

                {localError && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400"
                    >
                        <ShieldAlert className="size-4 shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{localError}</span>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
