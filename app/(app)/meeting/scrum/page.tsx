"use client"

import { useEffect, useState, Suspense } from "react"
import { createPortal } from "react-dom"
import { useSearchParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Loader2, Layout, Sparkles, AlertTriangle, CheckCircle2,
    Pencil, Save, Undo2, Trash2, User, ArrowRight, AlertCircle,
    Terminal, Tag, ChevronDown
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"
import { ClickUpIntegration } from "@/components/scrum/clickup-integration"
import { MeetingSelector } from "@/components/meeting/meeting-selector"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

type ScrumTicket = {
    id?: string
    title: string
    description: string
    status?: string
    assignee?: string
    priority?: string | number
    tags?: string[]
    working_on?: string
    blockers?: string
    next_steps?: string
    full_update?: string
    participant_name?: string
}

// --- Helper: Participant avatar initials ---
function getInitials(name?: string) {
    if (!name) return "?"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

// --- Helper: Priority bars ---
function PriorityBars({ value }: { value?: string | number }) {
    const num = Math.min(Math.max(Number(value) || 0, 0), 5)
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "h-3 w-5 rounded-sm skew-x-[-12deg] transition-all duration-500",
                        i < num
                            ? "bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                            : "bg-slate-200 dark:bg-white/10"
                    )}
                />
            ))}
            <span className="ml-2 text-sm font-black text-slate-700 dark:text-slate-300">{num}</span>
        </div>
    )
}

// --- Helper: Status badge color ---
function statusColor(status?: string) {
    const s = (status || "").toLowerCase()
    if (s === "completed" || s === "done") return "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
    if (s.includes("block")) return "bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400"
    return "bg-blue-500/15 border-blue-500/40 text-blue-700 dark:text-blue-400"
}

