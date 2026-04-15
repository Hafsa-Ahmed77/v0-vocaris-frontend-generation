"use client"

import { useState } from "react"
import { Zap, Link as LinkIcon, Play, Briefcase, ChevronDown } from "lucide-react"
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
    jobs?: any[]
}

export function QuickJoin({ onStartAgent, isLoading, jobs = [] }: QuickJoinProps) {
    const [url, setUrl] = useState("")
    const [isScrum, setIsScrum] = useState(false)
    const [selectedJobId, setSelectedJobId] = useState<string>("")

    // Auto-select if only one job exists
    useEffect(() => {
        if (jobs.length === 1 && !selectedJobId) {
            setSelectedJobId(jobs[0].job_id)
        }
    }, [jobs, selectedJobId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url.trim()) return
        await onStartAgent(url, isScrum, (selectedJobId && selectedJobId !== "none") ? selectedJobId : undefined)
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

                {jobs.length > 0 && (
                    <div className="mb-4 relative animate-in fade-in slide-in-from-top-2 duration-500">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block px-1">
                            Job Context (Optional)
                        </label>

                        <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                            <SelectTrigger className="w-full h-12 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-[#1E293B] dark:text-white px-11 relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-blue-500 dark:text-cyan-500 pointer-events-none" />
                                <SelectValue placeholder="Generic / No Context" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-[#0A0F1E] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl">
                                <SelectItem value="none">Generic / No Context</SelectItem>
                                {jobs.map((job) => (
                                    <SelectItem key={job.job_id} value={job.job_id}>
                                        {job.company_name} — {job.role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 relative">
                    <div className="flex-1 relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500" />
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste Google Meet URL..."
                            className="w-full pl-11 pr-4 h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-[#1E293B] dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20 focus:border-blue-500/50 dark:focus:border-cyan-500/50 transition-all shadow-inner dark:shadow-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !url}
                        className="h-14 px-8 bg-blue-600 dark:bg-cyan-500 text-white dark:text-[#0A0F1E] rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/20 hover:bg-blue-700 dark:hover:bg-cyan-400 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 border border-blue-500/30 dark:border-cyan-400/30"
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
            </div>
        </div>
    )
}
