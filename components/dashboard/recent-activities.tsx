"use client"

import { CheckCircle2, Mic2, AlertTriangle, UserPlus, MoreHorizontal, MessageSquare, Ticket } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type Activity = {
    id: string
    type: "summary" | "transcript" | "warning" | "contact"
    title: string
    subtitle: string
    timeAgo: string
    isScrum?: boolean
    botId?: string
}

interface RecentActivitiesProps {
    items: Activity[]
}

export function RecentActivities({ items }: RecentActivitiesProps) {
    const router = useRouter()

    useEffect(() => {
        console.log("💎 [RecentActivities] v3 - Navigation Controller Active")
    }, [])

    const getIcon = (type: Activity["type"]) => {
        switch (type) {
            case "summary": return { icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-50" }
            case "transcript": return { icon: Mic2, color: "text-blue-600", bg: "bg-blue-50" }
            case "warning": return { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" }
            case "contact": return { icon: UserPlus, color: "text-green-600", bg: "bg-green-50" }
            default: return { icon: CheckCircle2, color: "text-slate-600", bg: "bg-slate-50" }
        }
    }

    const handleCreateTicket = (activity: Activity) => {
        console.log("🚀 Navigating to Scrum Page for:", activity.botId)
        if (!activity.botId) return
        // Using router.push as primary, window.open as backup if user wants new tab
        router.push(`/meeting/scrum?botId=${activity.botId}`)
    }

    const handleChat = (activity: Activity) => {
        if (activity.botId) {
            router.push(`/meeting/chat?botId=${activity.botId}`)
        } else {
            router.push(`/onboarding-conversation?meetingId=${activity.id}`)
        }
    }

    return (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-50">
                {items.map((item) => {
                    const { icon: Icon, color, bg } = getIcon(item.type)
                    // Safety check: if isScrum is not explicitly true, check title for "scrum"
                    const finalizedIsScrum = item.isScrum ||
                        item.title?.toLowerCase().includes("scrum") ||
                        item.subtitle?.toLowerCase().includes("scrum");

                    return (
                        <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors group gap-4">
                            <div className="flex items-center gap-4">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", bg)}>
                                    <Icon className={cn("w-6 h-6", color)} />
                                </div>
                                <div className="space-y-0.5 min-w-0">
                                    <h4 className="font-bold text-slate-800 leading-tight truncate">{item.title}</h4>
                                    <p className="text-xs font-medium text-slate-400 truncate">{item.subtitle}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 sm:ml-auto">
                                {finalizedIsScrum ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleCreateTicket(item)
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100/50"
                                    >
                                        <Ticket className="w-3.5 h-3.5" />
                                        Create & Assign Ticket
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleChat(item)
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100/50"
                                    >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        Chat with your Meeting
                                    </button>
                                )}

                                <div className="flex flex-col items-end gap-1 ml-2">
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap">{item.timeAgo}</span>
                                    <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-slate-600 transition-all">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <button className="w-full py-5 text-sm font-black text-slate-400 border-t border-slate-100 border-dashed hover:bg-slate-50 transition-all">
                Load More Activity
            </button>
        </div>
    )
}