// --- Individual Ticket Card ---
function TicketCard({
    ticket,
    idx,
    editingIdx,
    tempTicket,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    setTempTicket
}: {
    ticket: ScrumTicket
    idx: number
    editingIdx: number | null
    tempTicket: ScrumTicket | null
    onEdit: (idx: number) => void
    onSave: () => void
    onCancel: () => void
    onDelete: (idx: number) => void
    setTempTicket: (t: ScrumTicket | null) => void
}) {
    const [logsOpen, setLogsOpen] = useState(false)
    const isEditing = editingIdx === idx

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.07 }}
            className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1e293b]/60 shadow-xl overflow-hidden"
        >
            {isEditing ? (
                /* ── EDIT MODE — ALL FIELDS ── */
                <div className="p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Pencil className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-wider">Edit Ticket</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Title */}
                        <div className="lg:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title</label>
                            <Input value={tempTicket?.title || ""} onChange={e => setTempTicket(tempTicket ? { ...tempTicket, title: e.target.value } : null)} placeholder="Ticket title" className="bg-white dark:bg-slate-950 border-blue-500/50 font-semibold text-base h-11" />
                        </div>

                        {/* Description */}
                        <div className="lg:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                            <Textarea value={tempTicket?.description || ""} onChange={e => setTempTicket(tempTicket ? { ...tempTicket, description: e.target.value } : null)} placeholder="Describe the task..." className="bg-white dark:bg-slate-950 border-blue-500/50 min-h-[80px]" />
                        </div>

                        {/* Working On */}
                        <div className="lg:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Working On</label>
                            <Textarea value={tempTicket?.working_on || ""} onChange={e => setTempTicket(tempTicket ? { ...tempTicket, working_on: e.target.value } : null)} placeholder="What is the participant currently working on?" className="bg-white dark:bg-slate-950 border-blue-500/50 min-h-[70px]" />
                        </div>

                        {/* Blockers */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Blockers</label>
                            <Textarea value={tempTicket?.blockers || ""} onChange={e => setTempTicket(tempTicket ? { ...tempTicket, blockers: e.target.value } : null)} placeholder="Any blockers or impediments?" className="bg-white dark:bg-slate-950 border-rose-500/40 min-h-[80px]" />
                        </div>

                        {/* Next Steps */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Next Steps</label>
                            <Textarea value={tempTicket?.next_steps || ""} onChange={e => setTempTicket(tempTicket ? { ...tempTicket, next_steps: e.target.value } : null)} placeholder="What will be done next?" className="bg-white dark:bg-slate-950 border-emerald-500/40 min-h-[80px]" />
                        </div>

                        {/* Status */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                            <Input value={tempTicket?.status || ""} onChange={e => setTempTicket(tempTicket ? { ...tempTicket, status: e.target.value } : null)} placeholder="e.g. In Progress, Completed" className="bg-white dark:bg-slate-950 border-blue-500/50 h-11" />
                        </div>

                        {/* Priority */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority (1–5)</label>
                            <Input type="number" min={1} max={5} value={tempTicket?.priority || ""} onChange={e => setTempTicket(tempTicket ? { ...tempTicket, priority: e.target.value } : null)} placeholder="1 = Low, 5 = Urgent" className="bg-white dark:bg-slate-950 border-blue-500/50 h-11" />
                        </div>

                        {/* Tags */}
                        <div className="lg:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tags (comma separated)</label>
                            <Input value={(tempTicket?.tags || []).join(", ")} onChange={e => setTempTicket(tempTicket ? { ...tempTicket, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) } : null)} placeholder="e.g. Frontend, Bug, Urgent" className="bg-white dark:bg-slate-950 border-blue-500/50 h-11" />
                        </div>

                        {/* Participant */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Participant Name</label>
                            <Input value={tempTicket?.participant_name || tempTicket?.assignee || ""} onChange={e => setTempTicket(tempTicket ? { ...tempTicket, participant_name: e.target.value } : null)} placeholder="Participant name" className="bg-white dark:bg-slate-950 border-blue-500/50 h-11" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
                        <Button size="sm" variant="ghost" onClick={onCancel} className="text-slate-500"><Undo2 className="w-4 h-4 mr-1" /> Cancel</Button>
                        <Button size="sm" onClick={onSave} className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 px-6"><Save className="w-4 h-4 mr-1" /> Save Changes</Button>
                    </div>
                </div>
            ) : (
                /* ── VIEW MODE ── */
                <div className="flex flex-col lg:flex-row">

                    {/* ── LEFT SIDEBAR ── */}
                    <div className="lg:w-[300px] shrink-0 p-8 flex flex-col gap-0 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">

                        {/* Participant */}
                        <div className="space-y-3 py-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Participant</p>
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-500/20 shrink-0">
                                    {getInitials(ticket.participant_name || ticket.assignee)}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-800 dark:text-white leading-tight">
                                        {ticket.participant_name || ticket.assignee || "Team Member"}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Team Member</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-white/5" />

                        {/* Status */}
                        <div className="space-y-3 py-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Status</p>
                            <div className={cn("inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-black", statusColor(ticket.status))}>
                                <div className="w-2 h-2 rounded-full bg-current" />
                                {ticket.status || "Pending"}
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-white/5" />

                        {/* Priority */}
                        <div className="space-y-3 py-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority Level</p>
                            <PriorityBars value={ticket.priority} />
                        </div>

                        {/* Tags */}
                        {ticket.tags && ticket.tags.length > 0 && (
                            <>
                                <div className="h-px bg-slate-100 dark:bg-white/5" />
                                <div className="space-y-3 py-6">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Tag className="w-3 h-3" /> Metadata Tags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {ticket.tags.map((tag, ti) => (
                                            <span key={ti} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ── RIGHT CONTENT ── */}
                    <div className="flex-1 p-8 space-y-7">

                        {/* Header row */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title</p>
                                <h3 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white leading-tight">{ticket.title}</h3>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <Button size="icon" variant="ghost" className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white" onClick={() => onEdit(idx)}>
                                    <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white" onClick={() => onDelete(idx)}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>

                        {/* Description / Working On */}
                        {(ticket.description || ticket.working_on) && (
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Summary &amp; Status Report</p>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 relative overflow-hidden">
                                    <Sparkles className="absolute top-3 right-3 w-4 h-4 text-blue-400/30" />
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                        {ticket.working_on || ticket.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Blockers + Next Steps */}
                        {(ticket.blockers || ticket.next_steps) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {ticket.blockers && (
                                    <div className="p-4 rounded-2xl bg-rose-500/[0.04] border border-rose-500/20 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-wider">Blockers</p>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{ticket.blockers}</p>
                                    </div>
                                )}
                                {ticket.next_steps && (
                                    <div className="p-4 rounded-2xl bg-blue-500/[0.04] border border-blue-500/20 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <ArrowRight className="w-4 h-4 text-blue-500 shrink-0" />
                                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider">Next Steps</p>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{ticket.next_steps}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Full Update / Logs */}
                        {ticket.full_update && (
                            <div className="space-y-2">
                                <button
                                    onClick={() => setLogsOpen(!logsOpen)}
                                    className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    <Terminal className="w-3.5 h-3.5" />
                                    Live Speech Log
                                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", logsOpen && "rotate-180")} />
                                    <span className="ml-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px]">● TRANSCRIPT</span>
                                </button>
                                <AnimatePresence>
                                    {logsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden pt-2"
                                        >
                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                                                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{ticket.full_update}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    )
}


// ─────────────────────────────────────────────────────────────────
function ScrumBoardContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const botId = searchParams.get("bot_id") || searchParams.get("botId")

    const [tickets, setTickets] = useState<ScrumTicket[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isMeetingActive, setIsMeetingActive] = useState(false)
    const [pollCount, setPollCount] = useState(0)
    const [isIntegrationOpen, setIsIntegrationOpen] = useState(false)
    const [isPushed, setIsPushed] = useState(false)

    const [editingTaskIdx, setEditingTaskIdx] = useState<number | null>(null)
    const [tempTicket, setTempTicket] = useState<ScrumTicket | null>(null)

    useEffect(() => {
        if (botId) {
            const pushedStatus = localStorage.getItem(`vocaris_scrum_pushed_${botId}`)
            setIsPushed(pushedStatus === 'true')
        }
    }, [botId])

    useEffect(() => {
        if (!botId) {
            setLoading(false)
            return
        }

        const fetchScrumData = async (isPoll = false) => {
            try {
                if (!isPoll) setLoading(true)
                setError("")
                console.log("📡 Fetching Scrum data for:", botId)

                const data = await apiFetch(`/meeting-tickets/${botId}`)
                console.log("✅ Scrum API Response:", data)

                if (data.status === 'awaiting_analysis') {
                    setIsMeetingActive(true)
                    setIsProcessing(true)
                    return
                }

                if (data.is_processing) {
                    setIsMeetingActive(false)
                    setIsProcessing(true)
                    return
                }

                setIsProcessing(false)
                setIsMeetingActive(false)

                // Extract tickets from all possible shapes
                let extractedTickets: ScrumTicket[] = []
                if (data.tickets && Array.isArray(data.tickets)) {
                    extractedTickets = data.tickets
                } else if (data.participants && Array.isArray(data.participants)) {
                    extractedTickets = data.participants.map((p: any) => ({
                        title: p.title || `Update from ${p.participant || 'Participant'}`,
                        description: p.update || p.description || "No description provided",
                        status: p.status,
                        priority: p.priority,
                        assignee: p.participant,
                        participant_name: p.participant_name || p.participant,
                        working_on: p.working_on,
                        blockers: p.blockers,
                        next_steps: p.next_steps,
                        full_update: p.full_update,
                        tags: p.tags,
                    }))
                } else if (Array.isArray(data)) {
                    extractedTickets = data
                }
                setTickets(extractedTickets)

            } catch (err: any) {
                console.error("❌ Scrum fetch error:", err)
                setError(err.message || "Failed to load scrum data")
            } finally {
                setLoading(false)
            }
        }

        fetchScrumData()

        let pollInterval: NodeJS.Timeout
        if (!loading && isProcessing && pollCount < 9) {
            pollInterval = setInterval(() => {
                setPollCount(prev => prev + 1)
                fetchScrumData(true)
            }, 5000)
        }

        return () => { if (pollInterval) clearInterval(pollInterval) }
    }, [botId, isProcessing, pollCount])

    const handleCommit = async (targetListId: string, token: string, assigneeId?: string) => {
        try {
            setLoading(true)
            let successCount = 0
            for (const ticket of tickets) {
                const res = await fetch(`/api/clickup/task?token=${token}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        list_id: targetListId,
                        name: ticket.title || "Scrum Task",
                        description: ticket.description,
                        priority: ticket.priority === "Urgent" ? 1 : ticket.priority === "High" ? 2 : 3,
                        assignees: assigneeId ? [parseInt(assigneeId)] : [],
                        status: ticket.status || "To Do"
                    })
                })
                if (res.ok) successCount++
            }
            if (successCount === 0) throw new Error("Failed to push any tickets.")
            toast.success(`🚀 ${successCount}/${tickets.length} tickets pushed to ClickUp!`)
            setIsPushed(true)
            localStorage.setItem(`vocaris_scrum_pushed_${botId}`, 'true')
        } catch (err: any) {
            toast.error(err.message || "Something went wrong")
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleSaveTicket = () => {
        if (editingTaskIdx !== null && tempTicket) {
            const newTickets = [...tickets]
            newTickets[editingTaskIdx] = tempTicket
            setTickets(newTickets)
            setEditingTaskIdx(null)
            setTempTicket(null)
            toast.success("Ticket updated.")
        }
    }

    if (!botId) return (
        <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 dark:bg-[#0f172a] min-h-screen">
            <MeetingSelector type="scrum" onSelect={(id) => router.push(`/meeting/scrum?bot_id=${id}`)} />
        </div>
    )

    return (
        <div className="bg-slate-50 dark:bg-transparent text-slate-900 dark:text-white selection:bg-blue-500/30 transition-colors duration-700 no-scrollbar">
            {/* Background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 80, 0], y: [0, 50, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute -top-[15%] -left-[15%] w-[80%] h-[80%] bg-blue-600/[0.05] dark:bg-blue-600/[0.08] rounded-full blur-[160px]" />
                <motion.div animate={{ scale: [1.2, 1, 1.2], x: [0, -80, 0], y: [0, -50, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -bottom-[15%] -right-[15%] w-[80%] h-[80%] bg-indigo-600/[0.05] dark:bg-indigo-600/[0.08] rounded-full blur-[160px]" />
            </div>

            <main className="relative z-10 p-4 lg:p-0 no-scrollbar">
                {/* ── LOADING / PROCESSING ── */}
                {loading || isProcessing ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-12">
                        {isMeetingActive ? (
                            <>
                                <div className="w-24 h-24 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                                    <div className="w-4 h-4 bg-rose-500 rounded-full animate-ping absolute" />
                                    <div className="w-4 h-4 bg-rose-500 rounded-full relative z-10" />
                                </div>
                                <div className="space-y-4 text-center">
                                    <h2 className="text-4xl font-black tracking-tighter">Meeting In Progress</h2>
                                    <p className="text-sm font-bold text-slate-500 max-w-md mx-auto">End the meeting to generate scrum tickets.</p>
                                    <Button onClick={async () => {
                                        try {
                                            await fetch(`/api/end-meeting?botId=${botId}`, { method: 'POST' })
                                            setIsMeetingActive(false); setPollCount(0)
                                            toast.success("Meeting ended! Generating tickets...")
                                        } catch { toast.error("Failed to end meeting") }
                                    }} className="mt-6 bg-rose-600 hover:bg-rose-500 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-rose-500/30">
                                        End Meeting &amp; Generate Tickets
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="relative">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-20 h-20 rounded-[2rem] border-2 border-blue-500/20 border-t-blue-500" />
                                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-500 animate-pulse" />
                                </div>
                                <div className="space-y-4 text-center">
                                    <h2 className="text-4xl font-black tracking-tighter">Finalizing Intelligence</h2>
                                    <p className="text-sm font-bold text-slate-500 animate-pulse">
                                        {pollCount > 3 ? "This is taking longer than usual..." : "Processing meeting data into scrum tickets..."}
                                    </p>
                                    {pollCount >= 9 && (
                                        <div className="pt-8 flex gap-4 items-center justify-center">
                                            <Button variant="outline" onClick={() => { setPollCount(0); setIsProcessing(true) }}>Manual Retry</Button>
                                            <Button variant="ghost" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ) : error ? (
                    /* ── ERROR ── */
                    <div className="max-w-xl mx-auto p-16 rounded-[4rem] bg-white/70 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-center space-y-10 shadow-3xl backdrop-blur-3xl">
                        <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto" />
                        <h3 className="text-3xl font-black">{error}</h3>
                        <Button onClick={() => window.location.reload()}>Restart Engine</Button>
                    </div>
                ) : (
                    /* ── TICKETS ── */
                    <div className="space-y-6 no-scrollbar px-4 lg:px-0 pb-12">
                        {/* Page header */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between pt-2 pb-4 border-b border-slate-200 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                    <Layout className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Technical Manifest</h2>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                                        <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.25em]">
                                            AI Verified · {tickets.length} Ticket{tickets.length !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* No tickets */}
                        {tickets.length === 0 && (
                            <div className="text-center py-20 space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto border border-slate-200 dark:border-white/10">
                                    <Layout className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="text-slate-500 font-semibold">No tickets found for this meeting.</p>
                                <p className="text-xs text-slate-400">Tickets are generated after the meeting ends.</p>
                            </div>
                        )}

                        {/* Ticket cards */}
                        {tickets.map((ticket, idx) => (
                            <TicketCard
                                key={ticket.id || idx}
                                ticket={ticket}
                                idx={idx}
                                editingIdx={editingTaskIdx}
                                tempTicket={tempTicket}
                                onEdit={(i) => { setEditingTaskIdx(i); setTempTicket({ ...tickets[i] }) }}
                                onSave={handleSaveTicket}
                                onCancel={() => { setEditingTaskIdx(null); setTempTicket(null) }}
                                onDelete={(i) => { setTickets(tickets.filter((_, ti) => ti !== i)); toast.success("Ticket removed.") }}
                                setTempTicket={setTempTicket}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Portal commit button */}
            {typeof document !== 'undefined' && document.getElementById('scrum-header-action') && createPortal(
                <Dialog open={isIntegrationOpen} onOpenChange={setIsIntegrationOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className={cn("h-10 px-4 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 shadow-sm font-black uppercase text-[10px] tracking-widest", isPushed ? "border-emerald-500/20 text-emerald-500" : "border-[#7b68ee]/20 text-[#7b68ee]")}>
                            {isPushed ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                            {isPushed ? "Sync Complete" : "Commit Changes"}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 bg-transparent border-none focus:outline-none [&>button]:hidden max-sm:max-w-[95vw] sm:max-w-md mx-auto">
                        <DialogHeader className="sr-only"><DialogTitle>ClickUp</DialogTitle><DialogDescription>Commit tasks</DialogDescription></DialogHeader>
                        <ClickUpIntegration onCancel={() => setIsIntegrationOpen(false)} onCommit={handleCommit} />
                    </DialogContent>
                </Dialog>,
                document.getElementById('scrum-header-action')!
            )}
        </div>
    )
}

export default function ScrumBoardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-cyan-400" /></div>}>
            <ScrumBoardContent />
        </Suspense>
    )
}
