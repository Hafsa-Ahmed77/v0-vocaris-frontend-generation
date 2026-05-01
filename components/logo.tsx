"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
    className?: string
    iconOnly?: boolean
    variant?: "default" | "white"
}

export function Logo({
    className,
    iconOnly = false,
    variant = "default",
}: LogoProps) {
    const gradId = "vocaris-v-grad-" + variant

    return (
        <div className={cn("flex items-center gap-2.5 cursor-pointer group", className)}>
            {/* Highly polished, vibrant SVG Logo Mark */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-[0_4px_15px_rgba(30,58,138,0.08)] border border-blue-50 group-hover:shadow-[0_8px_25px_rgba(30,58,138,0.15)] group-hover:scale-105 transition-all duration-300">
                <svg
                    viewBox="0 0 100 100"
                    className="w-6 h-6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {variant === "white" ? (
                            <linearGradient id={gradId} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#FFFFFF" />
                                <stop offset="1" stopColor="#E2E8F0" />
                            </linearGradient>
                        ) : (
                            <linearGradient id={gradId} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#2563EB" /> {/* Blue 600 */}
                                <stop offset="1" stopColor="#0EA5E9" /> {/* Sky 500 */}
                            </linearGradient>
                        )}
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Left Wing */}
                    <path
                        d="M20 15 L42 85 L58 85 L36 15 Z"
                        fill={`url(#${gradId})`}
                        opacity="0.9"
                    />
                    
                    {/* Right Wing (Overlapping) */}
                    <path
                        d="M80 15 L50 95 L35 95 L65 15 Z"
                        fill={`url(#${gradId})`}
                        filter="url(#glow)"
                    />
                    
                    {/* Center Accent Dot */}
                    <circle cx="50" cy="25" r="5" fill="#1E3A8A" opacity={variant === "white" ? 0.5 : 1} />
                </svg>
            </div>

            {!iconOnly && (
                <span className={cn(
                    "font-black text-2xl tracking-tighter select-none transition-colors font-outfit",
                    variant === "white"
                        ? "text-white"
                        : "text-[#0A192F] group-hover:text-[#1E3A8A]"
                )}>
                    Vocaris
                </span>
            )}
        </div>
    )
}
