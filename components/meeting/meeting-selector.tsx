import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    MessageSquare, 
    Ticket, 
    Calendar, 
    Clock, 
    ArrowRight, 
    Search,
    Inbox,
    Loader2,
    Sparkles,
    CheckCircle2
} from "lucide-react"
import { useRouter } from "next/navigation"
import { getMeetingHistory } from "@/lib/api"
import { cn } from "@/lib/utils"
import { formatDistanceToNow, format } from "date-fns"

interface MeetingSelectorProps {
    type: "chat" | "scrum"
    onSelect: (botId: string) => void
}

export function MeetingSelector({ type, onSelect }: MeetingSelectorProps) {
    const router = useRouter()
    const [meetings, setMeetings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true)
                const data = await getMeetingHistory(50, 0)
                const rawMeetings = data?.meetings || []
                
                // Intelligent Filtering
                const filtered = rawMeetings.filter((m: any) => {
                    const isScrum = m.is_scrum === true || 
                                    m.is_scrum === "true" || 
                                    Number(m.is_scrum) === 1 || 
                                    m.scrum_mode === true || 
                                    m.is_scrum_mode === true || 
                                    m.meeting_title?.toLowerCase().includes("scrum");
                    
                    return type === "scrum" ? isScrum : !isScrum;
                })

                setMeetings(filtered)
            } catch (err) {
                console.error("Failed to fetch history:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [type])

    const filteredMeetings = meetings.filter(m => 
        (m.meeting_title || "").toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-1000">
                <div className="relative group">
                    <div className="absolute -inset-4 bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-2xl animate-pulse" />
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 rounded-[2rem] border-2 border-slate-200 dark:border-white/5 border-t-blue-500 dark:border-t-cyan-500 relative z-10"
                    />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-500 dark:text-cyan-500 animate-bounce" />
                </div>
                <div className="text-center space-y-2 relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 dark:text-cyan-500">Neural Sync Active</p>
                    <h2 className="text-lg font-bold text-slate-400 dark:text-slate-500">Scanning Intelligence Archives...</h2>
                </div>
            </div>
        )
    }

    if (meetings.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8 p-12 rounded-[3.5rem] bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 backdrop-blur-3xl shadow-2xl max-w-xl w-full mx-auto"
            >
                <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto text-blue-600 dark:text-blue-500 shadow-xl">
                    <Inbox className="w-12 h-12" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">No {type === "scrum" ? "Scrum" : "Past"} Meetings</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] max-w-[280px] mx-auto leading-loose pb-4">
                        Your neural history is empty. Start a new session to begin intelligence analysis.
                    </p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-12 px-8 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 mx-auto flex items-center gap-2"
                    >
                        Return to Command Center
                    </button>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 py-6 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="space-y-6 relative">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/5">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-2 h-2 rounded-full animate-pulse",
                                type === 'scrum' ? "bg-violet-500" : "bg-blue-500 dark:bg-cyan-500"
                            )} />
                            <p className={cn(
                                "text-[10px] font-black uppercase tracking-[0.5em]",
                                type === 'scrum' ? "text-violet-600" : "text-blue-600 dark:text-cyan-500"
                            )}>Frame Selection</p>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                            {type === "chat" ? "Intelligence Archives" : "Scrum History"}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-xs">Browse and reconstruct meeting context from neural records.</p>
                    </div>
                    {type === "scrum" ? (
                        <div className="hidden sm:block p-4 bg-violet-500/10 rounded-2xl border border-violet-500/20 text-violet-500 shadow-xl shadow-violet-500/5">
                            <Ticket className="w-8 h-8" />
                        </div>
                    ) : (
                        <div className="hidden sm:block p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-500 shadow-xl shadow-blue-500/5">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
                    <input
                        type="text"
                        placeholder="Search archives by title"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-14 pr-6 text-sm font-bold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredMeetings.map((meeting, idx) => (
                        <motion.div
                            key={meeting.bot_id || idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => onSelect(meeting.bot_id)}
                            className="group cursor-pointer"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.05] border border-slate-200 dark:border-white/5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md hover:border-blue-500/30 dark:hover:border-cyan-500/30 relative overflow-hidden gap-4">
                                {/* Side Indicator */}
                                <div className={cn(
                                    "absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5",
                                    type === "scrum" ? "bg-violet-500" : "bg-blue-500 dark:bg-cyan-500"
                                )} />

                                {/* Left: Icon + Info */}
                                <div className="flex items-center gap-4 flex-1 min-w-0 pl-2">
                                    <div className={cn(
                                        "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all shadow-sm border shrink-0",
                                        type === "scrum"
                                            ? "bg-violet-500/5 border-violet-500/10 text-violet-500"
                                            : "bg-blue-500/5 border-blue-500/10 text-blue-500 dark:text-cyan-400"
                                    )}>
                                        {type === "scrum" ? <Ticket className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                                    </div>
                                    <div className="space-y-1 flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white tracking-tight truncate leading-tight group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                                                {meeting.meeting_title || "Untitled Intelligence Record"}
                                            </h3>
                                            <div className={cn(
                                                "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border shrink-0",
                                                type === 'scrum'
                                                    ? "bg-violet-500/10 text-violet-600 border-violet-500/20"
                                                    : "bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/20"
                                            )}>
                                                Vocaris AI
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <Calendar className="w-3 h-3 shrink-0" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                                    {meeting.start_time ? format(new Date(meeting.start_time), "MMM d, yyyy") : "—"}
                                                    <span className="mx-1 text-slate-300">·</span>
                                                    {meeting.start_time ? formatDistanceToNow(new Date(meeting.start_time), { addSuffix: true }) : "Recent"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                                                <Clock className="w-3 h-3 shrink-0" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                                    {meeting.duration || "Session Finalized"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Action Button */}
                                <div className="flex items-center justify-end gap-3 pl-2 sm:pl-0 sm:shrink-0">
                                    {meeting.transcript_count > 0 && (
                                        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 text-[8px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">
                                            <CheckCircle2 className="w-3 h-3 animate-pulse" />
                                            Indexed
                                        </div>
                                    )}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onSelect(meeting.bot_id) }}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[1.5px] transition-all active:scale-95 border whitespace-nowrap",
                                            type === "scrum"
                                                ? "bg-violet-600 dark:bg-violet-500/10 text-white dark:text-violet-400 border-violet-600 dark:border-violet-500/20 hover:bg-violet-700 dark:hover:bg-violet-500/20 shadow-lg shadow-violet-500/10"
                                                : "bg-blue-600 dark:bg-cyan-500/10 text-white dark:text-cyan-400 border-blue-600 dark:border-cyan-500/20 hover:bg-blue-700 dark:hover:bg-cyan-500/20 shadow-lg shadow-blue-500/10"
                                        )}
                                    >
                                        {type === "scrum" ? "Analyze Scrum" : "Chat with AI"}
                                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}
