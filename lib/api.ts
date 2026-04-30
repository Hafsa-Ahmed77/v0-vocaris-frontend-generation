// lib/api.ts
import { clearAuthCookie } from "./auth-cookies"

// lib/api.ts
/**
 * Helper to get a cookie value by name on the client side.
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

/**
 * Global API fetch wrapper with automatic auth header injection
 * and global 401 (Unauthorized) handling.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  let token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // 💊 Token Healing: If localStorage is empty but cookie exists, sync it.
  if (!token && typeof window !== "undefined") {
    token = getCookie("vocaris_token")
    if (token) {
      console.log("[Auth] Healing session from cookie...")
      localStorage.setItem("token", token)
    }
  }

  // Normalize path to prevent double/triple slashes
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const fullPath = `/api${normalizedPath}`.replace(/\/+/g, "/")

  const res = await fetch(fullPath, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  // Global 401 Handling: If unauthorized, clear local session and redirect to login
  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    clearAuthCookie()
    window.location.href = "/auth"
    throw new Error("Session expired. Please login again.")
  }

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "API request failed")
  }

  const contentType = res.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return res.json()
  }

  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/**
 * Verifies the current user's token against the backend.
 * Returns true if valid, false if expired/invalid.
 */
export async function verifyToken(): Promise<boolean> {
  if (typeof window === "undefined") return true
  
  let token = localStorage.getItem("token")

  // 🛡️ Cookie Recovery: If localStorage is lost (Safari/Cache clear), try the cookie.
  if (!token) {
    token = getCookie("vocaris_token")
    if (token) {
      console.log("[Auth] Token found in cookies. Restoring LocalStorage...")
      localStorage.setItem("token", token)
    }
  }

  if (!token) return false

  try {
    const res = await fetch("/api/auth-verify", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.status === 401) return false

    const data = await res.json().catch(() => ({ valid: true }))
    return data.valid === true
  } catch (err) {
    console.error("Token verification failed:", err)
    // Network failure — assume valid to avoid aggressive logout
    return true
  }
}

/**
 * Unified Onboarding Status Check.
 * Strict Logic: Returns true ONLY if the user has at least one Job
 * AND that job has at least one completed Voice Onboarding session.
 */
export async function checkOnboardingStatus(): Promise<boolean> {
  try {
    const jobsData = await getUserJobs().catch(() => ({ jobs: [] }))
    const jobs = Array.isArray(jobsData) ? jobsData : (jobsData?.jobs || [])

    if (jobs.length === 0) return false

    // Check if any of these jobs have an associated onboarding session
    // We do this by checking job details for each job
    const jobSyncStatuses = await Promise.all(
      jobs.map(async (job: any) => {
        try {
          const details = await getJobDetails(job.job_id || job.id || job.uuid)
          const sessions =
            details?.conversation_sessions ||
            details?.voice_sessions ||
            details?.onboarding_sessions ||
            details?.sessions ||
            details?.voice_meeting_sessions ||
            []
          return sessions.length > 0
        } catch {
          return false
        }
      })
    )

    return jobSyncStatuses.some((status) => status === true)
  } catch (err) {
    console.error("Failed to check onboarding status:", err)
    return false
  }
}

/**
 * Utility to parse JWT token without external libraries.
 * Useful for checking 'exp' claim locally.
 */
export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

/**
 * Logs out the current user.
 * Calls backend logout endpoint (for audit/logging) then clears all local auth data.
 */
export async function logout(): Promise<void> {
  if (typeof window === "undefined") return
  const token = localStorage.getItem("token")

  try {
    // Notify backend (fire and forget — we clear locally regardless)
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  } catch {
    // Backend unreachable — still log out locally
  } finally {
    // Always clear local storage and cookies
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    clearAuthCookie()
  }
}

// Get Auth Configuration
export function getAuthConfig() {
  return apiFetch("/auth/config")
}


/* =========================
   DASHBOARD RELATED CALLS
========================= */

// Upcoming meetings (calendar)
export function getUpcomingMeetings() {
  return apiFetch("/calendar/events")
}

// Past meetings / summaries
// Past meetings / summaries
export function getMeetingHistory(limit = 50, offset = 0) {
  // backend allow max 100
  const clampedLimit = Math.min(limit, 100)
  return apiFetch(`/meeting-history?limit=${clampedLimit}&offset=${offset}`)
}


// Status of a specific bot session
export function getMeetingStatus(botId: string) {
  return apiFetch(`/meeting-status?bot_id=${botId}`)
}

/**
 * End All Meetings: Bulk terminate all active bots for the current user.
 */
export async function endAllMeetings() {
  return apiFetch(`/meeting-end-all`, {
    method: "POST",
  })
}

