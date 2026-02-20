"use client"

import { LayoutGrid, Calendar, FileText, User, Plus } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function BottomNav() {
    const router = useRouter()
    const pathname = usePathname()

    const navItems = [
        { icon: LayoutGrid, label: "Home", href: "/dashboard" },
        { icon: Calendar, label: "Agenda", href: "/agenda" },
        { icon: null, label: "", href: "" }, // Placeholder for the middle button
        { icon: FileText, label: "Files", href: "/files" },
        { icon: User, label: "Profile", href: "/profile" },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:hidden">
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-4 shadow-2xl flex items-center justify-between">
                {navItems.map((item, index) => {
                    if (index === 2) {
                        return (
                            <button
                                key="add"
                                onClick={() => router.push("/start-meeting")}
                                className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-600 rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center text-white ring-8 ring-slate-50 active:scale-90 transition-all"
                            >
                                <Plus className="w-8 h-8" />
                            </button>
                        )
                    }

                    const isActive = pathname === item.href
                    const Icon = item.icon!

                    return (
                        <button
                            key={item.label}
                            onClick={() => router.push(item.href)}
                            className="flex flex-col items-center gap-1 flex-1 transition-all"
                        >
                            <div className={cn(
                                "p-2 rounded-xl transition-all",
                                isActive ? "text-blue-600 bg-blue-50" : "text-slate-400 group-hover:text-slate-600"
                            )}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className={cn(
                                "text-[10px] font-bold tracking-tight",
                                isActive ? "text-blue-600" : "text-slate-400"
                            )}>
                                {item.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
