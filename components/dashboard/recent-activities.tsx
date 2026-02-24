"use client"

import { CheckCircle2, Mic2, AlertTriangle, UserPlus, MessageSquare, Ticket, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
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
    onLoadMore?: () => void
    isLoading?: boolean
    hasMore?: boolean
}

export function RecentActivities({ items, onLoadMore, isLoading, hasMore }: RecentActivitiesProps) {
    const router = useRouter()

    useEffect(() => {
        console.log("💎 [RecentActivities] v5 - Active")
    }, [])

    const getConfig = (type: Activity["type"]) => {
        switch (type) {
            case "summary": return { icon: CheckCircle2, color: "text-violet-600", bg: "bg-violet-50 border-violet-100", stripe: "from-violet-400 to-violet-500", label: "Summary", labelColor: "bg-violet-50 text-violet-500 border-violet-100" }
            case "transcript": return { icon: Mic2, color: "text-blue-600", bg: "bg-blue-50 border-blue-100", stripe: "from-blue-400 to-blue-500", label: "Transcript", labelColor: "bg-blue-50 text-blue-500 border-blue-100" }
            case "warning": return { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50 border-orange-100", stripe: "from-orange-400 to-orange-500", label: "Alert", labelColor: "bg-orange-50 text-orange-500 border-orange-100" }
            case "contact": return { icon: UserPlus, color: "text-green-600", bg: "bg-green-50 border-green-100", stripe: "from-green-400 to-green-500", label: "Contact", labelColor: "bg-green-50 text-green-500 border-green-100" }
            default: return { icon: CheckCircle2, color: "text-slate-500", bg: "bg-slate-50 border-slate-100", stripe: "from-slate-300 to-slate-400", label: "Event", labelColor: "bg-slate-50 text-slate-400 border-slate-100" }
        }
    }

    const handleCreateTicket = (activity: Activity) => {
        console.log("🚀 Navigating to Scrum Page for:", activity.botId)
        if (!activity.botId) return
        router.push(`/meeting/scrum?botId=${activity.botId}`)
    }

    const handleChat = (activity: Activity) => {
        if (activity.botId) {
            router.push(`/meeting/chat?botId=${activity.botId}`)
        } else {
            router.push(`/onboarding-conversation?meetingId=${activity.id}`)
        }
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-slate-100 shadow-sm text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                    <Inbox className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-600">No recent activity</p>
                    <p className="text-xs text-slate-400 mt-0.5">Your past meetings will appear here</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white border border-slate-100 dark:border-slate-800/50 rounded-[2rem] shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-50 dark:divide-slate-800/20">
                {items.map((item) => {
                    const { icon: Icon, color, bg, stripe, label, labelColor } = getConfig(item.type)
                    const finalizedIsScrum = item.isScrum ||
                        item.title?.toLowerCase().includes("scrum") ||
                        item.subtitle?.toLowerCase().includes("scrum")

                    return (
                        <div
                            key={item.id}
                            className="group relative flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 hover:bg-slate-50/80 transition-all duration-300"
                        >
                            {/* Left colored stripe */}
                            <div className={cn("absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b opacity-25 group-hover:opacity-100 transition-opacity", stripe)} />

                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                {/* Icon */}
                                <div className={cn("w-11 h-11 rounded-[1.25rem] border flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110", bg)}>
                                    <Icon className={cn("w-5 h-5", color)} />
                                </div>

                                {/* Title + subtitle */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-slate-800 dark:text-slate-900 truncate leading-tight tracking-tight">
                                        {item.title}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate font-semibold">
                                            {item.subtitle}
                                        </p>
                                        <span className="text-slate-200 dark:text-slate-300 text-[10px] shrink-0">·</span>
                                        <span className="text-[10px] text-slate-300 dark:text-slate-400 font-bold whitespace-nowrap shrink-0">
                                            {item.timeAgo}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action button */}
                            <div className="flex items-center gap-2 w-full sm:w-auto sm:shrink-0 pt-2 sm:pt-0 border-t border-slate-50 sm:border-0 border-dashed">
                                {finalizedIsScrum ? (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleCreateTicket(item) }}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all active:scale-95 border border-violet-500"
                                    >
                                        <Ticket className="size-3.5" />
                                        Scrum Tickets
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleChat(item) }}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 border border-blue-500"
                                    >
                                        <MessageSquare className="size-3.5" />
                                        Chat with AI
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {hasMore !== false && (
                <button
                    onClick={onLoadMore}
                    disabled={isLoading}
                    className="w-full py-4 text-[10px] font-black text-slate-400 border-t border-dashed border-slate-100 hover:bg-slate-50 hover:text-blue-600 transition-all uppercase tracking-[0.2em] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                            Loading...
                        </>
                    ) : (
                        "View Full Activity History"
                    )}
                </button>
            )}
        </div>
    )
}