// Stats / analytics
export function getMeetingStats() {
  return apiFetch("/meeting-stats")
}
// Get scheduled meetings (auto-join eligible)
export function getScheduledMeetings() {
  return apiFetch("/calendar/auto-join/scheduled")
}
// Enable auto join for a calendar event
export function enableAutoJoin(eventId: string, isScrum = false) {
  return apiFetch("/calendar/auto-join/enable", {
    method: "POST",
    body: JSON.stringify({
      event_id: eventId,
      is_scrum: isScrum,
    }),
  })
}
// Disable auto join for a calendar event
export function disableAutoJoin(eventId: string) {
  return apiFetch(`/calendar/auto-join/disable/${eventId}`, {
    method: "POST",
  })
}

// Start a meeting manually
export function startMeeting(meetingUrl: string, isScrum = false, title?: string, jobId?: string) {
  return apiFetch("/start-meeting", {
    method: "POST",
    body: JSON.stringify({
      meeting_url: meetingUrl,
      is_scrum: isScrum,
      meeting_title: title,
      job_id: jobId
    }),
  })
}

// Get general meeting transcripts / tickets (System A)
export function getMeetingTranscripts(botId: string, mode = "simple", autoProcess = true) {
  return apiFetch(`/meeting-transcripts/${botId}?mode=${mode}&auto_process=${autoProcess}`)
}

/**
 * Query Meeting Transcript: Standardized RAG query for a specific bot.
 */
export async function queryMeetingTranscript(botId: string, query: string, topK: number = 5) {
  return apiFetch(`/meeting-transcripts/${botId}/query`, {
    method: "POST",
    body: JSON.stringify({
      query,
      top_k: topK,
      include_sources: true
    }),
  })
}

// Get Voice Meeting (Onboarding) specific transcripts (System B)
export function getVoiceMeetingTranscripts(sessionId: string) {
  return apiFetch(`/voice-meeting/transcripts/${sessionId}`)
}

// Get Voice Meeting (Onboarding) status (System B)
export function getVoiceMeetingStatus(sessionId: string) {
  return apiFetch(`/voice-meeting/status/${sessionId}`)
}

// End a general meeting session (System A)
export function endMeeting(botId: string) {
  return apiFetch(`/end-meeting?bot_id=${botId}`, {
    method: "POST",
  })
}

// End a Voice Meeting (Onboarding) session (System B)
export function endVoiceMeeting(sessionId: string) {
  return apiFetch(`/voice-meeting/${sessionId}`, {
    method: "DELETE",
  })
}

// Get all sessions for the authenticated user
export function getUserSessions() {
  return apiFetch("/meeting-sessions")
}

// Get the current user profile
export function getCurrentUser() {
  return apiFetch("/auth/me")
}

/* =========================
   CLICKUP INTEGRATION
========================= */

// Get ClickUp workspace hierarchy
export function getClickUpWorkspace(token: string) {
  return apiFetch(`/clickup/workspace?token=${token}`)
}

// Create a ClickUp task
export function createClickUpTask(data: {
  list_id: string
  token: string
  title: string
  description?: string
  priority?: number
  assignees?: string[]
}) {
  return apiFetch("/clickup/task", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/* =========================
   VOICE MEETING - JOBS
========================= */

// Create a new job for a user
export function createJob(params: {
  company_name: string
  role: string
  description?: string
}) {
  const query = new URLSearchParams({
    company_name: params.company_name,
    role: params.role,
    ...(params.description ? { description: params.description } : {}),
  }).toString()
  return apiFetch(`/voice-meeting/jobs/create?${query}`, { method: "POST" })
}

// Get all jobs for the currently authenticated user
export function getUserJobs() {
  return apiFetch(`/voice-meeting/jobs/mine`)
}

// Get specific job details
export function getJobDetails(jobId: string) {
  return apiFetch(`/voice-meeting/jobs/${jobId}`)
}

// Update a job
export function updateJob(jobId: string, params: { company_name?: string, role?: string, description?: string }) {
  return apiFetch(`/voice-meeting/jobs/${jobId}`, {
    method: "PATCH",
    body: JSON.stringify(params),
  })
}

// Delete a job
export function deleteJob(jobId: string) {
  return apiFetch(`/voice-meeting/jobs/${jobId}`, {
    method: "DELETE",
  })
}

// Start a voice meeting with a specific job context
export function startVoiceMeetingWithJob(params: {
  job_id: string
}) {
  const query = new URLSearchParams({
    job_id: params.job_id,
  }).toString()
  return apiFetch(`/voice-meeting/ws/start-with-job?${query}`, { method: "POST" })
}


// Update (correct) a voice message transcript (Session B)
export function updateVoiceMessage(sessionId: string, messageIndex: number, message: string) {
  return apiFetch(`/voice-meeting/sessions/${sessionId}/messages/${messageIndex}`, {
    method: "PATCH",
    body: JSON.stringify({ new_message: message }),
  })
}

