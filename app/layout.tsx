import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Vocaris – Your Intelligent Meeting Partner",
  description:
    "Seamless conversation and smart collaboration with AI-powered meeting participation, analysis, and reporting.",
  generator: "v0.app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL("https://vocaris.app"),
  verification: {
    google: "vncJkST-1utdpyLd0wEXg3uiEdbmD3n1nhEYMy7itqQ",
  },  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans bg-background text-foreground">
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Analytics />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
