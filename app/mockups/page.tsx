"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Bot, 
    Zap, 
    Ticket, 
    Calendar, 
    MessageSquare,
    Sparkles,
    Cpu,
    Network,
    Waves,
    Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function MockupPage() {
    const [selectedConcept, setSelectedConcept] = useState<"cyber_nexus" | "neural_symphony" | "cosmic" | "vocal_command" | "cosmic_command" | "holo_matrix" | "quantum_grid" | "intelligence_portal" | "prism_horizon">("cyber_nexus")

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
            {/* Control Bar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 p-1.5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-x-auto max-w-[90vw] no-scrollbar">
                <button
                    onClick={() => setSelectedConcept("cyber_nexus")}
                    className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                        selectedConcept === "cyber_nexus" ? "bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.6)]" : "text-white/40 hover:text-white"
                    )}
                >
                    Cyber Nexus (New 3D)
                </button>
                <button
                    onClick={() => setSelectedConcept("neural_symphony")}
                    className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                        selectedConcept === "neural_symphony" ? "bg-cyan-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.6)]" : "text-white/40 hover:text-white"
                    )}
                >
                    Neural Symphony (New 3D)
                </button>
                <button
                    onClick={() => setSelectedConcept("cosmic")}
                    className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                        selectedConcept === "cosmic" ? "bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.5)]" : "text-white/40 hover:text-white"
                    )}
                >
                    Cosmic Core
                </button>
                <button
                    onClick={() => setSelectedConcept("vocal_command")}
                    className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                        selectedConcept === "vocal_command" ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]" : "text-white/40 hover:text-white"
                    )}
                >
                    Vocal Command
                </button>
                <button
                    onClick={() => setSelectedConcept("cosmic_command")}
                    className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                        selectedConcept === "cosmic_command" ? "bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.5)]" : "text-white/40 hover:text-white"
                    )}
                >
                    Cosmic Command (Merged)
                </button>
                <button
                    onClick={() => setSelectedConcept("holo_matrix")}
                    className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                        selectedConcept === "holo_matrix" ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]" : "text-white/40 hover:text-white"
                    )}
                >
                    Holo Matrix (New)
                </button>
                <button
                    onClick={() => setSelectedConcept("quantum_grid")}
                    className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                        selectedConcept === "quantum_grid" ? "bg-cyan-600 text-white" : "text-white/40 hover:text-white"
                    )}
                >
                    Quantum Grid
                </button>
                <button
                    onClick={() => setSelectedConcept("intelligence_portal")}
                    className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                        selectedConcept === "intelligence_portal" ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]" : "text-white/40 hover:text-white"
                    )}
                >
                    Intelligence Portal
                </button>
                <button
                    onClick={() => setSelectedConcept("prism_horizon")}
                    className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                        selectedConcept === "prism_horizon" ? "bg-sky-500 text-white" : "text-white/40 hover:text-white"
                    )}
                >
                    Prism Horizon
                </button>
            </div>

            <main className="relative">
                <AnimatePresence mode="wait">
                    {selectedConcept === "cyber_nexus" && <CyberNexusHero key="cyber_nexus" />}
                    {selectedConcept === "neural_symphony" && <NeuralSymphonyHero key="neural_symphony" />}
                    {selectedConcept === "cosmic" && <CosmicHero key="cosmic" />}
                    {selectedConcept === "vocal_command" && <VocalCommandHero key="vocal_command" />}
                    {selectedConcept === "cosmic_command" && <CosmicCommandHero key="cosmic_command" />}
                    {selectedConcept === "holo_matrix" && <HoloMatrixHero key="holo_matrix" />}
                    {selectedConcept === "quantum_grid" && <QuantumGridHero key="quantum_grid" />}
                    {selectedConcept === "intelligence_portal" && <IntelligencePortalHero key="intelligence_portal" />}
                    {selectedConcept === "prism_horizon" && <PrismHorizonHero key="prism_horizon" />}
                </AnimatePresence>
            </main>
        </div>
    )
}

/**
 * MERGED: Cosmic Command
 * Merges the 3D rotating box from Cosmic Core with the Robot AI and sound waves from Vocal Command.
 */
function CosmicCommandHero() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseMove={(e) => {
                const { clientX, clientY } = e
                const { innerWidth, innerHeight } = window
                setMousePos({
                    x: (clientX / innerWidth - 0.5) * 50,
                    y: (clientY / innerHeight - 0.5) * 50
                })
            }}
            className="relative min-h-screen flex items-center justify-center bg-[#020617] overflow-hidden"
        >
            {/* Background Atmosphere & Sound Waves */}
            <div className="absolute inset-0 z-0">
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#1e1b4b_0%,transparent_50%),radial-gradient(circle_at_80%_70%,#312e81_0%,transparent_50%)]" 
                />
                
                {/* Massive Sound Wave Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    {[...Array(60)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ 
                                height: [20, 100 + Math.random() * 500, 20],
                                opacity: [0.1, 0.4, 0.1]
                            }}
                            transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: i * 0.05 }}
                            className="w-1 mx-0.5 bg-indigo-500 rounded-full"
                        />
                    ))}
                </div>
                <div className="absolute inset-0 backdrop-blur-[50px] bg-black/40" />
            </div>

            {/* 3D Cosmic Core + Robot AI */}
            <div className="absolute inset-0 flex items-center justify-center perspective-[1500px] pointer-events-none">
                <motion.div
                    animate={{ rotateY: [0, 360], rotateX: [10, 20, 10], y: [0, -30, 0] }}
                    transition={{ rotateY: { duration: 25, repeat: Infinity, ease: "linear" }, y: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
                    className="relative w-[400px] h-[400px] md:w-[600px] md:h-[600px] transform-style-3d flex items-center justify-center"
                    style={{ rotateX: mousePos.y / 2, rotateY: mousePos.x / 2 }}
                >
                    {/* Rotating 3D Box Layers */}
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={i}
                            className="absolute inset-0 border border-indigo-500/20 bg-indigo-900/[0.02] backdrop-blur-sm rounded-[3rem]"
                            style={{ transform: `rotateY(${i * 60}deg) translateZ(300px)` }}
                        />
                    ))}
                    
                    {/* The Robot at the core */}
                    <div className="absolute inset-0 flex items-center justify-center transform-style-3d">
                        <div className="absolute inset-20 rounded-full bg-blue-500/30 blur-[100px] animate-pulse" />
                        <motion.img 
                            animate={{ rotateY: [-360, 0], scale: [0.9, 1, 0.9] }}
                            transition={{ rotateY: { duration: 25, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut"} }}
                            src="/robot-ai.png" 
                            alt="Vocaris Core Agent" 
                            className="w-[250px] md:w-[350px] drop-shadow-[0_0_60px_rgba(79,70,229,0.5)] z-20"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Text Overlay */}
            <div className="relative z-10 text-center space-y-8 max-w-5xl px-6 mt-96 md:mt-0 md:absolute md:bottom-20">
                <div className="space-y-4">
                    <motion.h1 
                        initial={{ y: 50, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        className="text-6xl md:text-[100px] font-black italic tracking-tighter leading-[0.8] uppercase text-white drop-shadow-2xl"
                    >
                        Cosmic <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Command.</span>
                    </motion.h1>
                    <p className="text-white/60 font-black uppercase tracking-[0.5em] text-[10px] md:text-xs bg-black/20 backdrop-blur-md py-2 px-6 rounded-full inline-block border border-white/5">
                        Omnipresent Voice Intelligence
                    </p>
                </div>
                <div className="flex flex-col items-center gap-8">
                    <Button size="lg" className="h-16 px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_0_40px_rgba(79,70,229,0.4)]">
                        Sync Mind
                    </Button>
                </div>
            </div>
        </motion.section>
    )
}

/**
 * NEW: Holo Matrix
 * Blue holographic theme. Robot AI with glitch and scanline effects.
 */
function HoloMatrixHero() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex items-center justify-center bg-[#010810] overflow-hidden"
        >
            {/* Holographic Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#041f3f_1px,transparent_1px),linear-gradient(to_bottom,#041f3f_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
            
            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[size:100%_4px] opacity-20 mix-blend-overlay" />

            <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6">
                {/* Holographic Robot Presentation */}
                <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="relative flex justify-center perspective-[1000px]"
                >
                    {/* Glass Container */}
                    <div className="relative w-[300px] h-[400px] md:w-[450px] md:h-[550px] bg-blue-900/10 border border-cyan-500/30 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.15)] flex items-center justify-center transform-style-3d rotate-y-12">
                        {/* Scanning Laser */}
                        <motion.div 
                            animate={{ top: ['-10%', '110%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_#22d3ee] z-30"
                        />
                        
                        <div className="absolute inset-0 bg-blue-500/10 blur-[50px] rounded-full mix-blend-screen" />
                        
                        <motion.img 
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            src="/robot-ai.png" 
                            alt="Holographic AI" 
                            className="relative z-20 w-[80%] drop-shadow-[0_0_30px_rgba(34,211,238,0.4)] hue-rotate-[10deg] saturate-150"
                        />

                        <div className="absolute bottom-4 left-4 text-cyan-400 font-mono text-[10px] space-y-1 opacity-70">
                            <p>&gt; SYS_CHECK: OK</p>
                            <p>&gt; NEURAL_NET: ONLINE</p>
                            <p>&gt; VOICE_SYNC: 99.9%</p>
                        </div>
                    </div>
                </motion.div>

                {/* Text Content */}
                <div className="space-y-8 text-left">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400">
                        <div className="size-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">System Online</span>
                    </motion.div>
                    
                    <h1 className="text-6xl md:text-[90px] font-black tracking-tighter leading-[0.85] uppercase text-white">
                        Holo <br /> <span className="text-cyan-400">Matrix.</span>
                    </h1>

                    <p className="text-blue-200/70 text-lg font-medium max-w-md">
                        Construct your AI agent in the holographic space. Precision data extraction meets bleeding-edge visual fidelity.
                    </p>

                    <div className="flex gap-4 pt-4">
                        <Button className="h-16 px-10 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.3)]">Boot Sequence</Button>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

/**
 * NEW: Quantum Grid
 * Cyberpunk, grid-based, heavy on depth and perspective.
 */
function QuantumGridHero() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden perspective-[1000px]"
        >
            {/* Infinite 3D Grid Floor */}
            <div className="absolute inset-0 z-0">
                <div 
                    className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:60px_60px]" 
                    style={{ transform: 'rotateX(60deg) translateY(200px) scale(2)', transformOrigin: 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-transparent" />
            </div>

            {/* Vertical Data Beams */}
            <div className="absolute inset-0 z-10 flex justify-around items-end px-20">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ height: ['20%', '60%', '20%'], opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: i * 0.2 }}
                        className="w-px bg-gradient-to-t from-cyan-500 to-transparent"
                    />
                ))}
            </div>

            {/* Floating Glass Panels */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    <div className="p-8 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl space-y-4 -rotate-3">
                        <Network className="size-10 text-cyan-500" />
                        <h4 className="text-xl font-black uppercase">Flow State</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-bold">Real-time meeting synchronization across all team nodes.</p>
                    </div>
                    <div className="md:col-span-1" /> {/* Spacer */}
                    <div className="p-8 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl space-y-4 rotate-3 mt-20">
                        <Target className="size-10 text-blue-500" />
                        <h4 className="text-xl font-black uppercase">Precision</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-bold">Extracting atomic action items from complex conversations.</p>
                    </div>
                </motion.div>
            </div>

            {/* Main Title Content */}
            <div className="relative z-30 text-center space-y-8">
                <div className="space-y-4">
                    <h1 className="text-8xl md:text-[180px] font-black tracking-tighter italic leading-none uppercase mix-blend-difference">
                        GRID <br /> <span className="text-cyan-500">QUANTUM.</span>
                    </h1>
                </div>
                <div className="flex flex-col items-center gap-6">
                    <p className="text-slate-400 font-black uppercase tracking-[0.6em] text-[10px]">Architecting Business Assets</p>
                    <Button size="lg" className="h-20 px-16 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-black uppercase tracking-widest shadow-[0_0_50px_rgba(6,182,212,0.3)]">Enter the Matrix</Button>
                </div>
            </div>
        </motion.section>
    )
}

/**
 * NEW: Intelligence Portal
 * Robot emerging from a dimensional rift. Futuristic and cinematic.
 */
function IntelligencePortalHero() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden"
        >
            {/* The Rift/Portal */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: 360 
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="size-[600px] md:size-[900px] rounded-full bg-[conic-gradient(from_0deg,#7c3aed,#3b82f6,#7c3aed)] opacity-20 blur-[100px]"
                />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-12 text-center">
                {/* Robot Emerging */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                >
                    <img 
                        src="/robot-ai.png" 
                        alt="Portal Robot" 
                        className="w-full max-w-[500px] drop-shadow-[0_0_80px_rgba(124,58,237,0.5)]"
                    />
                    
                    {/* Floating HUD Panels */}
                    <motion.div 
                        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute -top-10 -right-20 p-6 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] text-left hidden md:block"
                    >
                        <Sparkles className="size-6 text-violet-400 mb-2" />
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/60">Neural Link</div>
                        <div className="text-sm font-bold">STABLE CONNECTION</div>
                    </motion.div>

                    <motion.div 
                        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute -bottom-10 -left-20 p-6 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] text-left hidden md:block"
                    >
                        <Cpu className="size-6 text-blue-400 mb-2" />
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/60">Logic Engine</div>
                        <div className="text-sm font-bold">PROCESSING DATA...</div>
                    </motion.div>
                </motion.div>

                {/* Typography */}
                <div className="space-y-6">
                    <h1 className="text-6xl md:text-[120px] font-black tracking-tighter uppercase leading-[0.8] italic">
                        The <br /> <span className="text-transparent bg-clip-text bg-gradient-to-b from-violet-400 to-blue-500">Intelligence.</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto font-bold uppercase tracking-[0.4em] text-[10px]">
                        Architecting the future of human-AI synergy
                    </p>
                    <div className="pt-8">
                        <Button className="h-20 px-16 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-full font-black uppercase tracking-widest shadow-2xl">Initialize Portal</Button>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

function FloatingTag({ x, y, label, icon }: { x: string, y: string, label: string, icon: React.ReactNode }) {
    return (
        <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
            className="absolute p-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center gap-2 whitespace-nowrap shadow-xl"
            style={{ left: x, top: y }}
        >
            <div className="size-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </motion.div>
    )
}

/**
 * NEW: Prism Horizon
 * Low-poly, landscape, cinematic sunset vibe.
 */
function PrismHorizonHero() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex flex-col items-center justify-end bg-[#020617] overflow-hidden"
        >
            {/* Cinematic Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent" />
            
            {/* The Giant Core Sun */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <motion.div 
                    animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="size-[400px] md:size-[600px] bg-blue-500/20 blur-[150px] rounded-full" 
                />
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 size-40 md:size-64 bg-gradient-to-b from-blue-400 to-transparent rounded-full shadow-[0_0_100px_rgba(96,165,250,0.3)]" 
                />
            </div>

            {/* Low-Poly Glass Mountains */}
            <div className="relative w-full h-[40vh] flex items-end justify-center perspective-[1000px] overflow-hidden">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: 200 }}
                        animate={{ y: 0 }}
                        transition={{ delay: i * 0.1, duration: 1 }}
                        className="absolute bottom-0 w-80 h-96 bg-white/[0.01] border-l border-t border-white/10 backdrop-blur-sm"
                        style={{
                            left: `${i * 8}%`,
                            transform: `rotateX(45deg) skewX(${(i - 6) * 5}deg) translateZ(${Math.abs(i - 6) * -50}px)`,
                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                        }}
                    >
                         <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent" />
                    </motion.div>
                ))}
            </div>

            {/* Content Over the Landscape */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 pt-40">
                <div className="text-center space-y-8">
                    <div className="flex items-center justify-center gap-3 text-sky-400">
                        <Target className="size-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.6em]">New Frontier in Workspace AI</span>
                    </div>
                    <h1 className="text-7xl md:text-[150px] font-black tracking-tighter uppercase leading-[0.8] mix-blend-overlay">
                        PRISM <br /> <span className="text-blue-500">HORIZON.</span>
                    </h1>
                    <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg md:text-xl">
                        A cinematic perspective of your organizational future. 
                        Transparent. Infinite. Intelligent.
                    </p>
                    <div className="pt-4">
                         <Button className="h-20 px-16 bg-transparent border-2 border-white hover:bg-white hover:text-black rounded-2xl font-black uppercase tracking-widest transition-all duration-500">Explore Horizon</Button>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

function FloatingSpatialItem({ x, y, delay, children }: { x: string, y: string, delay: number, children: React.ReactNode }) {
    return (
        <motion.div
            animate={{
                y: [0, -40, 0],
                opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: delay
            }}
            className="absolute"
            style={{ left: x, top: y }}
        >
            {children}
        </motion.div>
    )
}

/**
 * LEGACY: Cosmic Core
 * Kept as per user request.
 */
function CosmicHero() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseMove={(e) => {
                const { clientX, clientY } = e
                const { innerWidth, innerHeight } = window
                setMousePos({
                    x: (clientX / innerWidth - 0.5) * 50,
                    y: (clientY / innerHeight - 0.5) * 50
                })
            }}
            className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden"
        >
            <div className="absolute inset-0 z-0">
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#1e1b4b_0%,transparent_50%),radial-gradient(circle_at_80%_70%,#312e81_0%,transparent_50%)]" 
                />
                <div className="absolute inset-0 backdrop-blur-[100px] bg-black/20" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center perspective-[1000px] pointer-events-none">
                <motion.div
                    animate={{ rotateY: [0, 360], rotateX: [10, 20, 10], y: [0, -30, 0] }}
                    transition={{ rotateY: { duration: 20, repeat: Infinity, ease: "linear" }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                    className="relative w-[500px] h-[500px] transform-style-3d"
                    style={{ rotateX: mousePos.y / 2, rotateY: mousePos.x / 2 }}
                >
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={i}
                            className="absolute inset-0 border-[0.5px] border-white/10 bg-white/[0.02] backdrop-blur-sm"
                            style={{ transform: `rotateY(${i * 60}deg) translateZ(250px)` }}
                        />
                    ))}
                    <div className="absolute inset-20 rounded-full bg-indigo-500/20 blur-[120px] animate-pulse" />
                </motion.div>
            </div>

            <div className="relative z-10 text-center space-y-12 max-w-4xl px-6">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto size-24 rounded-3xl bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.4)]">
                    <Bot className="size-12 text-black" />
                </motion.div>
                <div className="space-y-4">
                    <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-7xl md:text-[120px] font-black italic tracking-tighter leading-[0.8] uppercase text-white">
                        Total <br /><span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">Immersion.</span>
                    </motion.h1>
                    <p className="text-white/40 font-black uppercase tracking-[0.5em] text-[10px]">Vocaris AI Neural Architecture v4.0</p>
                </div>
                <div className="flex flex-col items-center gap-8">
                    <Button size="lg" className="h-20 px-12 bg-white text-black hover:bg-slate-200 font-black uppercase tracking-widest rounded-full text-lg shadow-2xl">Enter the Core</Button>
                </div>
            </div>
        </motion.section>
    )
}

