export async function getOverviewMetrics() {
  await sleep(350)
  return {
    totalMeetings: 128,
    aiParticipationRate: 76,
    avgResponseTime: "1m 42s",
    actionItemsThisWeek: 14,
  }
}

export const aiParticipationData = [
  { date: "Mon", score: 62 },
  { date: "Tue", score: 68 },
  { date: "Wed", score: 72 },
  { date: "Thu", score: 75 },
  { date: "Fri", score: 78 },
]

export async function getUpcomingMeetings() {
  await sleep(400)
  return [
    { id: "101", title: "Sprint Planning", time: "Today 3:00 PM", with: "Core team" },
    { id: "102", title: "Customer Review", time: "Tue 10:00 AM", with: "Acme" },
    { id: "103", title: "Design Sync", time: "Thu 2:30 PM", with: "UX team" },
  ]
}

export async function getMeetingSummaries() {
  await sleep(480)
  return [
    {
      id: "201",
      title: "Q3 Strategy",
      date: "Oct 1",
      summary: "Aligned on KPIs, defined risk mitigation, action owners assigned.",
    },
    {
      id: "202",
      title: "Release Go/No-Go",
      date: "Oct 5",
      summary: "Go decision with minor fixes. Post-release monitoring plan set.",
    },
  ]
}

export async function getMeetingDetails(id: string) {
  await sleep(500)
  return {
    id,
    title: "Sprint Planning – Oct 8",
    date: "Oct 8 · 60 min",
    participants: ["Alex", "Priya", "Sam"],
    transcript: [
      { time: "00:12", speaker: "Alex", text: "Welcome, let’s review backlog and capacity." },
      { time: "02:01", speaker: "Priya", text: "We have 28 story points available." },
      { time: "08:45", speaker: "Sam", text: "Suggest focusing on auth improvements first." },
    ],
    summaries: [
      { title: "Key Decisions", points: ["Auth improvements prioritized", "API error budgets adjusted"] },
      { title: "Risks", points: ["Integration timelines tight", "Testing resources limited"] },
      { title: "Action Items", points: ["Sam to create auth tasks", "Priya to refine estimates"] },
    ],
  }
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}
