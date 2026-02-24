"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bell, Search, Command } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"

export function Topbar() {
  return (
    <div className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-white/80 px-6 backdrop-blur-md">
      {/* Search Section */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative group max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            className="pl-10 pr-12 h-10 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all font-medium text-sm"
            placeholder="Search anything..."
            aria-label="Search"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] text-slate-400 font-bold">
            <Command className="size-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 mr-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Active</span>
        </div>

        <ThemeToggle />

        <Button variant="ghost" size="icon" className="relative w-10 h-10 rounded-xl hover:bg-slate-50 text-slate-500 border border-transparent hover:border-slate-100 transition-all" aria-label="Notifications">
          <Bell className="size-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </Button>

        <div className="h-6 w-[1px] bg-slate-200 mx-1" />

        <div className="flex items-center gap-3 pl-1">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-xs font-black text-slate-900 leading-none">Hafsa Ahmed</span>
            <span className="text-[10px] text-slate-400 font-medium">Pro Account</span>
          </div>
          <Avatar className="h-10 w-10 rounded-xl border-2 border-slate-50 shadow-sm">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-blue-600 text-white font-black text-xs">HA</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}
