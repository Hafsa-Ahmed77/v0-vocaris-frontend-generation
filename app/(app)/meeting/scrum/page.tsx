"use client"

import { useEffect, useState, Suspense } from "react"
import { createPortal } from "react-dom"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Layout, Sparkles, Ticket, AlertTriangle, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"
import { ClickUpIntegration } from "@/components/scrum/clickup-integration"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"

type ScrumTicket = {
    title: string
    description: string
    status?: string
    assignee?: string
    priority?: string
    tags?: string[]
}

function ScrumBoardContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const botId = searchParams.get("botId")

    const [tickets, setTickets] = useState<ScrumTicket[]>([])
    const [rawOutput, setRawOutput] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isIntegrationOpen, setIsIntegrationOpen] = useState(false)
    const [isPushed, setIsPushed] = useState(false)

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

        const fetchScrumData = async () => {
            try {
                setLoading(true)
                setError("")
                console.log("📡 Fetching Scrum data for:", botId)

                const data = await apiFetch(`/meeting-transcripts?bot_id=${botId}&mode=scrum&auto_process=true`)
                console.log("✅ Scrum API Response:", data)

                // Improved data mapping based on observed backend formats
                let extractedTickets: ScrumTicket[] = []

                if (data.tickets && Array.isArray(data.tickets)) {
                    extractedTickets = data.tickets
                } else if (data.participants && Array.isArray(data.participants)) {
                    // Mapping participant updates to tickets if that's the format
                    extractedTickets = data.participants.map((p: any) => ({
                        title: p.title || `Update from ${p.participant || 'Participant'}`,
                        description: p.update || p.description || "No description provided",
                        status: p.status,
                        priority: p.priority,
                        assignee: p.participant
                    }))
                } else if (Array.isArray(data)) {
                    extractedTickets = data
                }

                setTickets(extractedTickets)
                setRawOutput(data.formatted_output || data.summary || "")

            } catch (err: any) {
                console.error("❌ Scrum fetch error:", err)
                setError(err.message || "Failed to load scrum data")
            } finally {
                setLoading(false)
            }
        }

        fetchScrumData()
    }, [botId])

    const handleCommit = async (targetListId: string, token: string, assigneeId?: string) => {
        try {
            setLoading(true)
            let successCount = 0

            // Sequential push loop for maximum compatibility
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
                        // Explicitly sending "To Do" (Title Case) as it's more common than the backend's default "to do"
                        status: ticket.status || "To Do"
                    })
                })

                if (res.ok) successCount++
            }

            if (successCount === 0) {
                throw new Error("Failed to push any tickets. Check your ClickUp list status names.")
            }

            toast.success(`🚀 ${successCount}/${tickets.length} tickets pushed to ClickUp!`)
            setIsPushed(true)
            localStorage.setItem(`vocaris_scrum_pushed_${botId}`, 'true')
            // setIsIntegrationOpen(false) // Removed to allow ClickUpIntegration to show its internal success view
        } catch (err: any) {
            toast.error(err.message || "Something went wrong")
            throw err // Re-throw so ClickUpIntegration knows it failed
        } finally {
            setLoading(false)
        }
    }

    const getPriorityColor = (p?: any) => {
        if (typeof p !== 'string') return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
        switch (p.toLowerCase()) {
            case 'urgent': return 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)]'
            case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)]'
            case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]'
            case 'low': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]'
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
        }
    }

    const formatRawOutput = (text: string) => {
        if (!text) return null

        // Grouping logic: Detect headers starting with emojis and group their content
        const lines = text.split('\n');
        const sections: { header: string, content: string[], type: string }[] = [];
        let currentSection: { header: string, content: string[], type: string } | null = null;

        const headerRegex = /^(👤|📋|📝|📊|🚫|➡️)\s+([A-Z\s]+):(.*)/;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('===') || trimmed.startsWith('---')) return;

            const headerMatch = line.match(headerRegex);
            if (headerMatch) {
                if (currentSection) sections.push(currentSection);
                const [_, emoji, label, trailingContent] = headerMatch;
                currentSection = {
                    header: `${emoji} ${label.trim()}:`,
                    content: trailingContent.trim() ? [trailingContent.trim()] : [],
                    type: emoji
                };
            } else if (currentSection) {
                currentSection.content.push(line);
            } else {
                // Initial content before any header
                if (trimmed.length > 0) {
                    sections.push({ header: 'INFO', content: [line], type: 'ℹ️' });
                }
            }
        });
        if (currentSection) sections.push(currentSection);

        return (
            <div className="space-y-10">
                {sections.map((section, idx) => {
                    const isBlocker = section.type === '🚫';
                    const isStatus = section.type === '📊';

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "relative p-5 md:p-8 rounded-2xl md:rounded-3xl border transition-all duration-500 group/section",
                                isBlocker
                                    ? "bg-rose-500/[0.03] border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.1)]"
                                    : "bg-slate-100/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 hover:border-blue-500/30"
                            )}
                        >
                            {/* Technical L-Brackets */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-inherit opacity-20 group-hover/section:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-inherit opacity-20 group-hover/section:opacity-100 transition-opacity" />

                            <div className="flex items-center gap-4 mb-6">
                                <span className={cn(
                                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg",
                                    isBlocker ? "bg-rose-500/10 border-rose-500/30 text-rose-500" : "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                                )}>
                                    {section.header}
                                </span>
                                <div className={cn("h-px flex-1", isBlocker ? "bg-gradient-to-r from-rose-500/20 to-transparent" : "bg-gradient-to-r from-blue-500/20 to-transparent")} />
                            </div>

                            <div className="space-y-4">
                                {section.content.map((c, i) => {
                                    const cTrim = c.trim();
                                    if (!cTrim) return null;

                                    // Check for sub-metrics in STATUS (e.g., PRIORITY: 3)
                                    if (isStatus && cTrim.includes(':')) {
                                        const [label, val] = cTrim.split(':');
                                        return (
                                            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 bg-slate-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner group/metric w-full">
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}:</span>
                                                <span className="text-sm font-black text-blue-600 dark:text-blue-400 group-hover/metric:scale-110 transition-transform">{val}</span>
                                                {label.includes('PRIORITY') && (
                                                    <div className="flex gap-1 ml-auto">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <div
                                                                key={star}
                                                                className={cn(
                                                                    "w-1.5 h-3 rounded-full transition-all duration-500",
                                                                    star <= parseInt(val) ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" : "bg-slate-200 dark:bg-white/10"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={i} className="flex gap-4 group/line">
                                            {cTrim.startsWith('⚠️') || cTrim.startsWith('➡️') ? null : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/30 mt-2 shrink-0 group-hover/line:scale-150 group-hover/line:bg-blue-500 transition-all duration-300" />
                                            )}
                                            <p className={cn(
                                                "text-base leading-relaxed font-medium transition-colors duration-300",
                                                isBlocker ? "text-rose-600/80 dark:text-rose-200/80 group-hover/line:text-rose-900 dark:group-hover/line:text-rose-100" : "text-slate-600 dark:text-slate-300 group-hover/line:text-slate-900 dark:group-hover:line:text-white"
                                            )}>
                                                {cTrim}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    }


    return (
        <div className="bg-slate-50 dark:bg-transparent text-slate-900 dark:text-white selection:bg-blue-500/30 transition-colors duration-700">
            {/* High-Impact Dynamic Background (Living Mesh) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 80, 0],
                        y: [0, 50, 0],
                        rotate: [0, 45, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[15%] -left-[15%] w-[80%] h-[80%] bg-blue-600/[0.04] dark:bg-blue-600/[0.08] rounded-full blur-[160px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -80, 0],
                        y: [0, -50, 0],
                        rotate: [0, -45, 0]
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[15%] -right-[15%] w-[80%] h-[80%] bg-indigo-600/[0.04] dark:bg-indigo-600/[0.08] rounded-full blur-[160px]"
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay pointer-events-none" />
            </div>

            <main className="relative z-10 p-4 lg:p-0">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-12">
                        <div className="relative w-28 h-28">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-blue-500/20 to-violet-500/20 blur-2xl"
                            />
                            <div className="relative w-full h-full rounded-[2rem] bg-white/40 dark:bg-white/[0.02] border border-white dark:border-white/10 flex items-center justify-center backdrop-blur-3xl shadow-2xl">
                                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                            </div>
                        </div>
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">AI Analysis</h2>
                            <p className="text-blue-500 dark:text-blue-400 font-black uppercase text-[11px] tracking-[0.5em] animate-pulse">Synthesizing Scrum Tickets</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="max-w-xl mx-auto p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] bg-white/70 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-center space-y-10 shadow-3xl relative overflow-hidden group backdrop-blur-3xl">
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-rose-500/40 to-transparent" />
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] bg-rose-500/5 flex items-center justify-center mx-auto text-rose-500 border border-rose-500/10 dark:border-rose-500/20 shadow-lg">
                            <AlertTriangle className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Interruption</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-semibold text-base md:text-lg">{error}</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                            className="h-16 px-12 rounded-2xl border-rose-500/20 hover:bg-rose-500/5 text-rose-500 dark:text-rose-400 font-black uppercase text-[11px] tracking-widest transition-all hover:scale-105 active:scale-95"
                        >
                            Restart Intelligence Engine
                        </Button>
                    </div>
                ) : tickets.length > 0 ? (
                    <div className="space-y-12">
                        {isPushed && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 max-w-md mx-auto"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-sm font-black uppercase tracking-widest">Successfully Synced with ClickUp</span>
                            </motion.div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 auto-rows-fr">
                            <AnimatePresence mode="popLayout">
                                {tickets.map((ticket, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.85, y: 40, filter: "blur(10px)" }}
                                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                                        transition={{ delay: i * 0.1, type: "spring", damping: 15, stiffness: 80 }}
                                        layout
                                        className="group"
                                    >
                                        <div className="h-full relative px-2">
                                            <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-600/10 rounded-[3rem] blur-2xl opacity-40 dark:opacity-30 pointer-events-none transition-opacity duration-700" />
                                            <Card className="h-full relative bg-white/80 dark:bg-white/[0.12] border-slate-200 dark:border-white/20 backdrop-blur-3xl transition-all duration-700 rounded-[2.75rem] overflow-hidden flex flex-col group border shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_40px_80px_-20px_rgba(59,130,246,0.5)] hover:border-blue-500/30 dark:hover:border-blue-400/50 hover:-translate-y-2">
                                                <CardHeader className="pb-6 space-y-8 px-10 pt-10">
                                                    <div className="flex justify-between items-center">
                                                        <Badge variant="outline" className={cn("px-5 py-2 rounded-2xl text-[10px] font-black border uppercase tracking-[0.25em] shadow-sm ring-4 ring-slate-100/50 dark:ring-white/5", getPriorityColor(ticket.priority))}>
                                                            {ticket.priority || "Normal"}
                                                        </Badge>
                                                        {ticket.status && (
                                                            <div className="flex items-center gap-2.5 bg-slate-100/50 dark:bg-white/[0.03] px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-white/5 shadow-inner">
                                                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                                                <span className="text-[11px] uppercase font-black tracking-[0.2em] text-slate-600 dark:text-slate-200">
                                                                    {ticket.status}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <CardTitle className="text-3xl font-black leading-[1.15] text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tighter">
                                                        {ticket.title}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="flex-1 flex flex-col justify-between pt-2 px-10 pb-10">
                                                    <p className="text-base text-slate-600 dark:text-slate-200 leading-relaxed font-semibold transition-colors mb-10">
                                                        {ticket.description}
                                                    </p>
                                                    {ticket.assignee && (
                                                        <div className="pt-8 border-t border-slate-100 dark:border-white/[0.12] flex items-center justify-between mt-auto">
                                                            <div className="flex items-center gap-5">
                                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-900 flex items-center justify-center font-black text-base text-white shadow-xl transition-transform duration-500">
                                                                    {ticket.assignee.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] leading-none mb-2">Assignee</span>
                                                                    <span className="text-base font-black text-slate-800 dark:text-slate-100">{ticket.assignee}</span>
                                                                </div>
                                                            </div>
                                                            <div className="w-12 h-12 rounded-[1.25rem] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-slate-700 bg-slate-50 dark:bg-white/[0.03] shadow-inner">
                                                                <Ticket className="w-5 h-5" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {rawOutput && (
                            <motion.div
                                initial={{ opacity: 0, y: 70 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: 0.2, type: "spring", damping: 20 }}
                                className="mt-32 group px-4 lg:px-0 mb-20"
                            >
                                <div className="relative p-[1px] rounded-[2.5rem] md:rounded-[4rem] bg-gradient-to-br from-blue-500/20 via-transparent to-indigo-500/20 dark:from-white/10 dark:via-transparent dark:to-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] transition-all duration-700">
                                    <div className="relative p-6 md:p-12 lg:p-20 rounded-[2.4rem] md:rounded-[3.9rem] bg-white/90 dark:bg-[#1e293b]/50 backdrop-blur-4xl space-y-8 md:space-y-16 overflow-hidden border border-white/50 dark:border-white/10">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-slate-100 dark:border-white/5 pb-10 md:pb-16">
                                            <div className="flex items-center gap-4 md:gap-8">
                                                <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-3xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-lg shrink-0">
                                                    <Layout className="w-6 h-6 md:w-10 md:h-10 text-blue-600 dark:text-blue-500" />
                                                </div>
                                                <div className="space-y-1 md:space-y-2">
                                                    <h3 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Technical Manifest</h3>
                                                    <div className="flex items-center gap-2 md:gap-3">
                                                        <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                                        <p className="text-[9px] md:text-[11px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em] md:tracking-[0.4em]">Intelligence Engine Verified</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative max-h-[1000px] overflow-y-auto pr-10 no-scrollbar group/logs">
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 via-indigo-600 to-transparent opacity-20 rounded-full" />
                                            <div className="pl-4 md:pl-12">
                                                {formatRawOutput(rawOutput)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Inject ClickUp Action into Header via Portal */}
                        {typeof document !== 'undefined' && document.getElementById('scrum-header-action') && createPortal(
                            <Dialog open={isIntegrationOpen} onOpenChange={setIsIntegrationOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "h-9 sm:h-10 px-2.5 sm:px-4 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 shadow-sm group ml-1 sm:ml-2 shrink-0 font-black uppercase text-[9px] sm:text-[10px] tracking-widest",
                                            isPushed
                                                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:shadow-emerald-500/20"
                                                : "border-[#7b68ee]/20 bg-[#7b68ee]/5 text-[#7b68ee] hover:shadow-[#7b68ee]/20"
                                        )}
                                    >
                                        {isPushed ? (
                                            <>
                                                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" />
                                                <span className="hidden xs:inline">Sync </span>Complete
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 group-hover:rotate-12 transition-transform" />
                                                <span className="hidden xs:inline">Push to </span>ClickUp
                                            </>
                                        )}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-[95vw] sm:max-w-[500px] p-0 bg-transparent border-none overflow-hidden focus:outline-none">
                                    <DialogHeader className="sr-only">
                                        <DialogTitle>ClickUp Integration</DialogTitle>
                                        <DialogDescription>Push tickets to ClickUp.</DialogDescription>
                                    </DialogHeader>
                                    <ClickUpIntegration
                                        onCancel={() => setIsIntegrationOpen(false)}
                                        onCommit={handleCommit}
                                    />
                                </DialogContent>
                            </Dialog>,
                            document.getElementById('scrum-header-action')!
                        )}
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="text-center py-32 px-16 rounded-[5rem] bg-white/70 dark:bg-[#0f172a]/40 border border-slate-200 dark:border-white/10 backdrop-blur-3xl shadow-3xl relative overflow-hidden group">
                            <div className="space-y-16 relative z-10">
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse" />
                                        <div className="w-40 h-40 rounded-[3.5rem] bg-slate-50/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto text-slate-300 dark:text-slate-800 shadow-inner group-hover:scale-110 group-hover:-rotate-12 transition-all duration-1000 relative z-10 backdrop-blur-xl">
                                            <Ticket className="w-20 h-20 group-hover:text-blue-500/40 transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Monitoring Active</span>
                                    </div>
                                    <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">No Insights</h2>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto font-medium text-lg leading-relaxed">
                                        Ready for your next sprint? Your AI-generated scrum tickets and task breakdowns will appear here once the intelligence engine identifies development items.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.reload()}
                                        className="h-16 px-10 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.05] text-slate-900 dark:text-white font-black uppercase text-[11px] tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl hover:shadow-blue-500/20 group w-full sm:w-auto"
                                    >
                                        <Loader2 className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-700" />
                                        Refresh Stream
                                    </Button>
                                    <Button
                                        onClick={() => router.push("/dashboard")}
                                        className="h-16 px-10 rounded-2xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-black uppercase text-[11px] tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/20 w-full sm:w-auto"
                                    >
                                        Return to Command Center
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default function ScrumBoardPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        }>
            <ScrumBoardContent />
        </Suspense>
    )
}
