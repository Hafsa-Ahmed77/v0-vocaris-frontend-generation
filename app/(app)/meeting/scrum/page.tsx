"use client"

import { useEffect, useState, Suspense } from "react"
import { createPortal } from "react-dom"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Layout, Sparkles, Ticket, AlertTriangle, CheckCircle2, Pencil, Save, Undo2, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"
import { ClickUpIntegration } from "@/components/scrum/clickup-integration"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

type ScrumTicket = {
    title: string
    description: string
    status?: string
    assignee?: string
    priority?: string
    tags?: string[]
}

type ManifestSection = {
    header: string
    content: string[]
    type: string
}

function ScrumBoardContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const botId = searchParams.get("botId")

    const [tickets, setTickets] = useState<ScrumTicket[]>([])
    const [rawOutput, setRawOutput] = useState<string>("")
    const [manifestSections, setManifestSections] = useState<ManifestSection[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isIntegrationOpen, setIsIntegrationOpen] = useState(false)
    const [isPushed, setIsPushed] = useState(false)

    // Global editing state for any manifest section
    const [editingSectionIdx, setEditingSectionIdx] = useState<number | null>(null)
    const [editingTaskIdx, setEditingTaskIdx] = useState<number | null>(null)
    const [tempSectionContent, setTempSectionContent] = useState<string[]>([])
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

        const fetchScrumData = async () => {
            try {
                setLoading(true)
                setError("")
                console.log("📡 Fetching Scrum data for:", botId)

                const data = await apiFetch(`/meeting-transcripts?bot_id=${botId}&mode=scrum&auto_process=true`)
                console.log("✅ Scrum API Response:", data)

                let extractedTickets: ScrumTicket[] = []
                if (data.tickets && Array.isArray(data.tickets)) {
                    extractedTickets = data.tickets
                } else if (data.participants && Array.isArray(data.participants)) {
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

                const outputText = data.formatted_output || data.summary || ""
                setRawOutput(outputText)

                // Parse sections initially
                if (outputText) {
                    const lines = outputText.split('\n')
                    const sections: ManifestSection[] = []
                    let currentSection: ManifestSection | null = null
                    const headerRegex = /^(👤|📋|📝|📊|🚫|➡️)\s+([A-Z\s]+):(.*)/

                    lines.forEach((line: string) => {
                        const trimmed = line.trim()
                        if (!trimmed || trimmed.startsWith('===') || trimmed.startsWith('---')) return

                        // More flexible header regex
                        const headerMatch = line.match(/^([^\w\s]*)\s*([A-Z\s]{3,20}):(.*)/)
                        if (headerMatch) {
                            if (currentSection) sections.push(currentSection)
                            const [_, emoji, label, trailingContent] = headerMatch
                            currentSection = {
                                header: `${emoji || '📋'} ${label.trim()}:`,
                                content: trailingContent.trim() ? [trailingContent.trim()] : [],
                                type: emoji || '📋'
                            }
                        } else if (currentSection) {
                            currentSection.content.push(line)
                        } else {
                            if (trimmed.length > 0) {
                                sections.push({ header: 'ℹ️ INFO:', content: [line], type: 'ℹ️' })
                            }
                        }
                    })
                    if (currentSection) sections.push(currentSection)
                    setManifestSections(sections)
                }

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

            if (successCount === 0) {
                throw new Error("Failed to push any tickets. Check your ClickUp list status names.")
            }

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

    const handleUpdateSection = (idx: number) => {
        const newSections = [...manifestSections]
        newSections[idx] = { ...newSections[idx], content: tempSectionContent }
        setManifestSections(newSections)
        setEditingSectionIdx(null)
        setTempSectionContent([])
        toast.success("Section updated.")
    }

    const handleUpdateTicket = () => {
        if (editingTaskIdx !== null && tempTicket) {
            const newTickets = [...tickets]
            newTickets[editingTaskIdx] = tempTicket
            setTickets(newTickets)
            setEditingTaskIdx(null)
            setTempTicket(null)
            toast.success("Task updated.")
        }
    }

    return (
        <div className="bg-slate-50 dark:bg-transparent text-slate-900 dark:text-white selection:bg-blue-500/30 transition-colors duration-700 no-scrollbar">
            {/* High-Impact Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], x: [0, 80, 0], y: [0, 50, 0], rotate: [0, 45, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[15%] -left-[15%] w-[80%] h-[80%] bg-blue-600/[0.04] dark:bg-blue-600/[0.08] rounded-full blur-[160px]"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], x: [0, -80, 0], y: [0, -50, 0], rotate: [0, -45, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[15%] -right-[15%] w-[80%] h-[80%] bg-indigo-600/[0.04] dark:bg-indigo-600/[0.08] rounded-full blur-[160px]"
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay pointer-events-none" />
            </div>

            <main className="relative z-10 p-4 lg:p-0 no-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-12">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                        <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">AI Analysis</h2>
                    </div>
                ) : error ? (
                    <div className="max-w-xl mx-auto p-16 rounded-[4rem] bg-white/70 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-center space-y-10 shadow-3xl backdrop-blur-3xl">
                        <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto" />
                        <h3 className="text-3xl font-black">{error}</h3>
                        <Button onClick={() => window.location.reload()}>Restart Engine</Button>
                    </div>
                ) : (
                    <div className="space-y-12 no-scrollbar">
                        {isPushed && (
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 max-w-md mx-auto">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-sm font-black uppercase tracking-widest">Successfully Synced</span>
                            </motion.div>
                        )}

                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="group px-4 lg:px-0 mb-12">
                            <div className="relative p-[1px] rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-blue-500/20 via-transparent to-indigo-500/20 dark:from-white/10 dark:via-transparent dark:to-white/10 shadow-3xl transition-all duration-700">
                                <div className="relative p-5 md:p-6 lg:p-8 rounded-[1.9rem] md:rounded-[2.4rem] bg-white/90 dark:bg-[#1e293b]/50 backdrop-blur-4xl space-y-8 overflow-hidden border border-white/50 dark:border-white/10 no-scrollbar">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-lg shrink-0">
                                                <Layout className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Technical Manifest</h3>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                                    <p className="text-[8px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.3em]">AI Verified</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative max-h-[80vh] overflow-y-auto overflow-x-hidden pr-2 sm:pr-6 no-scrollbar group/logs pl-4 md:pl-8 space-y-6 scroll-smooth">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-indigo-600 to-transparent opacity-20 rounded-full" />

                                        {manifestSections.map((section, idx) => {
                                            const isBlocker = section.type === '🚫';
                                            const isTaskSection = section.header.includes('TASK') || section.header.includes('STORY');

                                            return (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    className={cn(
                                                        "relative p-4 md:p-6 rounded-3xl border transition-all duration-500 group/section",
                                                        isBlocker ? "bg-rose-500/[0.03] border-rose-500/20" : "bg-slate-100/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 hover:border-blue-500/30"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <span className={cn(
                                                                "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border shadow-md",
                                                                isBlocker ? "bg-rose-500/10 border-rose-500/30 text-rose-500" : "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                                                            )}>
                                                                {section.header}
                                                            </span>
                                                            <div className={cn("h-px flex-1", isBlocker ? "bg-gradient-to-r from-rose-500/20 to-transparent" : "bg-gradient-to-r from-blue-500/20 to-transparent")} />
                                                        </div>
                                                        {!isTaskSection && editingSectionIdx !== idx && (
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                                onClick={() => {
                                                                    setEditingSectionIdx(idx);
                                                                    setTempSectionContent([...section.content]);
                                                                }}
                                                            >
                                                                <Pencil className="w-3 h-3" />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        {editingSectionIdx === idx ? (
                                                            <div className="space-y-4">
                                                                <Textarea
                                                                    value={tempSectionContent.join('\n')}
                                                                    onChange={e => setTempSectionContent(e.target.value.split('\n'))}
                                                                    className="min-h-[120px] bg-white dark:bg-slate-950 border-blue-500 shadow-xl text-sm font-medium leading-relaxed"
                                                                />
                                                                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                                                                    <Button size="sm" variant="ghost" onClick={() => setEditingSectionIdx(null)} className="text-slate-500 order-2 sm:order-1"><Undo2 className="w-4 h-4 mr-2" /> Cancel</Button>
                                                                    <Button size="sm" onClick={() => handleUpdateSection(idx)} className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 text-white order-1 sm:order-2"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {!isTaskSection && section.content.map((c, i) => {
                                                                    const parts = c.split(':');
                                                                    const isExplicitMetric = parts.length > 1 && parts[0].trim().toUpperCase() === parts[0].trim() && parts[0].trim().length > 2;
                                                                    const sectionHeaderUpper = section.header.toUpperCase();
                                                                    const sectionIsPriority = sectionHeaderUpper.includes('PRIORITY') || sectionHeaderUpper.includes('DIFFICULTY');

                                                                    const metricLabel = isExplicitMetric ? parts[0].trim() : (sectionIsPriority ? section.header.replace(/[^\w\s]/g, '').replace(':', '').trim() : '');
                                                                    const metricValue = isExplicitMetric ? parts.slice(1).join(':').trim() : c.trim();

                                                                    const isMetric = isExplicitMetric || sectionIsPriority;
                                                                    const numericValue = metricValue.match(/\d+/) ? Math.min(parseInt(metricValue.match(/\d+/)![0]), 10) : 0;

                                                                    return (
                                                                        <div key={i} className="flex flex-col gap-1 group/line cursor-pointer hover:bg-blue-500/5 p-2 rounded-xl transition-all duration-300" onClick={() => { setEditingSectionIdx(idx); setTempSectionContent([...section.content]); }}>
                                                                            <div className="flex items-center justify-between w-full gap-4">
                                                                                <div className="flex items-center gap-4 flex-1 overflow-hidden">
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/30 shrink-0 group-hover/line:bg-blue-500 transition-all scale-100 group-hover/line:scale-125 shadow-[0_0_8px_rgba(59,130,246,0)] group-hover/line:shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                                                                    {isMetric && metricValue ? (
                                                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 overflow-hidden">
                                                                                            {isExplicitMetric && <span className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] min-w-[100px]">{metricLabel}</span>}
                                                                                            <p className="text-sm md:text-lg text-slate-800 dark:text-white font-black tracking-tight shrink-0">{metricValue}</p>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-sm md:text-base break-words">{c.trim()}</p>
                                                                                    )}
                                                                                </div>

                                                                                {(metricLabel.toUpperCase().includes('PRIORITY') || metricLabel.toUpperCase().includes('DIFFICULTY') || sectionIsPriority) && numericValue > 0 && (
                                                                                    <div className="flex gap-1 sm:gap-1.5 shrink-0 overflow-hidden pr-2">
                                                                                        {Array.from({ length: 5 }).map((_, bi) => (
                                                                                            <div
                                                                                                key={bi}
                                                                                                className={cn(
                                                                                                    "h-1.5 sm:h-2.5 w-4 sm:w-10 rounded-[2px] skew-x-[-20deg] transition-all duration-700",
                                                                                                    bi < numericValue
                                                                                                        ? "bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)] border-r border-white/20"
                                                                                                        : "bg-slate-200 dark:bg-white/5"
                                                                                                )}
                                                                                                style={bi < numericValue ? {
                                                                                                    boxShadow: bi === Math.min(numericValue - 1, 4) ? '0 0 25px rgba(59,130,246,1), 15px 0 25px rgba(59,130,246,0.7)' : '0 0 12px rgba(59,130,246,0.4)'
                                                                                                } : {}}
                                                                                            />
                                                                                        ))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}

                                                                {isTaskSection && (
                                                                    <div className="space-y-4 pt-4">
                                                                        {tickets.map((t, tIdx) => (
                                                                            <div key={tIdx} className={cn(
                                                                                "p-4 md:p-6 rounded-2xl border transition-all group/ticket",
                                                                                editingTaskIdx === tIdx
                                                                                    ? "bg-white dark:bg-slate-900 border-blue-500 shadow-2xl"
                                                                                    : "bg-black/5 dark:bg-white/[0.02] border-slate-200/50 dark:border-white/5 hover:border-blue-500/30 hover:shadow-lg"
                                                                            )}>
                                                                                {editingTaskIdx === tIdx ? (
                                                                                    <div className="space-y-4">
                                                                                        <Input value={tempTicket?.title} onChange={e => setTempTicket(prev => prev ? { ...prev, title: e.target.value } : null)} className="bg-white dark:bg-black border-blue-500/50" />
                                                                                        <Textarea value={tempTicket?.description} onChange={e => setTempTicket(prev => prev ? { ...prev, description: e.target.value } : null)} className="bg-white dark:bg-black border-blue-500/50 min-h-[100px]" />
                                                                                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                                                                                            <Button size="sm" variant="ghost" onClick={() => setEditingTaskIdx(null)} className="order-2 sm:order-1">Cancel</Button>
                                                                                            <Button size="sm" onClick={handleUpdateTicket} className="bg-blue-600 text-white shadow-lg shadow-blue-500/20 order-1 sm:order-2">Save</Button>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="flex items-start justify-between gap-4">
                                                                                        <div className="space-y-1 flex-1 cursor-pointer" onClick={() => { setEditingTaskIdx(tIdx); setTempTicket({ ...t }); }}>
                                                                                            <h4 className="text-sm md:text-lg font-black group-hover/ticket:text-blue-500 transition-colors">{t.title}</h4>
                                                                                            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{t.description}</p>
                                                                                        </div>
                                                                                        <div className="flex flex-col gap-2">
                                                                                            <Button size="icon" variant="ghost" className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white" onClick={() => { setEditingTaskIdx(tIdx); setTempTicket({ ...t }); }}><Pencil className="w-4 h-4" /></Button>
                                                                                            <Button size="icon" variant="ghost" className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white" onClick={() => setTickets(tickets.filter((_, ti) => ti !== tIdx))}><Trash2 className="w-4 h-4" /></Button>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Portal Action Button */}
                        {typeof document !== 'undefined' && document.getElementById('scrum-header-action') && createPortal(
                            <Dialog open={isIntegrationOpen} onOpenChange={setIsIntegrationOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className={cn("h-10 px-4 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 shadow-sm font-black uppercase text-[10px] tracking-widest", isPushed ? "border-emerald-500/20 text-emerald-500" : "border-[#7b68ee]/20 text-[#7b68ee]")}>
                                        {isPushed ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                        {isPushed ? "Sync Complete" : "Commit"}
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
                )}
            </main>
        </div>
    )
}

export default function ScrumBoardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
            <ScrumBoardContent />
        </Suspense>
    )
}
