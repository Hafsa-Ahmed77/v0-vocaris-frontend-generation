"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mic,
  MicOff,
  ArrowLeft,
  ArrowRight,
  Bot,
  User,
  Sparkles,
  Zap,
  Terminal,
  ShieldCheck,
  Cpu,
  Network,
  Waves,
  Loader2,
  Moon,
  Sun,
  Briefcase,
  Plus,
  Building2,
  Check,
  Edit2,
  Save,
  RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  getUserJobs, createJob, startVoiceMeetingWithJob, getJobDetails,
  getVoiceMeetingTranscripts,
  getVoiceMeetingStatus,
  updateVoiceMessage,
  endVoiceMeeting,
} from "@/lib/api"

type Transcript = { speaker: "user" | "agent"; text: string; message_id?: string }
type Job = { job_id: string; company_name: string; role: string; last_session_id?: string }

export default function OnboardingConversation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [userName, setUserName] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [agentSpeaking, setAgentSpeaking] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [mappingProgress, setMappingProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(90)
  const [isInterrupted, setIsInterrupted] = useState(false)
  const [isGracefulEnd, setIsGracefulEnd] = useState(false)
  const [hasStartedTalking, setHasStartedTalking] = useState(false)

  const { theme: siteTheme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const isDarkMode = mounted ? (resolvedTheme === "dark") : true
  const [theme, setThemeMode] = useState<"purple" | "blue">("blue")

  // Job context — selected inline in the entry screen
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showNewJobForm, setShowNewJobForm] = useState(false)
  const [newJobForm, setNewJobForm] = useState({ company_name: "", role: "" })
  const [creatingJob, setCreatingJob] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Transcript Editing State
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [isUpdatingMessage, setIsUpdatingMessage] = useState(false)

  const [currentBotId, setCurrentBotId] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const botIdRef = useRef<string | null>(null)
  const timerStartedRef = useRef(false)
  const gracefulEndRef = useRef(false)
  const syncingRef = useRef(false)

  // Load user ID and jobs on mount
  // Tries multiple common field names since the backend User schema may vary
  useEffect(() => {
    const raw = localStorage.getItem("user")
    if (raw) {
      try {
        const u = JSON.parse(raw)
        // Try all plausible user_id field names from the backend
        const uid = u.user_id || u.id || u.sub || u.uuid || null
        if (uid) {
          setCurrentUserId(uid)
          getUserJobs()
            .then((data: any) => {
              // Backend might return array directly or { jobs: [...] }
              const list = Array.isArray(data) ? data : (data?.jobs || [])
              // Normalize jobs to ensure they have job_id field
              const normalizedJobs = list.map((j: any) => ({
                ...j,
                job_id: j.job_id || j.id || j.uuid
              }))
              setJobs(normalizedJobs)
              
              // Hydrate job details in background to detect already-onboarded jobs
              Promise.all(normalizedJobs.map(async (job: any) => {
                try {
                  const details = await getJobDetails(job.job_id)
                  const sessions = details?.conversation_sessions || details?.voice_sessions || details?.onboarding_sessions || details?.sessions || []
                  if (sessions && sessions.length > 0) {
                    const sess = sessions[0]
                    return { ...job, last_session_id: sess.session_id || sess.bot_id || sess.id || sess.uuid }
                  }
                } catch { /* ignore */ }
                return job
              })).then(hydrated => setJobs(hydrated))

              // Auto-select job if passed from Job Manager
              const passedJobId = searchParams.get("job_id")
              const passedSessionId = searchParams.get("session_id")
              
              if (passedJobId) {
                const match = normalizedJobs.find((j: any) => j.job_id === passedJobId)
                if (match) {
                  setSelectedJob(match)
                  
                  // Defensive Check: If we have a job but no session_id in URL,
                  // check if this job ALREADY has an onboarding session.
                  if (!passedSessionId) {
                    console.log(`[Onboarding] 🛡️ Checking for existing session for Job: ${passedJobId}`)
                    getJobDetails(passedJobId).then((details: any) => {
                      const sessions = details?.conversation_sessions || details?.voice_sessions || details?.onboarding_sessions || details?.sessions || []
                      if (sessions && sessions.length > 0) {
                        const sess = sessions[0]
                        const sid = sess.session_id || sess.bot_id || sess.id || sess.uuid
                        console.log(`[Onboarding] ⚡ Job already onboarded. Auto-linking session ${sid}`)
                        botIdRef.current = sid
                        setCurrentBotId(sid)
                        syncTranscripts(sid)
                      }
                    }).catch((err: any) => console.warn("[Onboarding] Job detail check failed:", err))
                  }
                }
              }

              if (passedSessionId) {
                botIdRef.current = passedSessionId
                setCurrentBotId(passedSessionId)
                // Trigger sync immediately for review mode
                syncTranscripts(passedSessionId)
              }
            })
            .catch(() => setJobs([]))
            .finally(() => setJobsLoading(false))
        } else {
          setJobsLoading(false)
        }
        const name = u.first_name || u.name || u.display_name || ""
        if (name) setUserName(name)
      } catch { setJobsLoading(false) }
    } else {
      setJobsLoading(false)
    }
  }, [])

  const [jobCreateError, setJobCreateError] = useState<string | null>(null)

  const handleCreateJob = async () => {
    setJobCreateError(null)
    if (!currentUserId) {
      setJobCreateError("User session not found. Please refresh and try again.")
      return
    }
    if (!newJobForm.company_name.trim() || !newJobForm.role.trim()) {
      setJobCreateError("Company name and role are required.")
      return
    }
    setCreatingJob(true)
    try {
      const created: any = await createJob({
        company_name: newJobForm.company_name.trim(),
        role: newJobForm.role.trim(),
      })
      console.log("[JobCreate] Response:", created)

      const fresh: any = await getUserJobs()
      console.log("[JobCreate] Fresh list:", fresh)

      // The backend returns { jobs: [...] } instead of direct array
      const rawList = Array.isArray(fresh) ? fresh : (fresh?.jobs || [])

      // Normalize jobs to ensure they have job_id field
      const normalizedList = rawList.map((j: any) => ({
        ...j,
        job_id: j.job_id || j.id || j.uuid
      }))

      setJobs(normalizedList)

      // Auto-select the newly created job
      const targetId = created?.job_id || created?.id || created?.uuid
      const newJob = normalizedList.find((j: any) => j.job_id === targetId) || normalizedList[normalizedList.length - 1]

      if (newJob) {
        console.log("[JobCreate] Selecting job:", newJob)
        setSelectedJob(newJob)
        setShowNewJobForm(false)
        setNewJobForm({ company_name: "", role: "" })
      } else {
        console.warn("[JobCreate] No job found to select")
      }
    } catch (e: any) {
      console.error("[JobCreate] Error:", e)
      setJobCreateError("Failed to create job. Check your connection and try again.")
    }
    setCreatingJob(false)
  }

  // Legacy theme loader was removed to enforce the global Blue standard.

  // Color dynamic classes helper
  const accentColor = theme === "purple" ? "purple" : "blue"
  const themeClasses = {
    text: theme === "purple" ? "text-purple-500" : "text-blue-500",
    textLight: theme === "purple" ? "text-purple-400" : "text-blue-400",
    bg: theme === "purple" ? "bg-purple-600" : "bg-blue-600",
    bgHover: theme === "purple" ? "bg-purple-500" : "bg-blue-500",
    bgAlpha: theme === "purple" ? "bg-purple-500/10" : "bg-blue-500/10",
    bgAlphaStrong: theme === "purple" ? "bg-purple-500/20" : "bg-blue-500/20",
    border: theme === "purple" ? "border-purple-500/20" : "border-blue-500/20",
    borderStrong: theme === "purple" ? "border-purple-500/40" : "border-blue-500/40",
    glow: theme === "purple" ? "shadow-purple-500" : "shadow-blue-500",
    ring: theme === "purple" ? "focus:ring-purple-500/40" : "focus:ring-blue-500/40",
    gradient: theme === "purple" ? "from-purple-600 to-indigo-600" : "from-blue-600 to-indigo-600",
    selection: theme === "purple" ? "selection:bg-purple-500/30" : "selection:bg-blue-500/30",
    atmosGlow: theme === "purple" ? (isDarkMode ? "bg-purple-600/[0.05]" : "bg-purple-400/[0.1]") : (isDarkMode ? "bg-blue-600/[0.05]" : "bg-blue-400/[0.1]")
  }

  // Optimized Precision Timer & Mapping Sync
  // Precision Timer & Mapping Sync
  useEffect(() => {
    let interval: any
    // Start interval as soon as connected, but only decrement if hasStartedTalking is true
    if (status === "connected" && timeLeft > 0) {
      interval = setInterval(() => {
        if (!hasStartedTalking) return // Wait for first message

        setTimeLeft(prev => {
          if (prev <= 0) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [status, hasStartedTalking, timeLeft === 0]) // Sync on status, start, or completion

  // Sync Mapping Progress to timeLeft
  // Sync Mapping Progress to timeLeft (based on 60s active window)
  useEffect(() => {
    if (!hasStartedTalking) {
      setMappingProgress(0)
      return
    }
    const elapsed = 90 - timeLeft
    setMappingProgress(Math.min(100, Math.floor((elapsed / 90) * 100)))
  }, [timeLeft, hasStartedTalking])

  // 🔍 Scroll to bottom on transcript update
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [transcripts])



  useEffect(() => {
    if (timeLeft === 0 && status === "connected") {
      router.prefetch("/dashboard")
    }
  }, [timeLeft, status, router])

  const playAudio = async (base64: string) => {
    try {
      setAgentSpeaking(true)
      const audio = new Audio(`data:audio/mp3;base64,${base64}`)
      audio.onended = () => setAgentSpeaking(false)
      await audio.play()
    } catch (error) {
      console.error("Audio playback failed:", error)
      setAgentSpeaking(false)
    }
  }

  const handleEditMessage = (id: string, text: string, index: number) => {
    setEditingMessageId(id)
    setEditingMessageIndex(index)
    setEditValue(text)
  }

  const saveEdit = async (messageId: string) => {
    if (!editValue.trim() || isUpdatingMessage || editingMessageIndex === null || !currentBotId) return
    setIsUpdatingMessage(true)

    try {
      console.log(`[NeuralSync] Updating message at index ${editingMessageIndex} for session ${currentBotId}`)
      
      // The backend now expects the zero-based index of the message in the conversation
      await updateVoiceMessage(currentBotId, editingMessageIndex, editValue.trim())

      // Update local state
      setTranscripts(prev => prev.map((t, idx) =>
        idx === editingMessageIndex ? { ...t, text: editValue.trim() } : t
      ))
      
      setEditingMessageId(null)
      setEditingMessageIndex(null)
      setEditValue("")
    } catch (error: any) {
      console.error("Failed to update message:", error)
      alert(error.message || "Failed to update transcript. Please try again.")
    } finally {
      setIsUpdatingMessage(false)
    }
  }

  const syncTranscripts = async (botId: string, retryCount = 0) => {
    if (!botId || syncingRef.current) return
    setIsSyncing(true)
    syncingRef.current = true
    try {
      console.log(`[NeuralSync] Attempting sync for bot: ${botId} (retry: ${retryCount})`)
      // 🛡️ DONT clear transcripts here. Keep live chat visible until official sync completes.

      console.log(`[NeuralSync] Attempting sync for session: ${botId} (retry: ${retryCount})`)
      // 🛡️ Wait 5 seconds initially to let backend finalize segments (as per user/backend suggestion)
      if (retryCount === 0) await new Promise(r => setTimeout(r, 5000))

      try {
        // 🔬 Attempt 1: Dedicated Voice-Meeting System (System B)
        console.log(`[NeuralSync] [SystemB] Fetching transcripts for ${botId}... (Retry: ${retryCount})`)
        const data = await getVoiceMeetingTranscripts(botId)
        console.log(`[NeuralSync] [SystemB] FULL RESPONSE:`, JSON.stringify(data, null, 2))

        let transcriptList = Array.isArray(data) ? data : (data?.transcripts || data?.data || [])

        if (transcriptList && Array.isArray(transcriptList) && transcriptList.length > 0) {
          console.log(`[NeuralSync] SUCCESS: Captured ${transcriptList.length} items`)

          // Sort by timestamp if available
          const sorted = [...transcriptList].sort((a, b) => {
            const timeA = new Date(a.timestamp || 0).getTime()
            const timeB = new Date(b.timestamp || 0).getTime()
            return timeA - timeB
          })

          setTranscripts(sorted.map((item: any) => {
            const role = (item.role || item.speaker || "").toLowerCase()
            const isUser = ['user', 'customer', 'human', 'caller'].includes(role)
            return {
              speaker: isUser ? 'user' : 'agent',
              text: (item.message || item.content || item.text || "").trim(),
              message_id: item.message_id || item.id
            }
          }))
          setIsSyncing(false)
          syncingRef.current = false
        } else if (retryCount < 8) {
          const delay = 5000
          console.warn(`[NeuralSync] Transcripts not ready or empty. Retrying in ${delay / 1000}s... (Attempt ${retryCount + 1})`)
          // 🛡️ DONT set syncingRef/isSyncing to false yet, we ARE retrying
          setTimeout(() => {
            syncingRef.current = false // Allow retry call to proceed
            syncTranscripts(botId, retryCount + 1)
          }, delay)
        } else {
          setIsSyncing(false)
          syncingRef.current = false
          console.error("[NeuralSync] All sync attempts exhausted.")
        }
      } catch (err: any) {
        const errorMsg = err.message || ""
        console.error(`[NeuralSync] Voice Meeting transcripts fetch failed:`, errorMsg)

        setIsSyncing(false)
        syncingRef.current = false
        if (retryCount < 5) {
          setTimeout(() => syncTranscripts(botId, retryCount + 1), 6000)
        }
      }
    } finally {
      setIsSyncing(false)
      syncingRef.current = false
    }
  }

  const startMeeting = async () => {
    if (status === "connecting") return
    const jid = selectedJob?.job_id || (selectedJob as any)?.id || (selectedJob as any)?.uuid
    if (!currentUserId || !jid) return

    setStatus("connecting")
    setIsInterrupted(false)
    setIsGracefulEnd(false)
    gracefulEndRef.current = false
    setTimeLeft(90) // Always reset timer for fresh extraitction
    try {
      const data = await startVoiceMeetingWithJob({
        job_id: jid,
      })

      if (data.session_id) {
        setCurrentBotId(data.session_id)
        botIdRef.current = data.session_id
      } else {
        // Fallback if session_id is not present, though it should be
        const botId = data.bot_id || data.id
        setCurrentBotId(botId)
        botIdRef.current = botId
      }
      console.log(`[Onboarding] Initializing WebSocket: ${data.websocket_url}`)
      const ws = new WebSocket(data.websocket_url)
      wsRef.current = ws
      ws.onopen = async () => {
        setStatus("connected")
        const userStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setStream(userStream)
        const recorder = new MediaRecorder(userStream)
        recorderRef.current = recorder
        recorder.ondataavailable = (e) => { if (e.data.size) audioChunksRef.current.push(e.data) }
        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
          audioChunksRef.current = []
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64 = reader.result?.toString().split(",")[1]
            if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ event: "audio.input", data: { audio: base64 } }))
          }
          reader.readAsDataURL(blob)
        }
      }
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data)
          if (!msg || !msg.event) return

          if (msg.event === "session_started" || msg.event === "bot_joined" || msg.bot_id) {
            console.log("[Onboarding] Meta Event Detected:", msg)
            const newId = msg.bot_id || msg.session_id || msg.id
            if (newId && newId !== botIdRef.current) {
              console.log(`[Onboarding] 🆔 ID Update: ${botIdRef.current} -> ${newId}`)
              botIdRef.current = newId
              setCurrentBotId(newId)
            }
          }

          if (msg.event === "audio.output" && msg.data?.audio) {
            playAudio(msg.data.audio)
          }
          if (msg.event === "message" && msg.data) {
            // Normalize speaker roles immediately
            const rawType = msg.data.type?.toLowerCase() || ""
            const speakerRole = ['user', 'customer', 'human', 'caller'].includes(rawType) ? "user" : "agent"

            // 🛡️ Deduplication check (Robust: trim and normalize)
            const cleanText = msg.data.text?.trim()
            setTranscripts((p) => {
              const last = p[p.length - 1]
              if (last && last.text.trim() === cleanText && last.speaker === speakerRole) {
                return p
              }
              return [...p, {
                speaker: speakerRole,
                text: msg.data.text,
                message_id: msg.data.message_id || msg.data.id || `local-${Date.now()}-${Math.random()}`
              }]
            })

            // Trigger talking state on first message
            if (!timerStartedRef.current) {
              console.log("[Onboarding] First message received. Payload:", JSON.stringify(msg, null, 2))
              timerStartedRef.current = true
              setHasStartedTalking(true)
            }

            // 🧠 Smart Sync: Parse message for time remaining hints
            const timeMatch = msg.data.text.match(/(\d+)\s*(sec|second)/i)
            if (timeMatch && timeMatch[1]) {
              const newTime = parseInt(timeMatch[1], 10)
              console.log(`[TimerSync] Backend hinted at ${newTime}s remaining. Syncing...`)
              setTimeLeft(newTime)
            }

            // 👋 Goodbye/Completion Detection
            const speakerType = msg.data.type?.toLowerCase()
            const isAgent = speakerType !== "user"

            if (isAgent) {
              const text = msg.data.text.toLowerCase()
              const goodbyePhrases = [
                "thank you", "goodbye", "bye", "see you",
                "session over", "conversation ended",
                "thanks for sharing", "thanks for the meeting",
                "thanks for the conversation"
              ]
              if (goodbyePhrases.some(phrase => text.includes(phrase))) {
                console.log("[Onboarding] Goodbye/Completion detected. Marking as graceful end.")
                setIsGracefulEnd(true)
                gracefulEndRef.current = true
                // Automatically end meeting to trigger sync & review mode
                setTimeout(() => {
                  console.log("[Onboarding] Triggering natural end meeting via goodbye detection")
                  endMeeting(false) // Natural end
                }, 2000)
              }
            }
          }
        } catch (err) {
          console.error("WebSocket message parse error:", err)
        }
      }
      ws.onclose = () => {
        // Only set as interrupted if it wasn't a graceful end and significant time was left
        if (!gracefulEndRef.current && timeLeft > 10 && status === "connected") {
          console.log("[Onboarding] WebSocket closed unexpectedly. Status: interrupted.")
          setIsInterrupted(true)
        } else {
          console.log(`[Onboarding] WebSocket closed. Graceful: ${gracefulEndRef.current}, TimeLeft: ${timeLeft}`)
        }
        setStatus("disconnected")
        setAgentSpeaking(false)
        setStream(null)

        // Use the Ref to ensure we always have the ID even if state is stale
        const activeBotId = botIdRef.current
        if (activeBotId) {
          console.log(`[Onboarding] Starting final transcript sync for: ${activeBotId}`)
          syncTranscripts(activeBotId)
          
          // 🎤 System B Status Verification
          console.log(`[Onboarding] [SystemB] Verifying session finality for: ${activeBotId}`)
          getVoiceMeetingStatus(activeBotId)
            .then(statusData => {
              console.log(`[Onboarding] [SystemB] Session Final Status:`, statusData)
            })
            .catch(err => {
              console.warn(`[Onboarding] [SystemB] Status check failed:`, err.message)
            })
        }
      }
    } catch (error) {
      console.error("Failed to start meeting:", error)
      setStatus("disconnected")
    }
  }

  // Auto-start session if requested via URL
  useEffect(() => {
    const autoStart = searchParams.get("auto_start") === "true"
    if (autoStart && selectedJob && status === "disconnected" && transcripts.length === 0) {
      console.log("[Onboarding] 🚀 Auto-starting session as requested...")
      startMeeting()
    }
  }, [selectedJob, status, transcripts.length, searchParams])

  const endMeeting = async (manual = false) => {
    console.log(`[Onboarding] endMeeting called. Manual: ${manual}, SessionID: ${botIdRef.current}, Status: ${status}`)
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("[Onboarding] Sending end_meeting event via WS")
      wsRef.current.send(JSON.stringify({ event: "end_meeting" }))
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (wsRef.current) {
      console.log("[Onboarding] Closing WebSocket")
      wsRef.current.close()
    }
    
    if (stream) { 
      console.log("[Onboarding] Stopping media tracks")
      stream.getTracks().forEach(track => track.stop())
      setStream(null) 
    }

    // 🧠 Finalize Backend Session ONLY IF MANUAL (User pressed Terminate)
    if (manual && botIdRef.current) {
      console.log(`[Onboarding] EXPLICIT TERMINATION requested for session: ${botIdRef.current}`)
      try {
        const res = await endVoiceMeeting(botIdRef.current)
        console.log("[Onboarding] DELETE session response:", res)
      } catch (err: any) {
        console.warn("[Onboarding] DELETE session failed (expected if already ended):", err.message)
      }
    } else {
      console.log("[Onboarding] Skipping DELETE call for natural/background end")
    }
  }

  const resetSession = () => {
    setStatus("disconnected")
    setIsInterrupted(false)
    setIsGracefulEnd(false)
    gracefulEndRef.current = false
    setHasStartedTalking(false)
    timerStartedRef.current = false
    setTranscripts([])
    setTimeLeft(90)
  }

  const toggleMic = () => {
    if (!recorderRef.current || agentSpeaking) return
    // Allow mic as long as we are connected, even if timer is 0 (grace period)
    if (status !== "connected") return

    if (!isRecording) {
      audioChunksRef.current = []
      recorderRef.current.start()
      setIsRecording(true)
    } else {
      recorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className={cn(
      "min-h-dvh transition-colors duration-500 flex flex-col relative font-sans",
      themeClasses.selection,
      isDarkMode ? "bg-[#161e2e] text-white" : "bg-slate-50 text-slate-900"
    )}>
      {/* Neural Matrix Background Engine */}
      <NeuralMatrixBackground active={isDarkMode} themeColor={theme === "purple" ? "text-purple-500" : "text-blue-500"} />

      {/* Atmos Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={cn(
          "absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[120px]",
          themeClasses.atmosGlow
        )} />
        <div className={cn(
          "absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[120px]",
          isDarkMode ? "bg-indigo-600/[0.05]" : "bg-indigo-400/[0.1]"
        )} />
      </div>

      {/* Header HUD */}
      <header className={cn(
        "relative z-50 w-full h-20 md:h-24 border-b flex items-center justify-between px-6 md:px-8 backdrop-blur-3xl",
        isDarkMode ? "border-white/5 bg-slate-900/40" : "border-slate-200 bg-white/40"
      )}>
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className={cn(
              "p-2.5 rounded-xl border transition-all active:scale-90",
              isDarkMode ? "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20" : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
            )}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="hidden md:flex flex-col">
            <div className="flex items-center gap-2">
              <Zap className={cn("w-3.5 h-3.5 fill-current", themeClasses.text)} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Voice Connection</span>
            </div>
            <span className={cn(
              "text-[10px] uppercase font-bold tracking-widest mt-0.5",
              isDarkMode ? "text-slate-500" : "text-slate-400"
            )}>Session.Active_Beta</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Premium Theme Switcher */}
          <button
            onClick={() => setTheme(isDarkMode ? "light" : "dark")}
            className={cn(
              "relative w-14 h-7 rounded-full p-1 transition-all duration-500 border overflow-hidden",
              isDarkMode ? "bg-slate-800 border-white/10" : "bg-white border-slate-200 shadow-inner"
            )}
          >
            <motion.div
              animate={{ x: isDarkMode ? 28 : 0 }}
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center shadow-sm relative z-10",
                isDarkMode ? (theme === 'purple' ? "bg-purple-600" : "bg-blue-600") + " text-white" : "bg-orange-500 text-white"
              )}
            >
              {isDarkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
            </motion.div>
          </button>

          <div className={cn(
            "hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-full border shadow-lg",
            theme === 'purple'
              ? (isDarkMode ? "bg-purple-500/5 border-purple-500/20 shadow-purple-500/10" : "bg-purple-50 border-purple-100 shadow-purple-500/5")
              : (isDarkMode ? "bg-blue-500/5 border-blue-500/20 shadow-blue-500/10" : "bg-blue-50 border-blue-100 shadow-blue-500/5")
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              status === 'connected' ? "bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" :
                status === 'connecting' ? "bg-amber-500 animate-bounce" : "bg-slate-600"
            )} />
            <span className={cn("text-[10px] uppercase font-black tracking-[0.2em]", themeClasses.textLight)}>
              {status === 'disconnected' ? "Offline" : status}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row relative z-10">
        <AnimatePresence mode="wait">
          {((status === "disconnected" && transcripts.length === 0 && !gracefulEndRef.current && !syncingRef.current && !isSyncing) || isInterrupted) ? (
            <motion.div
              key={isInterrupted ? "interrupted" : "entry"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="relative mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className={cn("absolute inset-[-15px] border border-dashed rounded-full", isInterrupted ? "border-red-500/40" : themeClasses.border)}
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    "w-32 h-32 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-2xl",
                    isInterrupted ? "bg-gradient-to-tr from-red-600 to-orange-600 shadow-red-500/30" : themeClasses.gradient,
                    !isInterrupted && (theme === 'purple' ? "shadow-purple-500/30" : "shadow-blue-500/30")
                  )}
                >
                  {isInterrupted ? <MicOff className="w-16 h-16 text-white" /> : <Bot className="w-16 h-16 text-white" />}
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 max-w-xl"
              >
                <div className={cn("flex items-center justify-center gap-3 mb-2", isInterrupted ? "text-red-500" : themeClasses.text)}>
                  {isInterrupted ? <Zap className="w-4 h-4 animate-pulse" /> : <ShieldCheck className="w-4 h-4" />}
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                    {isInterrupted ? "Connection Interrupted" : selectedJob ? `${selectedJob.role} @ ${selectedJob.company_name}` : "Voice Profile Setup"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                  {isInterrupted ? "Connection \n Interrupted" : "Voice Profile \n Setup"}
                </h1>
                <p className={cn(
                  "font-bold uppercase tracking-widest text-[10px] opacity-60",
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                )}>
                  {isInterrupted
                    ? `The connection was lost with ${timeLeft}s remaining. Please restart the setup.`
                    : selectedJob
                      ? `Vocaris AI will onboard you as ${selectedJob.role} at ${selectedJob.company_name}.`
                      : "Select a job below so the AI knows your onboarding context."}
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-10 w-full max-w-md space-y-5 text-left"
              >
                {!isInterrupted && (
                  <>
                    {/* Job Selection */}
                    <div className="space-y-3">

                      <div className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", themeClasses.textLight)}>
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Select Role for Voice Setup</span>
                      </div>

                      {jobsLoading ? (
                        <div className="flex items-center gap-2 py-3">
                          <Loader2 className={cn("w-4 h-4 animate-spin", themeClasses.text)} />
                          <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Loading jobs...</span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {jobs.map((job) => (
                            <button
                              key={job.job_id}
                              onClick={() => setSelectedJob(selectedJob?.job_id === job.job_id ? null : job)}
                              disabled={!!job.last_session_id}
                              className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wide transition-all",
                                !!job.last_session_id && "opacity-50 cursor-not-allowed",
                                selectedJob?.job_id === job.job_id
                                  ? cn(themeClasses.bg, "text-white border-transparent shadow-lg")
                                  : (isDarkMode ? "bg-white/5 border-white/10 text-slate-300 hover:border-white/20" : "bg-slate-100 border-slate-200 text-slate-600 hover:border-slate-300"),
                                !!job.last_session_id && !isDarkMode && "bg-slate-200 border-slate-300 text-slate-400"
                              )}
                            >
                              {selectedJob?.job_id === job.job_id ? <Check className="w-3 h-3" /> : (!!job.last_session_id ? <ShieldCheck className="w-3 h-3 text-emerald-500" /> : <Building2 className="w-3 h-3" />)}
                              {job.role} @ {job.company_name}
                            </button>
                          ))}

                          {/* Add new job inline */}
                          <button
                            onClick={() => {
                              const willShow = !showNewJobForm
                              setShowNewJobForm(willShow)
                              if (willShow) setSelectedJob(null)
                            }}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wide transition-all",
                              isDarkMode
                                ? "border-dashed border-white/20 text-slate-400 hover:border-white/30 hover:text-slate-200"
                                : "border-dashed border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-600"
                            )}
                          >
                            {showNewJobForm ? <span className="text-base leading-none">✕</span> : <Plus className="w-3 h-3" />}
                            {showNewJobForm ? "Cancel" : "New Job"}
                          </button>
                        </div>
                      )}

                      {/* Inline new job form */}
                      <AnimatePresence>
                        {showNewJobForm && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className={cn(
                              "p-4 rounded-2xl border space-y-3 mt-1",
                              isDarkMode ? "bg-white/[0.03] border-white/10" : "bg-slate-50 border-slate-200"
                            )}>
                              <Input
                                value={newJobForm.company_name}
                                onChange={e => setNewJobForm(f => ({ ...f, company_name: e.target.value }))}
                                placeholder="Company (e.g. Google)"
                                className={cn("h-10 text-sm font-bold rounded-lg", isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200")}
                              />
                              <Input
                                value={newJobForm.role}
                                onChange={e => setNewJobForm(f => ({ ...f, role: e.target.value }))}
                                placeholder="Role (e.g. Software Engineer)"
                                className={cn("h-10 text-sm font-bold rounded-lg", isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200")}
                              />
                              <button
                                onClick={handleCreateJob}
                                disabled={creatingJob || !newJobForm.company_name.trim() || !newJobForm.role.trim()}
                                className={cn(
                                  "w-full h-10 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2",
                                  themeClasses.bg, "text-white"
                                )}
                              >
                                {creatingJob ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-3.5 h-3.5" /> Add Job</>}
                              </button>
                              {jobCreateError && (
                                <p className="text-red-400 text-[11px] font-bold text-center">{jobCreateError}</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={startMeeting}
                    disabled={(isInterrupted ? false : !selectedJob) || status === "connecting"}

                    className={cn(
                      "w-full h-16 text-white font-black text-lg rounded-2xl shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group",
                      isInterrupted ? "bg-red-600 hover:bg-red-500 shadow-red-500/20" : themeClasses.bg,
                      !isInterrupted && themeClasses.bgHover,
                      !isInterrupted && (theme === 'purple' ? "shadow-purple-500/20" : "shadow-blue-500/20")
                    )}
                  >
                    {status === "connecting" ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        {isInterrupted ? "RESTART VOICE SETUP" : "START VOICE SETUP"}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  {isInterrupted && (
                    <button
                      onClick={resetSession}
                      className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors"
                    >
                      START OVER
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col md:flex-row md:h-full"
            >
              {/* Visualizer Left HUD - Responsive Clamped Height */}
              <div className="w-full md:w-[400px] md:h-full p-6 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 bg-slate-900/20 backdrop-blur-md z-20 shrink-0">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", themeClasses.bgAlpha, themeClasses.textLight)}>
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Core Engine</span>
                      <span className="text-sm font-bold uppercase tracking-tight">V-Intel x64</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className={cn("flex justify-between text-[10px] font-black uppercase tracking-widest", themeClasses.textLight)}>
                      <span>Voice Setup Progress</span>
                      <span>{mappingProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${mappingProgress}%` }}
                        className={cn("h-full", themeClasses.bg, theme === 'purple' ? "shadow-[0_0_10px_rgba(168,85,247,0.8)]" : "shadow-[0_0_10px_rgba(59,130,246,0.8)]")}
                      />
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Voice Profile Setup</span>
                      <div
                        className={cn("flex items-center gap-1.5 cursor-pointer", themeClasses.textLight)}
                        onClick={() => { if (status === "connected") endMeeting() }}
                        title={timeLeft === 0 ? "Force Stop Transaction" : "End Session"}
                      >
                        <Loader2 className={cn("w-2 h-2 animate-spin", timeLeft === 0 && "hidden")} />
                        <span className={cn("text-[10px] font-black tabular-nums translate-y-[0.5px]", timeLeft === 0 && "text-red-500 animate-pulse")}>
                          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative flex flex-col items-center justify-center scale-90 md:scale-100">
                  <div className="aspect-square w-full max-w-[180px] md:max-w-[280px] relative flex items-center justify-center">
                    {/* Premium Circular Visualizer Rings */}
                    <motion.div
                      animate={isRecording ? { scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={cn("absolute inset-0 rounded-full border", themeClasses.border)}
                    />
                    <motion.div
                      animate={agentSpeaking ? { scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] } : {}}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="absolute inset-6 rounded-full border border-indigo-500/20"
                    />
                    <AdvancedVisualizer active={isRecording || agentSpeaking} type={isRecording ? 'pulse' : 'wave'} themeColor={theme} />
                  </div>

                  <div className="mt-8 text-center space-y-2">
                    <span className={cn("text-[10px] font-black uppercase tracking-[0.4em] animate-pulse", themeClasses.text)}>
                      {isRecording ? "Listening..." : agentSpeaking ? "Assistant Speaking..." : "Connection Ready"}
                    </span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-50">
                      Capturing high-fidelity voice metrics
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={toggleMic}
                    disabled={agentSpeaking || (timeLeft === 0 && status !== "connected")}
                    className={cn(
                      "w-full h-24 rounded-[2rem] font-black text-xl flex flex-col items-center justify-center gap-2 transition-all shadow-2xl",
                      isRecording
                        ? "bg-red-600 border border-red-400 shadow-[0_0_30_rgba(239,68,68,0.3)] text-white"
                        : (status === "disconnected" && transcripts.length > 0)
                          ? "bg-emerald-600/20 border-emerald-500/30 text-emerald-500 cursor-default"
                          : (timeLeft === 0 && status !== "connected")
                            ? "bg-slate-800 border-white/5 text-slate-500 cursor-not-allowed"
                            : cn(themeClasses.bg, themeClasses.bgHover, "text-white border shadow-lg", theme === 'purple' ? "border-purple-400 shadow-purple-500/20" : "border-blue-400 shadow-blue-500/20")
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                      {(status === "disconnected" && transcripts.length > 0) ? "SETUP COMPLETE" : (timeLeft === 0 && status !== "connected") ? "SETUP ENDED" : isRecording ? "MUTE" : "START TALKING"}
                    </div>
                    <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-70">
                      {(status === "disconnected" && transcripts.length > 0) ? "Voice profile complete" : (timeLeft === 0 && status !== "connected") ? "Voice profile locked" : "Tap to Speak"}
                    </span>
                  </Button>

                  <button
                    onClick={() => {
                      setIsGracefulEnd(true)
                      gracefulEndRef.current = true
                      endMeeting(true)
                    }}
                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-red-400 transition-colors"
                  >
                    TERMINATE SETUP
                  </button>
                </div>
              </div>

              {/* HUD Chat Panels Right */}
              <div className="flex-1 flex flex-col md:h-full">
                <ScrollArea className="flex-1 md:h-full w-full" ref={scrollAreaRef}>
                  <div className="p-6 md:p-10 pt-10 md:pt-20 space-y-8 max-w-3xl mx-auto pb-24 md:pb-40">
                    {isSyncing && transcripts.length === 0 && (
                      <div className="flex flex-col items-center space-y-6 py-20 animate-pulse">
                        <div className="relative">
                          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                          <Cpu className="w-12 h-12 text-purple-400 animate-spin relative z-10" />
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400">Processing Voice...</p>
                          <p className="text-slate-500 text-[8px] uppercase font-bold tracking-widest">Compiling voice identity extraction results...</p>
                        </div>
                      </div>
                    )}
                    {transcripts.length === 0 && !isSyncing && (
                      <div className="flex flex-col items-center space-y-4 opacity-10 py-12">
                        <Network className="w-12 h-12" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Neural Inputs...</span>
                      </div>
                    )}
                    {transcripts.map((t, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: t.speaker === "user" ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex gap-6 ${t.speaker === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xl flex-shrink-0 mt-1",
                          t.speaker === "user"
                            ? (theme === 'purple' ? "bg-purple-600/10 border-purple-500/30 text-purple-400" : "bg-blue-600/10 border-blue-500/30 text-blue-400")
                            : "bg-indigo-600/10 border-indigo-500/30 text-indigo-400"
                        )}>
                          {t.speaker === "user" ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                        </div>
                        <div className={cn(
                          "rounded-[1.5rem] px-6 py-5 border backdrop-blur-xl relative group max-w-[85%]",
                          t.speaker === "user"
                            ? cn("border-white/10 rounded-tr-none", isDarkMode ? "bg-white/[0.03] text-white" : "bg-slate-200/50 text-slate-900 border-slate-300/50")
                            : cn("border-indigo-500/20 rounded-tl-none shadow-lg shadow-indigo-500/5", isDarkMode ? "bg-indigo-500/10 text-slate-100" : "bg-indigo-50 text-indigo-900 border-indigo-200")
                        )}>
                          {/* HUD Decoration Corner */}
                          <div className="absolute top-0 right-0 p-3 flex items-center gap-3">
                            <span className={cn("text-[8px] font-black uppercase tracking-widest opacity-40", isDarkMode ? "text-slate-500" : "text-slate-400")}>
                              {t.speaker === 'user' ? 'RX_DATA' : 'TX_DATA'}
                            </span>
                            {t.speaker === 'user' && t.message_id && !editingMessageId && (
                              <button
                                onClick={() => {
                                  // Always allow editing UI to open immediately
                                  handleEditMessage(t.message_id!, t.text, idx)
                                  // Trigger background sync if it's a local ID for future-proofing
                                  if (t.message_id?.startsWith('local-') && currentBotId) {
                                    syncTranscripts(currentBotId)
                                  }
                                }}
                                className={cn(
                                  "group/edit p-1.5 rounded-lg border transition-all",
                                  t.message_id.startsWith('local-')
                                    ? "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                                    : (isDarkMode ? "bg-white/5 border-white/10 hover:bg-purple-500/20 hover:border-purple-500/30 text-purple-400" : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-500")
                                )}
                                title={t.message_id.startsWith('local-') ? "Correcting (Neural Sync Active)" : "Correct Transcript"}
                              >
                                {t.message_id.startsWith('local-') && isSyncing ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : <Edit2 className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>

                          {editingMessageId === t.message_id || (editingMessageIndex === idx && t.message_id?.startsWith('local-')) ? (
                            <div className="space-y-3">
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className={cn(
                                  "w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm md:text-base font-medium outline-none focus:ring-1",
                                  theme === 'purple' ? "focus:ring-purple-500" : "focus:ring-blue-500"
                                )}
                                rows={3}
                                autoFocus
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingMessageId(null)}
                                  className="h-8 text-[10px] font-black uppercase tracking-widest text-slate-500"
                                >
                                  <RotateCcw className="w-3 h-3 mr-2" />
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  disabled={isUpdatingMessage}
                                  onClick={() => saveEdit(t.message_id!)}
                                  className={cn("h-8 text-[10px] font-black uppercase tracking-widest text-white shadow-lg", themeClasses.bg)}
                                >
                                  {isUpdatingMessage ? (
                                    <Loader2 className="w-3 h-3 animate-spin mr-2" />
                                  ) : (
                                    <Save className="w-3 h-3 mr-2" />
                                  )}
                                  {isUpdatingMessage && editingMessageId?.startsWith('local-') ? "Resolving Neural ID..." : "Save Correction"}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm md:text-base font-medium leading-relaxed">
                              {t.text}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {agentSpeaking && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                          <Bot className="w-6 h-6" />
                        </div>
                        <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl px-6 py-4 flex gap-2 items-center h-12">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse [animation-delay:0.4s]" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>

                {/* Bottom Floating Header for Mobile / Tablet */}
                {!(status === "disconnected" && transcripts.length > 0) && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 py-2 px-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl opacity-40">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em]">Live_Stream.v7</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Finishing Action - Shows review guidance before finalizing */}
      <AnimatePresence>
        {status === "disconnected" && transcripts.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 left-0 right-0 p-3 md:p-10 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-50 flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-8 border-t border-white/5 backdrop-blur-sm"
          >
            <div className="flex flex-col gap-1 md:gap-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-1.5 md:gap-3 text-emerald-500">
                <ShieldCheck className="w-3 h-3 md:w-5 md:h-5" />
                <span className="text-[7px] md:text-xs font-black uppercase tracking-[0.3em]">Review Mode Active</span>
                {selectedJob && (
                  <div className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[6px] md:text-[9px] font-black uppercase tracking-widest">
                    {selectedJob.role} @ {selectedJob.company_name}
                  </div>
                )}
                {currentBotId && (
                  <button
                    onClick={() => syncTranscripts(currentBotId)}
                    disabled={isSyncing}
                    className="ml-auto md:ml-4 px-1.5 py-0.5 text-[6px] md:text-[8px] font-black bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-all uppercase tracking-widest flex items-center gap-1"
                  >
                    {isSyncing ? <Loader2 className="w-2 h-2 animate-spin" /> : <RotateCcw className="w-2 h-2" />}
                    {isSyncing ? "Syncing..." : "Force Resync"}
                  </button>
                )}
              </div>
              <h2 className="text-xs md:text-2xl font-black text-white uppercase tracking-tight">
                {isSyncing ? "Saving Profile..." : transcripts.length > 0 ? "Review & Finish" : "Awaiting Data..."}
              </h2>
              <p className="text-[8px] md:text-sm text-slate-400 font-medium leading-relaxed">
                {isSyncing 
                  ? "Saving your voice profile. Please wait."
                  : transcripts.length > 0 
                    ? "Extraction successful. Review and correct any terms." 
                    : "Processing data. Try Force Resync if needed."}
              </p>
            </div>

            <div className="flex flex-row md:flex-col lg:flex-row items-center gap-2 md:gap-4 w-full lg:w-auto">
              <button
                onClick={() => router.push("/onboarding-jobs")}
                className="flex-1 lg:flex-none h-10 md:h-14 px-4 md:px-8 text-slate-400 font-black rounded-xl md:rounded-2xl border border-white/10 hover:bg-white/5 transition-all uppercase text-[7px] md:text-[10px] tracking-widest"
              >
                Return to Jobs
              </button>
              
              <button
                onClick={async () => {
                  await endMeeting(true)
                  router.push("/dashboard")
                }}
                disabled={isSyncing}
                className={cn(
                  "flex-[2] lg:flex-none h-12 md:h-20 px-6 md:px-12 text-white font-black rounded-full shadow-lg flex items-center justify-center gap-2 md:gap-4 border transition-all active:scale-95 group shrink-0",
                  isSyncing ? "bg-slate-700 border-slate-600 opacity-50 cursor-wait" : "bg-green-600 hover:bg-green-500 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                )}
              >
                {isSyncing ? <Loader2 className="w-4 h-4 md:w-6 md:h-6 animate-spin" /> : <Sparkles className="w-4 h-4 md:w-6 md:h-6 animate-pulse" />}
                <span className="text-[9px] md:text-base">{isSyncing ? "FINALIZING..." : "FINALIZE PROFILE"}</span>
                {!isSyncing && <ArrowRight className="w-3.5 h-3.5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AdvancedVisualizer({ active, type, themeColor }: { active: boolean; type: 'pulse' | 'wave'; themeColor: 'purple' | 'blue' }) {
  const isPurple = themeColor === 'purple'
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Core Circle */}
      <motion.div
        animate={active ? { scale: [1, 1.15, 1], opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
        className={cn(
          "w-32 h-32 rounded-full border-4 flex items-center justify-center relative",
          type === 'pulse' ? "border-red-500/40" : (isPurple ? "border-purple-500/40" : "border-blue-500/40")
        )}
      >
        <div className={cn(
          "w-24 h-24 rounded-full bg-gradient-to-tr opacity-20 blur-xl",
          type === 'pulse' ? "from-red-600 to-orange-600" : (isPurple ? "from-purple-600 to-indigo-600" : "from-blue-600 to-indigo-600")
        )} />
        <Waves className={cn("w-12 h-12 relative z-10", type === 'pulse' ? "text-red-400" : (isPurple ? "text-purple-400" : "text-blue-400"))} />
      </motion.div>

      {/* Orbiting Elements */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 5 + i * 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className={cn(
            "w-2 h-2 rounded-full absolute top-0 left-1/2 -translate-x-1/2",
            type === 'pulse' ? "bg-red-400 shadow-[0_0_10px_red]" : (isPurple ? "bg-purple-400 shadow-[0_0_10px_purple]" : "bg-blue-400 shadow-[0_0_10px_blue]")
          )} />
        </motion.div>
      ))}
    </div>
  )
}

function NeuralMatrixBackground({ active, themeColor }: { active: boolean; themeColor: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Grid Pattern */}
      <svg className={cn(
        "absolute inset-0 w-full h-full",
        active ? "opacity-[0.08]" : "opacity-[0.03]"
      )}>
        <pattern id="matrix-conversation" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="currentColor" className={themeColor} />
          <line x1="2" y1="2" x2="80" y2="2" stroke="currentColor" strokeWidth="0.5" className={themeColor + "/20"} />
        </pattern>
        <rect width="100%" height="100%" fill="url(#matrix-conversation)" />
      </svg>

      {/* Matrix Data Lines */}
      <div className="absolute inset-0 opacity-[0.04]">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 10 + i * 4, repeat: Infinity, ease: "linear" }}
            className={cn("absolute w-px h-full bg-gradient-to-b from-transparent to-transparent", themeColor.includes('purple') ? "via-purple-500" : "via-blue-500")}
            style={{ left: `${20 + i * 15}%` }}
          />
        ))}
      </div>
    </div>
  )
}
