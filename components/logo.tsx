"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LogoProps {
    className?: string
    iconOnly?: boolean
    variant?: "default" | "white" | "gradient"
    concept?: "intel-core" | "neural-nexus" | "conv-sphere" | "vocaris-minimal"
}

export function Logo({
    className,
    iconOnly = false,
    variant = "default",
    concept = "intel-core"
}: LogoProps) {

    const renderIcon = () => {
        switch (concept) {
            case "intel-core":
                return (
                    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full">
                        {/* Central Intelligence Node */}
                        <motion.path
                            d="M20 12C16 12 13 15 13 19C13 23 16 26 20 26C24 26 27 23 27 19C27 15 24 12 20 12Z"
                            fill="url(#grad-intel)" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        />
                        {/* Inner Radiating Wave */}
                        <motion.path
                            d="M20 8C14 8 9 13 9 20C9 27 14 32 20 32C26 32 31 27 31 20"
                            stroke="url(#grad-intel)" strokeWidth="1.5" strokeDasharray="2 4"
                            animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Outer Expansion Wave */}
                        <motion.path
                            d="M20 35C11.7157 35 5 28.2843 5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20"
                            stroke="url(#grad-intel)" strokeWidth="2" strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: [0, 1, 0], opacity: [0, 0.4, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <defs>
                            <linearGradient id="grad-intel" x1="5" y1="5" x2="35" y2="35">
                                <stop stopColor="#3B82F6" />
                                <stop offset="1" stopColor="#818CF8" />
                            </linearGradient>
                        </defs>
                    </svg>
                )
            case "neural-nexus":
                return (
                    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full">
                        {/* Interconnected Nodes forming a V */}
                        <motion.circle cx="10" cy="10" r="2" fill="url(#grad-nexus)" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                        <motion.circle cx="20" cy="30" r="2" fill="url(#grad-nexus)" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
                        <motion.circle cx="30" cy="10" r="2" fill="url(#grad-nexus)" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />

                        <motion.path
                            d="M10 10L20 30L30 10"
                            stroke="url(#grad-nexus)" strokeWidth="3" strokeLinecap="round"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
                        />
                        <defs><linearGradient id="grad-nexus" x1="10" y1="10" x2="30" y2="30"><stop stopColor="#3B82F6" /><stop offset="1" stopColor="#22D3EE" /></linearGradient></defs>
                    </svg>
                )
            case "conv-sphere":
                return (
                    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full">
                        {/* Two Speech Bubbles Intersecting */}
                        <motion.path
                            d="M12 20C12 14.4772 16.4772 10 22 10C27.5228 10 32 14.4772 32 20C32 25.5228 27.5228 30 22 30"
                            stroke="url(#grad-sphere)" strokeWidth="3" strokeLinecap="round"
                        />
                        <motion.path
                            d="M28 20C28 25.5228 23.5228 30 18 30C12.4772 30 8 25.5228 8 20C8 14.4772 12.4772 10 18 10"
                            stroke="url(#grad-sphere)" strokeWidth="3" strokeLinecap="round"
                            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }}
                        />
                        <motion.circle cx="20" cy="20" r="3" fill="url(#grad-sphere)" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                        <defs><linearGradient id="grad-sphere" x1="8" y1="10" x2="32" y2="30"><stop stopColor="#6366F1" /><stop offset="1" stopColor="#A855F7" /></linearGradient></defs>
                    </svg>
                )
            case "vocaris-minimal":
                return (
                    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full">
                        <motion.path
                            d="M10 15V25M15 10V30M20 15V25M25 10V30M30 15V25"
                            stroke="url(#grad-min)" strokeWidth="3" strokeLinecap="round"
                            animate={{ height: [10, 25, 10], y: [0, -5, 0] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <defs><linearGradient id="grad-min" x1="10" y1="10" x2="30" y2="30"><stop stopColor="#0EA5E9" /><stop offset="1" stopColor="#2DD4BF" /></linearGradient></defs>
                    </svg>
                )
            default:
                return null
        }
    }

    return (
        <div className={cn("flex items-center gap-2 group cursor-pointer", className)}>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex h-10 w-10 items-center justify-center shrink-0"
            >
                {renderIcon()}
                <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            {!iconOnly && (
                <span className={cn(
                    "font-black text-xl tracking-tighter uppercase italic select-none",
                    variant === "white" ? "text-white" : "text-slate-900 dark:text-white"
                )}>
                    Vocaris
                </span>
            )}
        </div>
    )
}
