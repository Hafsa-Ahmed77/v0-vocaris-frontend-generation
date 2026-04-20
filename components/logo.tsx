"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LogoProps {
    className?: string
    iconOnly?: boolean
    variant?: "default" | "white" | "gradient"
}

export function Logo({
    className,
    iconOnly = false,
    variant = "default",
}: LogoProps) {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isDark = mounted ? resolvedTheme === "dark" : true
    const gradId = "vocaris-v-grad"

    return (
        <div className={cn("flex items-center gap-2 cursor-pointer group", className)}>
            <svg
                viewBox="0 0 200 175"
                className="h-8 w-8 shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {variant === "white" ? (
                        <linearGradient id={gradId}>
                            <stop stopColor="#FFFFFF" />
                        </linearGradient>
                    ) : isDark ? (
                        /* Dark mode: cyan → indigo (matches app accent palette) */
                        <linearGradient id={gradId} x1="0" y1="0" x2="200" y2="175" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#22D3EE" />
                            <stop offset="1" stopColor="#818CF8" />
                        </linearGradient>
                    ) : (
                        /* Light mode: indigo-900 → blue-800 */
                        <linearGradient id={gradId} x1="0" y1="0" x2="200" y2="175" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#1e1b4b" />
                            <stop offset="1" stopColor="#1e40af" />
                        </linearGradient>
                    )}
                </defs>

                {/* V shape — evenodd punches a hole for the hollow effect */}
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M 0,0 L 38,0 L 100,158 L 162,0 L 200,0 L 100,175 Z M 23,0 L 100,144 L 177,0 L 162,0 L 100,127 L 38,0 Z"
                    fill={`url(#${gradId})`}
                />

                {/* Two diagonal accent lines inside the right arm */}
                <line x1="137" y1="3" x2="164" y2="55" stroke={`url(#${gradId})`} strokeWidth="6" strokeLinecap="round" />
                <line x1="150" y1="3" x2="181" y2="61" stroke={`url(#${gradId})`} strokeWidth="6" strokeLinecap="round" />
            </svg>

            {!iconOnly && (
                <span className={cn(
                    "font-black text-xl tracking-tighter uppercase italic select-none transition-colors",
                    variant === "white"
                        ? "text-white"
                        : isDark
                            ? "bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent"
                            : "bg-gradient-to-r from-indigo-900 to-blue-800 bg-clip-text text-transparent"
                )}>
                    Vocaris
                </span>
            )}
        </div>
    )
}
