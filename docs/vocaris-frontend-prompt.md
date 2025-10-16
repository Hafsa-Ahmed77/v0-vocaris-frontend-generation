# Vocaris Frontend – UI Plan and Routing

- Tech: Next.js App Router, TypeScript, TailwindCSS (ShadCN UI), Framer Motion, lucide-react, SWR.
- Fonts: Inter (sans) and JetBrains Mono (mono) via next/font. Configured in layout.tsx and globals.css tokens.
- Brand Palette (3-5 colors):
  - Primary: Deep Blue (#1D3557)
  - Accent: Electric Cyan (#00B4D8)
  - Background: Soft Gray (#F5F7FA)
  - Foreground ink: neutral oklab dark ink
- Theme: Light/Dark with next-themes; ThemeToggle in topbar and landing header.

## Routing Structure

- /                   → Landing (marketing): hero, features, testimonials, footer
- /auth               → Authentication page (Google OAuth placeholder)
- /onboarding         → Multi-step onboarding with progress
- /(app)/layout       → App shell (Sidebar + Topbar)
- /dashboard          → Overview cards, AI participation chart, upcoming meetings, summaries table + RAG widget
- /meetings/[id]      → Transcript, summarized collapsibles, meeting-scoped chat
- /scrum              → Daily update form, preview, "Send to Slack/ClickUp" placeholders
- /chatbot            → Full page chat widget (RAG placeholder)
- /settings           → Tabs: Account, Integrations, Privacy
- not-found.tsx, error.tsx, loading.tsx as needed

## Components

- Layout: components/layout/{sidebar,topbar}, components/theme-{provider,toggle}
- Landing: components/site-{header,footer}
- Dashboard: components/dashboard/{overview-cards,upcoming-meetings,meeting-summaries-table}
- Chat: components/chat/{rag-chat-widget,meeting-chat}
- Placeholder data: lib/placeholders/api.ts (swap with real APIs: Google Calendar, Slack, ClickUp, Supabase, LiveKit)

## UX & Accessibility

- Responsive grid/flex; rounded-2xl, soft shadows; focus-visible states via ShadCN defaults.
- Animation: Framer Motion fades for hero/onboarding; keep subtle for performance.
- Empty/loading: Skeletons on dashboard and meetings; toasts for actions.

## Integration Placeholders

- Add OAuth/Supabase in /auth
- Google Calendar → getUpcomingMeetings
- LiveKit/Recording → meetings/ transcript area
- Slack/ClickUp → /scrum actions
- RAG/Knowledge → chat widgets
