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


// Active meeting (if any)
export function getActiveMeeting() {
  return apiFetch("/meeting-active")
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
