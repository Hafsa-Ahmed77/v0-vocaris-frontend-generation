"use client"

import { useState } from "react"
import { 
  CheckCircle2, 
  MessageSquare, 
  Paperclip, 
  History, 
  Archive, 
  FileBox, 
  ChevronRight,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  AlertCircle,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export default function ScrumPage() {
  const [activeTab, setActiveTab] = useState("summary")

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1400px] mx-auto animate-in fade-in duration-700 bg-[#020617] min-h-screen text-slate-100">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 font-medium">
        <span className="hover:text-blue-400 cursor-pointer transition-colors">Projects</span>
        <ChevronRight className="size-4" />
        <span className="hover:text-blue-400 cursor-pointer transition-colors">Engineering</span>
        <ChevronRight className="size-4" />
        <span className="text-white font-black">Technical Manifest</span>
      </nav>

      {/* Sync Status Banner */}
      <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-6 rounded-full bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <CheckCircle2 className="size-4" />
          </div>
          <span className="text-emerald-400 font-bold text-sm uppercase tracking-wide">Successfully Synced</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-500/80">
          <span className="font-black text-[10px] uppercase tracking-widest">Auto-Verification Complete</span>
        </div>
      </div>

      {/* Main Ticket Card */}
      <div className="bg-[#0b1120]/80 border-2 border-slate-800/50 rounded-[32px] shadow-2xl overflow-hidden min-h-[500px] flex flex-col backdrop-blur-xl">
        {/* Ticket Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50 bg-slate-900/40">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileBox className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black text-white leading-none tracking-tight">Technical Manifest</h1>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 flex gap-1.5 px-2 py-0.5 font-black uppercase text-[10px]">
                  <Zap className="size-3 fill-blue-400" />
                  AI Verified
                </Badge>
              </div>
              <p className="text-xs font-black text-slate-500 mt-1 uppercase tracking-widest flex items-center gap-2">
                <span className="size-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                Scrum Standup Summary - AI Enhanced
              </p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-6 rounded-xl flex gap-2.5 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95 group border-none">
            <div className="size-5 rounded-lg bg-blue-500/50 flex items-center justify-center group-hover:scale-110 transition-transform">
               <History className="size-3 text-white" />
            </div>
            Commit Changes
          </Button>
        </div>

        {/* Ticket Body Content */}
        <div className="flex flex-1 flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-800/50">
          {/* Left Sidebar - Meta */}
          <div className="w-full lg:w-72 p-6 flex flex-col gap-8 bg-slate-900/20">
            {/* Assigned Participant */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Assigned Participant</label>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Avatar className="size-11 rounded-xl border-2 border-slate-800 shadow-xl ring-1 ring-blue-500/20">
                    <AvatarImage src="https://ui-avatars.com/api/?name=Mansoor+Ali&background=1e293b&color=3b82f6" />
                    <AvatarFallback className="bg-slate-800 text-blue-400 font-bold">MA</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-black text-white leading-tight">mansoor ali</p>
                    <p className="text-[10px] font-bold text-slate-500">DevOps Engineer</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="size-8 rounded-lg hover:bg-slate-800">
                  <Plus className="size-4 text-slate-600" />
                </Button>
              </div>
              <p className="text-[10px] text-slate-600 font-bold italic mt-3">Total: 1 participants</p>
            </div>

            {/* Current Status */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Current Status</label>
              <Button variant="outline" className="w-full justify-between h-10 px-4 rounded-xl border-slate-800 bg-slate-900/50 group hover:border-blue-500/50 hover:bg-slate-800/80 transition-all shadow-lg text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  <span className="text-sm font-black uppercase tracking-tight">In Progress</span>
                </div>
                <ChevronRight className="size-4 text-slate-600 group-hover:translate-x-0.5 transition-transform rotate-90" />
              </Button>
            </div>

            {/* Priority Level */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Priority Level</label>
                <Plus className="size-3 text-slate-600 cursor-pointer hover:text-blue-400 transition-colors" />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-1.5 h-6 rounded-full transition-all shadow-sm",
                        i <= 3 ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" : "bg-slate-800"
                      )}
                    />
                  ))}
                </div>
                <span className="text-lg font-black text-white">3</span>
              </div>
            </div>

            {/* Deadline Proximity */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Deadline Proximity</label>
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 group">
                <div className="size-8 rounded-lg bg-slate-900 border border-red-500/30 flex items-center justify-center text-red-500 shadow-inner group-hover:scale-105 transition-transform">
                  <Clock className="size-4" />
                </div>
                <span className="text-sm font-black text-red-400 tracking-tight">1 days remaining</span>
              </div>
            </div>

            {/* Metadata Tags */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Metadata Tags</label>
              <div className="flex flex-wrap gap-2">
                {["MCP Server", "Deployment", "Barrier Token"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-slate-800 text-slate-400 hover:bg-blue-500/20 hover:text-blue-400 transition-all cursor-pointer px-2.5 py-1.5 rounded-lg border border-slate-700/50 text-[10px] font-black uppercase tracking-tight">
                    {tag}
                  </Badge>
                ))}
                <Button variant="outline" className="size-8 p-0 rounded-lg border-dashed border-slate-700 hover:border-slate-500 bg-transparent">
                  <Plus className="size-4 text-slate-600" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="flex-1 flex flex-col p-8 gap-8 bg-slate-900/10">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Title</span>
                <h2 className="text-2xl font-black text-white tracking-tight">MCP Server Deployment</h2>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Summary & Status Report</span>
                <div className="relative p-8 bg-blue-500/5 border border-blue-500/10 rounded-[24px] group transition-all hover:bg-blue-500/10 hover:border-blue-500/20">
                  <div className="absolute top-4 right-4 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
                    <Zap className="size-10 fill-current" />
                  </div>
                  <p className="text-lg font-medium text-slate-300 leading-relaxed relative z-10 max-w-[650px]">
                    Mansoor Ali is working on deploying an MCP server and is currently troubleshooting deployment issues. The barrier token is not being passed, and he is researching a solution. He expects to provide an update by the end of the day.
                  </p>
                </div>
              </div>

              {/* Grid for Blockers and Next Steps */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4 group">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="size-4 text-red-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Blockers</span>
                  </div>
                  <div className="flex-1 p-6 bg-slate-900/40 border border-slate-800 rounded-2xl group-hover:border-red-500/30 transition-all shadow-lg">
                    <p className="text-sm font-bold text-slate-400 leading-relaxed">
                      Deployment issues due to missing barrier token
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 group">
                  <div className="flex items-center gap-2 text-blue-400">
                    <ArrowUpRight className="size-4" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Next Steps</span>
                  </div>
                  <div className="flex-1 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl group-hover:border-blue-500/30 transition-all shadow-lg">
                    <p className="text-sm font-bold text-slate-300 leading-relaxed">
                      Resolve barrier token issue and complete deployment
                    </p>
                  </div>
                </div>
              </div>

              {/* Deployment Logs Console */}
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-xl border border-blue-500/20">
                      <FileBox className="size-4" />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Deployment Logs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Listening</span>
                  </div>
                </div>
                <div className="bg-[#020617] border border-slate-800/50 rounded-[24px] p-6 font-mono text-xs overflow-hidden shadow-2xl relative min-h-[160px]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                  <div className="space-y-2 relative z-10">
                    <p className="flex gap-4">
                      <span className="text-slate-600 w-16">[14:02:11]</span>
                      <span className="text-red-400/90 font-bold">ERR: AUTH_TOKEN_MISSING (502)</span>
                    </p>
                    <p className="flex gap-4">
                      <span className="text-slate-600 w-16">[14:02:15]</span>
                      <span className="text-slate-400">Retrying connection to MCP_PROXY...</span>
                    </p>
                    <p className="flex gap-4">
                      <span className="text-slate-600 w-16">[14:02:18]</span>
                      <span className="text-slate-400">Node cluster responding on port 8080</span>
                    </p>
                    <p className="flex gap-4">
                      <span className="text-slate-600 w-16">[14:02:20]</span>
                      <span className="text-red-500 font-black animate-pulse">Critical: Token passing handshake failed</span>
                    </p>
                    <p className="flex gap-4">
                      <span className="text-slate-600 w-16">[14:14:02]</span>
                      <span className="text-blue-400/80">Syncing with Git repository...</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Footer Actions */}
        <div className="border-t border-slate-800/50 bg-slate-900/40 p-4 px-8 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors group">
              <MessageSquare className="size-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">12 Comments</span>
            </button>
            <button className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors group">
              <Paperclip className="size-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">3 Attachments</span>
            </button>
            <button className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors group">
              <History className="size-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">View History</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-600 flex items-center gap-2">
              <Zap className="size-3 text-slate-700" />
              Last updated 14 minutes ago by ProjectSync Bot
            </span>
          </div>
        </div>
      </div>

      {/* Extreme Bottom Buttons */}
      <div className="flex items-center justify-end gap-3 mt-4">
        <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-800 text-slate-400 font-bold flex gap-2.5 hover:bg-slate-800/50 hover:text-white transition-all shadow-lg bg-transparent">
          <Archive className="size-4" />
          Archive Manifest
        </Button>
        <Button variant="secondary" className="h-12 px-6 rounded-xl bg-blue-600 text-white font-bold flex gap-2.5 hover:bg-blue-500 border-none transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]">
          <ArrowUpRight className="size-4" />
          Export PDF
        </Button>
      </div>
    </div>
  )
}
