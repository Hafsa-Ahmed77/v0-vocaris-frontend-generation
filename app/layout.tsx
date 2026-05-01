import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Plus_Jakarta_Sans, Outfit } from "next/font/google"
import { Suspense } from "react"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Vocaris — Your AI Digital Twin for Meetings",
  description:
    "Vocaris is an AI-powered meeting agent that attends Google Meet on your behalf. It learns how you speak, thinks like you, and responds as you — so you're free to focus on what matters.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL("https://vocaris.app"),
  verification: {
    google: "vncJkST-1utdpyLd0wEXg3uiEdbmD3n1nhEYMy7itqQ",
  },
  openGraph: {
    title: "Vocaris — Your AI Digital Twin for Meetings",
    description: "An AI agent that attends meetings for you. It learns your voice, mimics your thinking, and speaks on your behalf.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Removed the 'dark' class from html
  return (
    <html lang="en" className={`${jakarta.variable} ${outfit.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans bg-[#FAFBFC] text-[#0A192F]" suppressHydrationWarning>
        <Suspense fallback={null}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
