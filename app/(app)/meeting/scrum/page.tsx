"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Layout, Sparkles, CheckCircle2, Ticket, AlertTriangle } from "lucide-react"
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

    useEffect(() => {
        if (!botId) {
            setError("No meeting ID provided")
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

    const getPriorityColor = (p?: any) => {
        if (typeof p !== 'string') return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
        switch (p.toLowerCase()) {
            case 'urgent': return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
            case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
            case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            case 'low': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
            </div>

            <header className="relative z-20 border-b border-white/5 bg-black/20 backdrop-blur-xl px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/dashboard')}
                            className="rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-400" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-black flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-400" />
                                Project Intelligence
                            </h1>
                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Scrum Analysis Mode</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Dialog open={isIntegrationOpen} onOpenChange={setIsIntegrationOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 rounded-xl font-bold transition-all"
                                >
                                    <Ticket className="w-4 h-4 mr-2" />
                                    Authorize ClickUp to Commit
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl bg-transparent border-0 p-0 shadow-none">
                                <DialogHeader className="sr-only">
                                    <DialogTitle>Connect ClickUp</DialogTitle>
                                    <DialogDescription>
                                        Authorize and select lists to push your scrum tickets.
                                    </DialogDescription>
                                </DialogHeader>
                                <ClickUpIntegration
                                    onCancel={() => setIsIntegrationOpen(false)}
                                    onCommit={async (listId, token, assigneeId) => {
                                        console.log("🚀 Committing tickets to List:", listId)
                                        toast.loading(`Pushing ${tickets.length} ticket(s) to ClickUp...`)

                                        const priorityMap: Record<string, number> = {
                                            urgent: 1, high: 2, normal: 3, low: 4
                                        }

                                        let successCount = 0
                                        for (const ticket of tickets) {
                                            try {
                                                const body: any = {
                                                    list_id: listId,
                                                    name: ticket.title,
                                                    description: ticket.description || "",
                                                    priority: priorityMap[String(ticket.priority ?? "").toLowerCase()] || 3,
                                                    due_days: 7,
                                                    tags: ticket.tags || [],
                                                }
                                                if (assigneeId) body.assignees = [parseInt(assigneeId)]

                                                const res = await fetch(`/api/clickup/task?token=${token}`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify(body),
                                                })
                                                const result = await res.json()
                                                console.log(`✅ Created task: ${ticket.title}`, result)
                                                successCount++
                                            } catch (e) {
                                                console.error(`❌ Failed to create task: ${ticket.title}`, e)
                                            }
                                        }

                                        toast.dismiss()
                                        toast.success(`${successCount}/${tickets.length} tickets pushed to ClickUp!`)
                                        setIsIntegrationOpen(false)
                                    }}
                                />
                            </DialogContent>
                        </Dialog>

                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all active:scale-95"
                        >
                            Refresh Results
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-8">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                            <Loader2 className="w-16 h-16 animate-spin text-blue-500 relative z-10" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-white">AI is distilling tickets...</h2>
                            <p className="text-slate-500 font-medium">This usually takes 10-20 seconds after a meeting ends.</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="max-w-2xl mx-auto p-12 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/20 text-center space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto text-rose-500">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-white">Generation Pending</h3>
                            <p className="text-slate-400">{error}</p>
                        </div>
                        <Button variant="outline" onClick={() => window.location.reload()} className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 rounded-xl">
                            Retry Generation
                        </Button>
                    </div>
                ) : tickets.length > 0 ? (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {tickets.map((ticket, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Card className="h-full bg-white/[0.03] border-white/10 backdrop-blur-2xl hover:bg-white/[0.06] transition-all rounded-[2rem] overflow-hidden flex flex-col group border-2 hover:border-blue-500/30">
                                            <CardHeader className="pb-4 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <Badge variant="outline" className={cn("capitalize px-3 py-1 rounded-full text-[10px] font-black border-0 tracking-widest", getPriorityColor(ticket.priority))}>
                                                        {ticket.priority || "Normal"}
                                                    </Badge>
                                                    {ticket.status && (
                                                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                                                            {ticket.status}
                                                        </span>
                                                    )}
                                                </div>
                                                <CardTitle className="text-lg font-black leading-tight text-white group-hover:text-blue-400 transition-colors">
                                                    {ticket.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex-1 flex flex-col justify-between">
                                                <p className="text-sm text-slate-400 leading-relaxed line-clamp-4 mb-6">
                                                    {ticket.description}
                                                </p>
                                                {ticket.assignee && (
                                                    <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xs text-white">
                                                            {ticket.assignee.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-300">{ticket.assignee}</span>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {rawOutput && (
                            <div className="mt-16 p-8 md:p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-6">
                                <h3 className="text-2xl font-black flex items-center gap-3">
                                    <Layout className="w-6 h-6 text-blue-500" />
                                    Full Scrum Output
                                </h3>
                                <pre className="whitespace-pre-wrap text-sm text-slate-400 leading-relaxed font-mono">
                                    {rawOutput}
                                </pre>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 px-12 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6">
                        <div className="w-20 h-20 rounded-full bg-slate-800/30 flex items-center justify-center mx-auto mb-4 text-slate-600">
                            <Ticket className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-white">No Tickets Found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium">We couldn't extract distinct tickets from this meeting yet. If the meeting just ended, please wait a minute and refresh.</p>
                        <Button variant="outline" onClick={() => window.location.reload()} className="hover:bg-white/5 rounded-xl border-white/10 text-slate-400">
                            Reload Session
                        </Button>
                    </div>
                )}
            </main>
        </div>
    )
}

export default function ScrumBoardPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        }>
            <ScrumBoardContent />
        </Suspense>
    )
}
