"use client"

import { useState } from "react"
import { Zap, Link as LinkIcon, Play, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface QuickJoinProps {
    onStartAgent: (url: string, isScrum: boolean) => Promise<void>
    isLoading?: boolean
}

export function QuickJoin({ onStartAgent, isLoading }: QuickJoinProps) {
    const [url, setUrl] = useState("")
    const [isScrum, setIsScrum] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url.trim()) return
        await onStartAgent(url, isScrum)
    }

    return (
        <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-violet-500/20 rounded-[2.2rem] opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 ring-4 ring-blue-50">
                            <Zap className="size-5 fill-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">Quick Join</h2>
                            <p className="text-xs text-slate-400 font-medium leading-none mt-1">Ready to automate your next meeting</p>
                        </div>
                    </div>

                    <div
                        onClick={() => setIsScrum(!isScrum)}
                        className="flex items-center gap-2 cursor-pointer select-none group/toggle px-3 py-2 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 transition-colors"
                    >
                        <div className={cn(
                            "w-8 h-4 rounded-full p-0.5 transition-colors duration-300",
                            isScrum ? "bg-blue-600" : "bg-slate-300"
                        )}>
                            <div className={cn(
                                "w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm",
                                isScrum ? "translate-x-4" : "translate-x-0"
                            )} />
                        </div>
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest transition-colors",
                            isScrum ? "text-blue-600" : "text-slate-400"
                        )}>
                            Scrum Mode
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste Google Meet or Zoom URL..."
                            className="w-full pl-11 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !url}
                        className="h-14 px-8 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Start Agent
                                <Play className="size-4 fill-white" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
