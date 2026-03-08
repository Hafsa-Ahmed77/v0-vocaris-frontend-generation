// lib/api.ts

// lib/api.ts
export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "API request failed")
  }

  return res.json()
}

/**
 * Verifies the current user's token against the backend.
 * Returns true if valid (or if backend is unreachable — graceful degradation).
 * Returns false only if the backend explicitly says the token is invalid/expired.
 */
export async function verifyToken(): Promise<boolean> {
  if (typeof window === "undefined") return true
  const token = localStorage.getItem("token")
  if (!token) return false

  try {
    const res = await fetch("/api/auth-verify", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json().catch(() => ({ valid: true }))

    // skipped means backend was unreachable — don't log the user out
    if (data.skipped) return true

    return data.valid === true
  } catch {
    // Network failure — don't log user out
    return true
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
    // Always clear local storage
    localStorage.removeItem("token")
    localStorage.removeItem("user")
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
export function startMeeting(meetingUrl: string, isScrum = false, title?: string) {
  return apiFetch("/start-meeting", {
    method: "POST",
    body: JSON.stringify({
      meeting_url: meetingUrl,
      is_scrum: isScrum,
      meeting_title: title
    }),
  })
}

// Get meeting transcripts / tickets
export function getMeetingTranscripts(botId: string, mode = "simple") {
  return apiFetch(`/meeting-transcripts?bot_id=${botId}&mode=${mode}`)
}

// End a specific meeting
export function endMeeting(botId: string) {
  return apiFetch(`/end-meeting?bot_id=${botId}`, {
    method: "POST",
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
