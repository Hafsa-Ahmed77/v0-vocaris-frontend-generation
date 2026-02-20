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
            {/* Gradient Border Glow */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-[2.2rem] opacity-75 blur-[1px] group-hover:opacity-100 transition-opacity" />

            <div className="relative bg-white rounded-[2.1rem] p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-500">
                            <Zap className="w-5 h-5 fill-current" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quick Join</h2>
                    </div>

                    {/* Scrum Toggle */}
                    <button
                        type="button"
                        onClick={() => setIsScrum(!isScrum)}
                        className="flex items-center gap-2 group/toggle px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        <div className={cn(
                            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                            isScrum ? "bg-blue-500 border-blue-500" : "bg-white border-slate-200"
                        )}>
                            {isScrum && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className={cn(
                            "text-sm font-bold transition-colors",
                            isScrum ? "text-blue-500" : "text-slate-400"
                        )}>
                            Scrum Mode
                        </span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <LinkIcon className="w-5 h-5" />
                        </div>
                        <Input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste Google Meet URL (e.g. m..."
                            className="h-14 pl-12 pr-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 text-base focus-visible:ring-2 focus-visible:ring-blue-500/20"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || !url.trim()}
                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
                    >
                        {isLoading ? "Starting..." : (
                            <>
                                Start Agent
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                    <Play className="w-3 h-3 fill-current" />
                                </div>
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}