/**
 * NEW: Vocal Command
 * Cinematic split-layout. Robot is the hero. Sound waves pulse around it.
 * Dark premium glass aesthetic with electric blue.
 */
function VocalCommandHero() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex items-center justify-center bg-[#020617] overflow-hidden"
        >
            {/* Massive Sound Wave Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                {[...Array(40)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ 
                            height: [20, 100 + Math.random() * 400, 20],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                        className="w-1 mx-0.5 bg-blue-500 rounded-full"
                    />
                ))}
            </div>

            <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6">
                {/* Text Content */}
                <div className="space-y-8 text-left">
                    <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-2 text-blue-400">
                        <Waves className="size-5" />
                        <span className="text-xs font-black uppercase tracking-[0.5em]">Command Protocol v4.2</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ y: 30, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase"
                    >
                        Vocal <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Command.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-400 text-lg md:text-xl font-medium max-w-lg"
                    >
                        Your voice, scaled by intelligence. The most powerful AI agent for enterprise collaboration.
                    </motion.p>

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex gap-4"
                    >
                        <Button className="h-16 px-10 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest">Execute Sync</Button>
                        <Button variant="outline" className="h-16 px-10 border-white/10 hover:bg-white/5 rounded-2xl font-black uppercase tracking-widest">Watch Demo</Button>
                    </motion.div>
                </div>

                {/* Robot Hero Image */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />
                    <img 
                        src="/robot-ai.png" 
                        alt="Vocaris AI Robot" 
                        className="relative z-10 w-full max-w-[600px] mx-auto drop-shadow-[0_0_50px_rgba(59,130,246,0.3)]"
                    />
                    
                    {/* Floating Tech Badges */}
                    <div className="absolute top-0 right-0 p-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl rotate-12">
                        <Zap className="size-6 text-yellow-400" />
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}

/**
 * NEW: Cyber Nexus
 * A highly premium 3D design with massive rotating gyroscope rings and floating glass panels.
 */
function CyberNexusHero() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex items-center justify-center bg-[#010614] overflow-hidden"
        >
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,#0f172a_0%,#010614_70%)]" />

            {/* Glowing 3D Grid */}
            <div className="absolute inset-0 z-0 flex items-center justify-center perspective-[2000px] opacity-30">
                <motion.div 
                    animate={{ rotateX: [60, 60], rotateZ: [0, 360] }}
                    transition={{ rotateZ: { duration: 150, repeat: Infinity, ease: "linear" } }}
                    className="w-[200vw] h-[200vw] absolute bottom-[-100vh] border border-blue-500/20 bg-[linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] bg-[size:100px_100px]"
                />
            </div>

            {/* Main 3D Composition */}
            <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6">
                
                {/* 3D Robot Nexus */}
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
                    className="relative flex items-center justify-center h-[500px] perspective-[1500px]"
                >
                    {/* Rotating Rings (Gyroscope effect) */}
                    <motion.div 
                        animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute w-[450px] h-[450px] border-[2px] border-blue-500/30 rounded-full transform-style-3d"
                    />
                    <motion.div 
                        animate={{ rotateX: [360, 0], rotateZ: [0, 360] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute w-[350px] h-[350px] border-[4px] border-cyan-400/20 rounded-full transform-style-3d"
                    />

                    {/* Central Core Glow */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[200px] h-[200px] bg-blue-500/40 blur-[80px] rounded-full animate-pulse" />
                    </div>

                    {/* Robot Image */}
                    <motion.img 
                        animate={{ y: [-15, 15, -15] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        src="/robot-ai.png" 
                        alt="Cyber Nexus Core" 
                        className="relative z-20 w-[80%] max-w-[350px] drop-shadow-[0_20px_50px_rgba(59,130,246,0.6)]"
                    />

                    {/* Floating Glass Panels */}
                    <motion.div 
                        animate={{ y: [-10, 10, -10], rotateY: [-10, 10, -10] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -right-12 top-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-30"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Cpu className="size-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Processing</p>
                                <p className="text-sm font-black text-white">4.2 TeraFLOPS</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        animate={{ y: [10, -10, 10], rotateY: [10, -10, 10] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -left-8 bottom-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-30"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                                <Network className="size-5 text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Neural Sync</p>
                                <p className="text-sm font-black text-white">Optimized</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Text Content */}
                <div className="space-y-8 text-left z-20 lg:pl-12">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 text-cyan-400">
                        <Sparkles className="size-5" />
                        <span className="text-xs font-black uppercase tracking-[0.5em]">The Next Evolution</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl md:text-[80px] font-black tracking-tighter leading-[0.9] text-white"
                    >
                        Cybernetic <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                            Intelligence.
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-400 text-lg md:text-xl font-medium max-w-lg leading-relaxed"
                    >
                        A jaw-dropping 3D interface designed to impress. Transform how you interact with AI through immersive, premium web architecture.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex gap-4 pt-4"
                    >
                        <Button className="h-16 px-10 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-2xl font-black uppercase tracking-widest shadow-[0_10px_40px_rgba(59,130,246,0.4)] transition-all hover:scale-105">
                            Initialize Core
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}

/**
 * NEW: Neural Symphony
 * A fluid, particle-based 3D design focusing on elegance, smooth curves, and deep blue voids.
 */
function NeuralSymphonyHero() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex items-center justify-center bg-[#000000] overflow-hidden"
        >
            {/* Deep Blue Void Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#0f172a_0%,#000000_60%)]" />

            {/* Glowing Orbs (Particles) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ 
                            y: ['100vh', '-10vh'],
                            x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{ 
                            duration: 10 + Math.random() * 10, 
                            repeat: Infinity, 
                            delay: Math.random() * 10,
                            ease: "linear"
                        }}
                        className="absolute bottom-0 w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full"
                        style={{ left: `${Math.random() * 100}%` }}
                    />
                ))}
            </div>

            <div className="container relative z-10 flex flex-col items-center justify-center px-6 pt-20">
                
                {/* Central Presentation */}
                <div className="relative flex flex-col items-center">
                    
                    {/* The Robot on a Glass Pedestal */}
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative flex items-center justify-center"
                    >
                        {/* Glow Behind Robot */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/20 blur-[100px] rounded-full" />
                        
                        <motion.img 
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            src="/robot-ai.png" 
                            alt="Neural Symphony Avatar" 
                            className="relative z-20 w-[280px] md:w-[400px] drop-shadow-[0_30px_60px_rgba(6,182,212,0.4)]"
                        />
                        
                        {/* Glass Pedestal */}
                        <div className="absolute bottom-[-20px] w-[300px] md:w-[500px] h-[100px] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] rounded-full blur-md" />
                        <div className="absolute bottom-10 w-[200px] md:w-[350px] h-[20px] border border-cyan-500/30 bg-cyan-900/20 backdrop-blur-3xl rounded-[100%] shadow-[0_0_50px_rgba(6,182,212,0.2)] transform-style-3d rotate-x-60" />
                    </motion.div>

                    {/* Surrounding Text and UI */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="mt-12 text-center max-w-4xl space-y-6"
                    >
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
                            Neural <span className="font-light italic text-cyan-300">Symphony</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 font-light tracking-wide max-w-2xl mx-auto">
                            A masterpiece of visual engineering. Experience meeting intelligence wrapped in an elegant, cinematic 3D environment.
                        </p>
                        
                        <div className="flex items-center justify-center gap-6 pt-8">
                            <button className="relative group px-8 py-4 bg-transparent border border-white/20 rounded-full overflow-hidden">
                                <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors" />
                                <div className="absolute inset-[-100%] bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] animate-[shimmer_2s_infinite] group-hover:animate-[shimmer_1s_infinite]" />
                                <span className="relative z-10 text-white font-bold tracking-widest uppercase text-sm">Experience Now</span>
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </motion.section>
    )
}
