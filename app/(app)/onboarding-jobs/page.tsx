"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus, 
    Building2, 
    Mic, 
    ArrowRight, 
    Pencil, 
    Search, 
    Clock, 
    Briefcase, 
    Sparkles, 
    FileText, 
    RotateCcw,
    CheckCircle2,
    X,
    MessageSquare,
    Save,
    Check,
    Loader2,
    Trash2,
    Settings2,
    CalendarClock,
    History
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { getUserJobs, createJob, updateJob, deleteJob, getUserSessions, getJobDetails, getVoiceMeetingTranscripts, updateVoiceMessage } from "@/lib/api"

type Job = {
    job_id: string
    company_name: string
    role: string
    description?: string
    last_session_id?: string // Client-side hydration of session link
}

export default function OnboardingJobsPage() {
    const router = useRouter()
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    
    // Neural Review Modal State
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [reviewingJob, setReviewingJob] = useState<Job | null>(null)
    const [reviewTranscripts, setReviewTranscripts] = useState<any[]>([])
    const [isReviewLoading, setIsReviewLoading] = useState(false)
    const [editingMsgIndex, setEditingMsgIndex] = useState<number | null>(null)
    const [editMsgValue, setEditMsgValue] = useState("")
    const [isSavingMsg, setIsSavingMsg] = useState(false)

    const [showForm, setShowForm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState({ company_name: "", role: "", description: "" })
    const [userId, setUserId] = useState<string | null>(null)
    const [userName, setUserName] = useState("User")
    const [error, setError] = useState<string | null>(null)

    // Editing & Deleting
    const [editingJob, setEditingJob] = useState<Job | null>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // Transcripts viewer state
    const [viewingTranscriptsJob, setViewingTranscriptsJob] = useState<Job | null>(null)
    const [jobSessions, setJobSessions] = useState<any[]>([])
    const [loadingSessions, setLoadingSessions] = useState(false)

    useEffect(() => {
        const raw = localStorage.getItem("user")
        if (raw) {
            try {
                const u = JSON.parse(raw)
                const uid = u.user_id || u.id || u.sub || u.uuid
                if (uid) setUserId(uid)
                if (u.first_name || u.full_name || u.name) {
                    setUserName(u.first_name || u.full_name || u.name)
                }
            } catch { }
        }
    }, [])

    useEffect(() => {
        if (!userId) {
            const timeout = setTimeout(() => {
                if (!userId) setLoading(false)
            }, 2000)
            return () => clearTimeout(timeout)
        }
        
        setLoading(true)
        getUserJobs()
            .then(async (data: any) => {
                const list = Array.isArray(data) ? data : (data?.jobs || [])
                setJobs(list)
                
                // Background Hydration: Check session status for each job
                const jobsWithSessions = await Promise.all(list.map(async (job: any) => {
                    try {
                        const details = await getJobDetails(job.job_id) as any
                        console.log(`[JobManager] 🔍 Debug Hydration for ${job.job_id}:`, details)
                        
                        // Check ALL possible session fields (Normalized for System B)
                        const sessions = details?.conversation_sessions ||
                                         details?.voice_sessions || 
                                         details?.onboarding_sessions || 
                                         details?.sessions || 
                                         details?.recordings || 
                                         details?.voice_meeting_sessions ||
                                         details?.onboarding_history || [];
                        
                        const directSid = details?.session_id || details?.bot_id || details?.id;
                        
                        if (sessions && sessions.length > 0) {
                            const latest = sessions[sessions.length - 1] // Take latest
                            const sid = latest.session_id || latest.bot_id || latest.id || latest.uuid
                            return { ...job, last_session_id: sid }
                        } else if (directSid) {
                            return { ...job, last_session_id: directSid }
                        }
                    } catch (e) {
                        console.warn(`[JobManager] Failed to hydrate session for job ${job.job_id}`, e)
                    }
                    return job
                }))
                setJobs(jobsWithSessions)
            })
            .catch(() => setJobs([]))
            .finally(() => setLoading(false))
    }, [userId])

    const handleCreate = async () => {
        if (!userId || !form.company_name.trim() || !form.role.trim()) return
        setSubmitting(true)
        setError(null)
        try {
            await createJob({
                company_name: form.company_name.trim(),
                role: form.role.trim(),
                description: form.description.trim() || undefined,
            })
            // Refresh jobs list
            const data = await getUserJobs() as any
            const list = Array.isArray(data) ? data : (data?.jobs || [])
            setJobs(list)
            setForm({ company_name: "", role: "", description: "" })
            setShowForm(false)
        } catch (e: any) {
            setError("Failed to create job. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdateJob = async () => {
        if (!editingJob || !form.company_name.trim() || !form.role.trim()) return
        setSubmitting(true)
        setError(null)
        try {
            await updateJob(editingJob.job_id, {
                company_name: form.company_name.trim(),
                role: form.role.trim(),
                description: form.description.trim() || undefined,
            })
            const data = await getUserJobs() as any
            const list = Array.isArray(data) ? data : (data?.jobs || [])
            setJobs(list)
            setEditingJob(null)
        } catch (e: any) {
            setError("Failed to update job.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteJob = async (jobId: string) => {
        if (!confirm("Are you sure you want to delete this context? This action cannot be undone.")) return
        setIsDeleting(jobId)
        try {
            await deleteJob(jobId)
            setJobs(prev => prev.filter(j => j.job_id !== jobId))
        } catch (e: any) {
            setError("Failed to delete job.")
        } finally {
            setIsDeleting(null)
        }
    }

    const handleViewTranscripts = async (job: Job) => {
        setLoadingSessions(true)
        console.log(`[JobManager] 🚀 Fetching transcripts for Job ID: ${job.job_id}`)
        try {
            // Fetch job details which contain the linked onboarding sessions
            const data = await getJobDetails(job.job_id) as any
            // System B: Standardized session retrieval (Exhaustive check)
            const rawSessions = Array.isArray(data?.conversation_sessions)
                ? data.conversation_sessions
                : Array.isArray(data?.voice_sessions) 
                    ? data.voice_sessions 
                    : Array.isArray(data?.onboarding_sessions)
                        ? data.onboarding_sessions
                        : Array.isArray(data?.sessions)
                            ? data.sessions
                            : Array.isArray(data?.recordings)
                                ? data.recordings
                                : Array.isArray(data?.voice_meeting_sessions)
                                    ? data.voice_meeting_sessions
                                    : Array.isArray(data?.onboarding_history)
                                        ? data.onboarding_history
                                        : [];
            
            const directSid = data?.session_id || data?.bot_id || data?.id;

            if (rawSessions.length > 0) {
                // Since backend standardized on 1 session per job, we take the latest/last one
                const latestSession = rawSessions[rawSessions.length - 1];
                const sessionId = latestSession.session_id || latestSession.bot_id || latestSession.id || latestSession.uuid;
                
                console.log(`[JobManager] ✅ Found session ${sessionId}. Redirecting to transcript review...`)
                router.push(`/onboarding-conversation?session_id=${sessionId}&job_id=${job.job_id}`)
            } else if (directSid) {
                console.log(`[JobManager] ✅ Found direct session link ${directSid}. Redirecting...`)
                router.push(`/onboarding-conversation?session_id=${directSid}&job_id=${job.job_id}`)
            } else {
                // If no sessions, we open the modal to show the "No Sessions Found" state
                setViewingTranscriptsJob(job)
                setJobSessions([])
                console.warn(`[JobManager] ❌ No sessions found for Job ${job.job_id}`)
            }
        } catch (e) {
            console.error("[JobManager] ❌ Failed to load voice meeting transcripts:", e)
            setViewingTranscriptsJob(job)
            setJobSessions([])
        } finally {
            setLoadingSessions(false)
        }
    }

    const handleStartSession = (job: Job) => {
        router.push(`/onboarding-conversation?job_id=${job.job_id}`)
    }

    const openReviewModal = async (job: Job) => {
        if (!job.last_session_id) return
        
        setReviewingJob(job)
        setIsReviewModalOpen(true)
        setIsReviewLoading(true)
        setReviewTranscripts([])
        setEditingMsgIndex(null)

        try {
            const data = await getVoiceMeetingTranscripts(job.last_session_id) as any
            const list = Array.isArray(data) ? data : (data?.transcripts || data?.data || [])
            setReviewTranscripts(list)
        } catch (err) {
            console.error("[ReviewModal] Failed to fetch transcripts:", err)
        } finally {
            setIsReviewLoading(false)
        }
    }

    const handleUpdateTranscript = async (index: number) => {
        if (!reviewingJob?.last_session_id || isSavingMsg) return
        
        setIsSavingMsg(true)
        try {
            await updateVoiceMessage(reviewingJob.last_session_id, index, editMsgValue)
            
            // Update local state
            const newTranscripts = [...reviewTranscripts]
            newTranscripts[index] = { 
                ...newTranscripts[index], 
                message: editMsgValue,
                is_edited: true 
            }
            setReviewTranscripts(newTranscripts)
            setEditingMsgIndex(null)
        } catch (err) {
            console.error("[ReviewModal] Update failed:", err)
        } finally {
            setIsSavingMsg(false)
        }
    }

    return (
        <div className="flex flex-col relative w-full h-full">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full" />
            </div>

            <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 relative z-10">
                {/* Jobs Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                        <AnimatePresence>
                            {jobs.map((job, i) => (
                                <motion.div
                                    key={job.job_id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className={cn(
                                        "group relative flex flex-col p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-1 overflow-hidden",
                                        job.last_session_id
                                            ? (isDarkMode
                                                ? "bg-cyan-500/5 border-cyan-500/20 hover:bg-cyan-500/10 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                                                : "bg-cyan-50/30 border-cyan-100 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10")
                                            : (isDarkMode
                                                ? "bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                                                : "bg-purple-50/30 border-purple-100 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10")
                                    )}
                                >
                                    {/* Subtle internal gradient matching status */}
                                    <div className={cn(
                                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                        job.last_session_id 
                                            ? "bg-gradient-to-br from-cyan-600/10 to-indigo-600/10" 
                                            : "bg-gradient-to-br from-purple-600/10 to-indigo-600/10"
                                    )} />

                                    <div className="flex items-start justify-between gap-4 relative z-10 mb-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 transition-colors duration-500 relative z-10",
                                            job.last_session_id
                                                ? (isDarkMode ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 group-hover:border-cyan-500/50 group-hover:text-cyan-300 group-hover:bg-cyan-500/20" : "bg-cyan-100 border-cyan-200 text-cyan-600 group-hover:bg-cyan-500/10 group-hover:text-cyan-500 group-hover:border-cyan-500/30")
                                                : (isDarkMode ? "bg-purple-500/10 border-purple-500/30 text-purple-400 group-hover:border-purple-500/50 group-hover:text-purple-300 group-hover:bg-purple-500/20" : "bg-purple-100 border-purple-200 text-purple-600 group-hover:bg-purple-500/10 group-hover:text-purple-500 group-hover:border-purple-500/30")
                                        )}>
                                            {job.last_session_id ? <Sparkles className="w-6 h-6 animate-pulse" /> : <Building2 className="w-6 h-6" />}
                                        </div>

                                        <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setForm({ company_name: job.company_name, role: job.role, description: job.description || "" }); setEditingJob(job) }}
                                                className={cn("p-2 rounded-lg transition-all duration-300 scale-90 group-hover:scale-100", isDarkMode ? "hover:bg-purple-500/20 text-purple-300 hover:text-purple-200" : "hover:bg-purple-100 text-purple-500 hover:text-purple-700")}
                                                title="Edit Job"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col gap-1 relative z-10 mb-6">
                                        <div className="flex items-center gap-2">
                                            <h3 className={cn("font-black text-lg tracking-tight truncate", isDarkMode ? "text-white" : "text-slate-900")}>
                                                {job.role}
                                            </h3>
                                            {job.last_session_id && (
                                                <div className="px-1.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[7px] font-black text-cyan-400 uppercase tracking-widest whitespace-nowrap">
                                                    PROFILE READY
                                                </div>
                                            )}
                                        </div>
                                        <p className={cn("text-xs font-bold uppercase tracking-widest", isDarkMode ? "text-purple-300/80 group-hover:text-purple-200" : "text-purple-600 group-hover:text-purple-700")}>
                                            @ {job.company_name}
                                        </p>
                                        {job.description && (
                                            <p className={cn("text-sm mt-3 line-clamp-2 font-medium leading-relaxed", isDarkMode ? "text-purple-200/60 group-hover:text-purple-200/80" : "text-slate-600")}>
                                                {job.description}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (job.last_session_id) {
                                                openReviewModal(job)
                                            } else {
                                                handleStartSession(job)
                                            }
                                        }}
                                        className={cn(
                                            "mt-auto w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 relative z-10",
                                            job.last_session_id
                                                ? (isDarkMode 
                                                    ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600 hover:text-white hover:border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                                    : "bg-cyan-100/50 text-cyan-700 border border-cyan-200 hover:bg-cyan-600 hover:text-white hover:border-cyan-600 shadow-sm")
                                                : (isDarkMode 
                                                    ? "bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-600 hover:text-white hover:border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                                    : "bg-purple-100/50 text-purple-700 border border-purple-200 hover:bg-purple-600 hover:text-white hover:border-purple-600 shadow-sm")
                                        )}
                                    >
                                        {job.last_session_id ? (
                                            <>
                                                <Sparkles className="w-3.5 h-3.5" />
                                                Review Neural Profile
                                            </>
                                        ) : (
                                            <>
                                                <Mic className="w-3.5 h-3.5" />
                                                Launch Neural Sync
                                            </>
                                        )}
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Add New Job Card */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: jobs.length * 0.08 }}
                            onClick={() => setShowForm(true)}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 border-dashed transition-all duration-300 hover:-translate-y-1 min-h-[220px] group overflow-hidden",
                                isDarkMode
                                    ? "bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40"
                                    : "bg-purple-50/50 border-purple-200 hover:bg-purple-100 hover:border-purple-400"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-full border flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-90",
                                isDarkMode ? "bg-purple-900/30 border-purple-500/30 text-purple-400 group-hover:border-purple-500/50 group-hover:text-purple-300 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]" : "bg-white border-purple-200 text-purple-400 group-hover:border-purple-400 group-hover:text-purple-500"
                            )}>
                                <Plus className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className={cn("font-black tracking-tight", isDarkMode ? "text-purple-200 group-hover:text-white" : "text-purple-800 group-hover:text-purple-950")}>
                                    Add New Context
                                </span>
                                <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDarkMode ? "text-purple-400/60 group-hover:text-purple-300" : "text-purple-500")}>
                                    Create Another Job
                                </span>
                            </div>
                        </motion.button>
                    </div>
                )}

                {error && (
                    <p className="text-red-400 text-sm font-bold text-center mb-4">{error}</p>
                )}

                {/* Create Job Modal/Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                            onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false) }}
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                className={cn(
                                    "w-full max-w-md rounded-[2rem] p-8 border relative space-y-6 shadow-[0_0_50px_rgba(168,85,247,0.1)]",
                                    isDarkMode ? "bg-[#0f172a] border-purple-500/20" : "bg-white border-purple-200 shadow-2xl"
                                )}
                            >
                                <button
                                    onClick={() => setShowForm(false)}
                                    className={cn(
                                        "absolute top-5 right-5 p-2 rounded-xl transition-all duration-300",
                                        isDarkMode ? "text-purple-400/60 hover:text-purple-200 hover:bg-purple-500/10" : "text-purple-400 hover:text-purple-900 hover:bg-purple-50"
                                    )}
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div>
                                    <h2 className={cn("text-2xl font-black uppercase tracking-tight", isDarkMode ? "text-purple-50" : "text-purple-950")}>New Job</h2>
                                    <p className={cn("text-[10px] font-bold uppercase tracking-widest mt-1", isDarkMode ? "text-purple-400/60" : "text-purple-500")}>
                                        The AI will use this context during onboarding
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className={cn("text-[10px] font-black uppercase tracking-widest", isDarkMode ? "text-purple-400/80" : "text-purple-600")}>
                                            Company Name *
                                        </label>
                                        <Input
                                            value={form.company_name}
                                            onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
                                            placeholder="e.g. Acme Corp"
                                            className={cn(
                                                "h-12 rounded-xl font-bold transition-all focus:ring-2 disabled:opacity-50",
                                                isDarkMode ? "bg-[#0f172a] border-purple-500/30 focus:border-purple-500/50 focus:ring-purple-500/30 text-white placeholder:text-purple-500/40" : "bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-500/20 placeholder:text-purple-300"
                                            )}
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={cn("text-[10px] font-black uppercase tracking-widest", isDarkMode ? "text-purple-400/80" : "text-purple-600")}>
                                            Role / Job Title *
                                        </label>
                                        <Input
                                            value={form.role}
                                            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                            placeholder="e.g. Senior Product Manager"
                                            className={cn(
                                                "h-12 rounded-xl font-bold transition-all focus:ring-2 disabled:opacity-50",
                                                isDarkMode ? "bg-[#0f172a] border-purple-500/30 focus:border-purple-500/50 focus:ring-purple-500/30 text-white placeholder:text-purple-500/40" : "bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-500/20 placeholder:text-purple-300"
                                            )}
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-2", isDarkMode ? "text-purple-400/80" : "text-purple-600")}>
                                            Description <span className={cn("text-[8px] px-1.5 py-0.5 rounded-sm", isDarkMode ? "text-purple-300/60 bg-purple-500/10" : "text-purple-700 bg-purple-100")}>Optional</span>
                                        </label>
                                        <Input
                                            value={form.description}
                                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                            placeholder="Brief context about the role..."
                                            className={cn(
                                                "h-12 rounded-xl font-bold transition-all focus:ring-2 disabled:opacity-50",
                                                isDarkMode ? "bg-[#0f172a] border-purple-500/30 focus:border-purple-500/50 focus:ring-purple-500/30 text-white placeholder:text-purple-500/40" : "bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-500/20 placeholder:text-purple-300"
                                            )}
                                            disabled={submitting}
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCreate}
                                    disabled={submitting || !form.company_name.trim() || !form.role.trim()}
                                    className={cn(
                                        "w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300",
                                        isDarkMode
                                            ? "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:shadow-none border border-purple-500/50"
                                            : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/30 disabled:opacity-50"
                                    )}
                                >
                                    {submitting ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Creating...</span>
                                        </div>
                                    ) : (
                                        <span className="flex items-center gap-2">Create Job Context <ArrowRight className="w-4 h-4" /></span>
                                    )}
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Edit Job Modal */}
                <AnimatePresence>
                    {editingJob && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                            onClick={(e) => { if (e.target === e.currentTarget) setEditingJob(null) }}
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                className={cn(
                                    "w-full max-w-md rounded-[2rem] p-8 border relative space-y-6 shadow-[0_0_50px_rgba(168,85,247,0.1)]",
                                    isDarkMode ? "bg-[#0f172a] border-purple-500/20" : "bg-white border-purple-200 shadow-2xl"
                                )}
                            >
                                <button
                                    onClick={() => setEditingJob(null)}
                                    className={cn(
                                        "absolute top-5 right-5 p-2 rounded-xl transition-all duration-300",
                                        isDarkMode ? "text-purple-400/60 hover:text-purple-200 hover:bg-purple-500/10" : "text-purple-400 hover:text-purple-900 hover:bg-purple-50"
                                    )}
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div>
                                    <h2 className={cn("text-2xl font-black uppercase tracking-tight", isDarkMode ? "text-purple-50" : "text-purple-950")}>Edit Job</h2>
                                    <p className={cn("text-[10px] font-bold uppercase tracking-widest mt-1", isDarkMode ? "text-purple-400/60" : "text-purple-500")}>
                                        Update your contextual information
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className={cn("text-[10px] font-black uppercase tracking-widest", isDarkMode ? "text-purple-400/80" : "text-purple-600")}>
                                            Company Name *
                                        </label>
                                        <Input
                                            value={form.company_name}
                                            onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
                                            placeholder="e.g. Acme Corp"
                                            className={cn(
                                                "h-12 rounded-xl font-bold transition-all focus:ring-2 disabled:opacity-50",
                                                isDarkMode ? "bg-[#0f172a] border-purple-500/30 focus:border-purple-500/50 focus:ring-purple-500/30 text-white placeholder:text-purple-500/40" : "bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-500/20 placeholder:text-purple-300"
                                            )}
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={cn("text-[10px] font-black uppercase tracking-widest", isDarkMode ? "text-purple-400/80" : "text-purple-600")}>
                                            Role / Job Title *
                                        </label>
                                        <Input
                                            value={form.role}
                                            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                            placeholder="e.g. Senior Product Manager"
                                            className={cn(
                                                "h-12 rounded-xl font-bold transition-all focus:ring-2 disabled:opacity-50",
                                                isDarkMode ? "bg-[#0f172a] border-purple-500/30 focus:border-purple-500/50 focus:ring-purple-500/30 text-white placeholder:text-purple-500/40" : "bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-500/20 placeholder:text-purple-300"
                                            )}
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-2", isDarkMode ? "text-purple-400/80" : "text-purple-600")}>
                                            Description <span className={cn("text-[8px] px-1.5 py-0.5 rounded-sm", isDarkMode ? "text-purple-300/60 bg-purple-500/10" : "text-purple-700 bg-purple-100")}>Optional</span>
                                        </label>
                                        <Input
                                            value={form.description}
                                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                            placeholder="Brief context about the role..."
                                            className={cn(
                                                "h-12 rounded-xl font-bold transition-all focus:ring-2 disabled:opacity-50",
                                                isDarkMode ? "bg-[#0f172a] border-purple-500/30 focus:border-purple-500/50 focus:ring-purple-500/30 text-white placeholder:text-purple-500/40" : "bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-500/20 placeholder:text-purple-300"
                                            )}
                                            disabled={submitting}
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleUpdateJob}
                                    disabled={submitting || !form.company_name.trim() || !form.role.trim()}
                                    className={cn(
                                        "w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300",
                                        isDarkMode
                                            ? "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:shadow-none border border-purple-500/50"
                                            : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/30 disabled:opacity-50"
                                    )}
                                >
                                    {submitting ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Saving...</span>
                                        </div>
                                    ) : (
                                        <span className="flex items-center gap-2">Save Changes</span>
                                    )}
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* View Transcripts Modal */}
                <AnimatePresence>
                    {viewingTranscriptsJob && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                            onClick={(e) => { if (e.target === e.currentTarget) setViewingTranscriptsJob(null) }}
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                className={cn(
                                    "w-full max-w-lg rounded-[2rem] p-8 border relative flex flex-col max-h-[80vh] shadow-[0_0_50px_rgba(168,85,247,0.1)]",
                                    isDarkMode ? "bg-[#0f172a] border-purple-500/20" : "bg-white border-purple-200 shadow-2xl"
                                )}
                            >
                                <button
                                    onClick={() => setViewingTranscriptsJob(null)}
                                    className={cn(
                                        "absolute top-5 right-5 p-2 rounded-xl transition-all duration-300 z-10",
                                        isDarkMode ? "text-purple-400/60 hover:text-purple-200 hover:bg-purple-500/10" : "text-purple-400 hover:text-purple-900 hover:bg-purple-50"
                                    )}
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="mb-6 flex-shrink-0 flex items-center justify-between pr-10">
                                    <div>
                                        <h2 className={cn("text-2xl font-black uppercase tracking-tight", isDarkMode ? "text-purple-50" : "text-purple-950")}>Session Transcripts</h2>
                                        <p className={cn("text-[10px] font-bold uppercase tracking-widest mt-1", isDarkMode ? "text-purple-400/60" : "text-purple-500")}>
                                            {viewingTranscriptsJob.role} @ {viewingTranscriptsJob.company_name}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleViewTranscripts(viewingTranscriptsJob)}
                                        disabled={loadingSessions}
                                        className={cn(
                                            "p-2 rounded-xl border transition-all duration-300",
                                            isDarkMode 
                                                ? "bg-white/5 border-white/10 text-purple-400 hover:bg-white/10 hover:border-white/20" 
                                                : "bg-slate-100 border-slate-200 text-purple-600 hover:bg-slate-200"
                                        )}
                                        title="Refresh Sessions"
                                    >
                                        <RotateCcw className={cn("w-4 h-4", loadingSessions && "animate-spin")} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 min-h-[200px]">
                                    {loadingSessions ? (
                                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                                            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                            <span className={cn("text-xs font-bold uppercase tracking-widest", isDarkMode ? "text-purple-400/60" : "text-purple-500/60")}>Loading transcripts...</span>
                                        </div>
                                    ) : jobSessions.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50 py-10">
                                            <div className="relative">
                                                <div className={cn("absolute inset-0 blur-xl rounded-full opacity-20", isDarkMode ? "bg-purple-500" : "bg-purple-200")} />
                                                <FileText className={cn("w-16 h-16 relative z-10", isDarkMode ? "text-purple-500/40" : "text-purple-300")} />
                                            </div>
                                            <div className="text-center space-y-1">
                                                <p className={cn("text-xs font-black uppercase tracking-widest", isDarkMode ? "text-purple-300" : "text-purple-700")}>No Sessions Found</p>
                                                <p className={cn("text-[10px] uppercase font-bold tracking-widest max-w-[200px] leading-relaxed", isDarkMode ? "text-slate-500" : "text-slate-400")}>
                                                    Recordings normally appear a few minutes after the session ends.
                                                </p>
                                            </div>
                                            <Button 
                                                onClick={() => handleViewTranscripts(viewingTranscriptsJob)}
                                                variant="outline"
                                                size="sm"
                                                className="mt-2 text-[10px] font-black uppercase tracking-widest"
                                            >
                                                Check Again
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {jobSessions.map(session => (
                                                <div 
                                                    key={session.bot_id} 
                                                    onClick={() => router.push(`/onboarding-conversation?session_id=${session.bot_id}&job_id=${session.job_id}`)}
                                                    className={cn(
                                                        "flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group",
                                                        isDarkMode 
                                                            ? "bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40" 
                                                            : "bg-purple-50/50 border-purple-100 hover:bg-purple-100/80 hover:border-purple-300"
                                                    )}
                                                >
                                                    <div className="flex flex-col truncate pr-4">
                                                        <span className={cn("font-bold text-sm truncate transition-colors", isDarkMode ? "text-slate-200 group-hover:text-white" : "text-slate-800 group-hover:text-purple-900")}>
                                                            {session.meeting_title || "Neural Sync Session"}
                                                        </span>
                                                        <span className={cn("text-[10px] uppercase font-bold tracking-widest mt-1", isDarkMode ? "text-purple-400/70" : "text-purple-500")}>
                                                            {new Date(session.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className={cn("p-2 rounded-lg flex-shrink-0 transition-colors", isDarkMode ? "bg-slate-800/80 text-purple-400 group-hover:bg-purple-500/20 group-hover:text-purple-300" : "bg-white text-purple-400 group-hover:bg-purple-100 group-hover:text-purple-600 shadow-sm")}>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            {/* Neural Review Modal Overlay */}
            <AnimatePresence>
                {isReviewModalOpen && reviewingJob && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                            onClick={() => setIsReviewModalOpen(false)}
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={cn(
                                "relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border overflow-hidden shadow-2xl z-10",
                                isDarkMode ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"
                            )}
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-cyan-600/10 to-indigo-600/10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className={cn("text-xl font-black uppercase tracking-tight", isDarkMode ? "text-white" : "text-slate-900")}>
                                            Neural Sync Review
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest leading-none">
                                                {reviewingJob.role}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                                                {reviewingJob.company_name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="p-2 rounded-xl hover:bg-white/5 transition-colors text-slate-400"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body - Transcript Area */}
                            <div className="flex-1 overflow-hidden">
                                <ScrollArea className="h-[50vh] md:h-[65vh] w-full px-6 md:px-10 py-6">
                                    {isReviewLoading ? (
                                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                                            <p className="text-[10px] font-black text-cyan-500/60 uppercase tracking-[0.3em]">Extracting Neural Data...</p>
                                        </div>
                                    ) : (
                                        <div className="max-w-3xl mx-auto space-y-6">
                                            {reviewTranscripts.map((msg, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className={cn(
                                                        "flex flex-col gap-2",
                                                        msg.role === 'user' ? "items-end" : "items-start"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2 px-1">
                                                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">
                                                            {msg.role === 'user' ? 'Voice Uplink' : 'Neural Agent'}
                                                        </span>
                                                        {msg.is_edited && (
                                                            <div className="flex items-center gap-1 text-cyan-500/60">
                                                                <span className="text-[6px] font-black uppercase tracking-widest">Corrected</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className={cn(
                                                        "group relative max-w-[90%] p-4 rounded-2xl border transition-all duration-300",
                                                        msg.role === 'user'
                                                            ? (isDarkMode 
                                                                ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-50 hover:border-cyan-500/40" 
                                                                : "bg-cyan-50 border-cyan-100 text-cyan-900")
                                                            : (isDarkMode
                                                                ? "bg-slate-800/50 border-white/5 text-slate-300"
                                                                : "bg-slate-50 border-slate-100 text-slate-700")
                                                    )}>
                                                        {editingMsgIndex === idx ? (
                                                            <div className="flex flex-col gap-2 min-w-[220px] md:min-w-[400px]">
                                                                <textarea
                                                                    autoFocus
                                                                    value={editMsgValue}
                                                                    onChange={(e) => setEditMsgValue(e.target.value)}
                                                                    className="w-full bg-slate-950/50 border border-cyan-500/30 rounded-lg p-3 text-sm text-cyan-50 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none font-medium"
                                                                    rows={3}
                                                                />
                                                                <div className="flex justify-end gap-2">
                                                                    <button 
                                                                        onClick={() => setEditingMsgIndex(null)}
                                                                        className="px-3 py-1 text-[8px] font-black text-slate-500 uppercase tracking-widest"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleUpdateTranscript(idx)}
                                                                        disabled={isSavingMsg}
                                                                        className="px-3 py-1 bg-cyan-500 text-white rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5"
                                                                    >
                                                                        {isSavingMsg ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Save className="w-2.5 h-2.5" />}
                                                                        Save
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-start gap-3">
                                                                <p className="flex-1 text-sm font-medium leading-relaxed">{msg.message}</p>
                                                                {msg.role === 'user' && !editingMsgIndex && (
                                                                    <button 
                                                                        onClick={() => {
                                                                            setEditingMsgIndex(idx)
                                                                            setEditMsgValue(msg.message)
                                                                        }}
                                                                        className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-all text-cyan-400 opacity-60 hover:opacity-100 flex-shrink-0"
                                                                        title="Edit Neural Data"
                                                                    >
                                                                        <Pencil className="w-3 h-3" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {reviewTranscripts.length === 0 && !isReviewLoading && (
                                                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                                    <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                                                    <p className="text-xs font-bold uppercase tracking-widest">No neural data found for this session.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-white/5 bg-slate-900/50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Status: Ready for Finalization</span>
                                </div>
                                <button 
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="h-12 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95 uppercase text-[10px] tracking-widest flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    Finalize & Save Profile
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
