"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react"

type ClickUpHierarchy = {
    user: any
    teams: any[] // Workspaces
    spaces?: any[]
    folders?: any[]
    lists?: any[]
    // The actual structure might be nested. We'll adapt based on the response.
    // Assuming the API returns a flattened or easily traversable structure or we fetch lazily? 
    // User says "Returns hierarchical structure...". Let's assume it returns EVERYTHING.
}

interface ClickUpIntegrationProps {
    onCancel: () => void
    onCommit: (targetListId: string, token: string, assigneeId?: string) => void
}

export function ClickUpIntegration({ onCancel, onCommit }: ClickUpIntegrationProps) {
    const [step, setStep] = useState<"auth" | "selection" | "success">("auth")
    const [token, setToken] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [data, setData] = useState<any>(null)
    const [authWindow, setAuthWindow] = useState<Window | null>(null)

    // Selections
    const [selectedTeamId, setSelectedTeamId] = useState<string>("")
    const [selectedSpaceId, setSelectedSpaceId] = useState<string>("")
    const [selectedFolderId, setSelectedFolderId] = useState<string>("")
    const [selectedListId, setSelectedListId] = useState<string>("")
    const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>("")

    // Load persistent token on mount
    useEffect(() => {
        const savedToken = localStorage.getItem("vocaris_clickup_token")
        if (savedToken) {
            console.log("💾 Found saved ClickUp token, auto-loading...")
            setToken(savedToken)
        }
    }, [])

    useEffect(() => {
        // Listen for message from popup (if backend supports it)
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "CLICKUP_AUTH_SUCCESS" && event.data?.token) {
                console.log("📨 Received token via postMessage")
                const newToken = event.data.token
                setToken(newToken)
                localStorage.setItem("vocaris_clickup_token", newToken)
            }
        }
        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [])

    useEffect(() => {
        if (token && step === "auth") {
            // Auto-trigger fetch when token is set
            fetchHierarchy()
        }
        // Sync token to persistent storage whenever it changes
        if (token.trim()) {
            localStorage.setItem("vocaris_clickup_token", token.trim())
        }
    }, [token])

    const handleAuth = () => {
        setLoading(true)
        setError("")

        // Open ClickUp OAuth directly — backend flow ignores our redirect_uri.
        // ClickUp will redirect to localhost:3000?code=xxx, middleware relays to callback page.
        const callbackUrl = `${window.location.origin}/auth/clickup/callback`
        const CLICKUP_CLIENT_ID = "4KPIR7QHYZ1D61QEQT1EOUP5WDL0ADK8"
        const url = `https://app.clickup.com/api?client_id=${CLICKUP_CLIENT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}`

        console.log("🔐 Opening ClickUp OAuth directly. Redirect target:", callbackUrl)
        const popup = window.open(url, "ClickUpAuth", "width=600,height=700")
        setAuthWindow(popup)

        // Polling loop — only checks localStorage bridge and same-origin popup URL
        const pollTimer = window.setInterval(async () => {
            // 1. Check localStorage bridge (token written by callback page)
            const localToken = localStorage.getItem("clickup_active_token")
            if (localToken) {
                console.log("💎 Token detected via localStorage bridge!", localToken)
                setToken(localToken)
                localStorage.setItem("vocaris_clickup_token", localToken)
                localStorage.removeItem("clickup_active_token")
                if (popup && !popup.closed) popup.close()
                window.clearInterval(pollTimer)
                return
            }

            // 2. Try reading popup URL (works only when popup is on same-origin)
            if (popup && !popup.closed) {
                try {
                    if (popup.location.origin === window.location.origin) {
                        const searchParams = new URL(popup.location.href).searchParams
                        const urlToken = searchParams.get("token") || searchParams.get("access_token")
                        if (urlToken) {
                            console.log("🔍 Detected token in popup URL!")
                            setToken(urlToken)
                            localStorage.setItem("vocaris_clickup_token", urlToken)
                            popup.close()
                            window.clearInterval(pollTimer)
                        }
                    }
                } catch (e) {
                    // CORS blocks reading cross-origin popup URL — expected
                }
            }

            // 3. Popup closed with no token
            if (!popup || popup.closed) {
                window.clearInterval(pollTimer)
                if (!localToken) {
                    setLoading(false)
                    setAuthWindow(null)
                }
            }
        }, 1000)
    }

    const magicFetchToken = async () => {
        // Disabled — proxy requires a code now, magic fetch without code always returns 400
        console.log("🪄 Magic fetch skipped (no code available)")
        return false
    }

    const fetchHierarchy = async () => {
        const currentToken = token.trim()
        if (!currentToken) {
            // Before failing, try one last magic fetch
            const success = await magicFetchToken()
            if (!success) {
                setError("Auto-detection failed. Please ensure you finished authorization in the popup.")
                return
            }
            return // fetchHierarchy will be re-triggered by useEffect [token]
        }
        setLoading(true)
        setError("")
        try {
            const res = await fetch(`/api/clickup/workspace?token=${token}`)

            // Raw logging for debugging as requested by user
            const clone = res.clone()
            const rawBody = await clone.text()
            console.log("📡 WORKSPACE FETCH RAW RESPONSE:", rawBody)

            if (!res.ok) throw new Error("Failed to fetch ClickUp workspaces")

            const json = JSON.parse(rawBody)
            console.log("ClickUp Data:", json)
            setData(json)
            setStep("selection")

            // Auto-select first team if available
            if (json.teams && json.teams.length > 0) {
                setSelectedTeamId(json.teams[0].id)
            }
        } catch (err) {
            console.error(err)
            setError("Invalid token or connection failed.")
            // If it's likely an auth error, clear the token to allow retry
            localStorage.removeItem("vocaris_clickup_token")
        } finally {
            setLoading(false)
        }
    }

    // ---- Derived hierarchy from actual API response structure ----
    // Response: { teams: [{ id, name, spaces: [{ id, name, folders: [{ id, name, lists: [{id,name}] }], folderless_lists: [] }] }] }
    const teams = data?.teams || []

    const activeTeam = teams.find((t: any) => t.id === selectedTeamId) || (teams.length === 1 ? teams[0] : null)
    const activeTeamId = activeTeam?.id || ""

    const spaces = activeTeam?.spaces || []
    const activeSpace = spaces.find((s: any) => s.id === selectedSpaceId) || (spaces.length === 1 ? spaces[0] : null)
    const activeSpaceId = activeSpace?.id || ""

    const folders = activeSpace?.folders || []
    const folderlessLists = activeSpace?.folderless_lists || []
    const activeFolder = folders.find((f: any) => f.id === selectedFolderId) || (folders.length === 1 ? folders[0] : null)
    const activeFolderId = activeFolder?.id || ""

    // Collect all available lists: from folder + folderless
    const folderLists = activeFolder?.lists || []
    const allLists = [...folderlessLists, ...folderLists]
    const resolvedList = allLists.find((l: any) => l.id === selectedListId) || (allLists.length === 1 ? allLists[0] : null)
    const resolvedListId = resolvedList?.id || ""

    // Auto-advance selections when only one option
    useEffect(() => {
        if (activeTeamId && !selectedTeamId) setSelectedTeamId(activeTeamId)
        if (activeSpaceId && !selectedSpaceId) setSelectedSpaceId(activeSpaceId)
        if (activeFolderId && !selectedFolderId) setSelectedFolderId(activeFolderId)
        if (resolvedListId && !selectedListId) setSelectedListId(resolvedListId)
    }, [activeTeamId, activeSpaceId, activeFolderId, resolvedListId])

    return (
        <Card className="w-[95vw] sm:w-full max-w-md mx-auto bg-slate-900 border-slate-800 text-slate-100 shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh]">
            <CardHeader className="p-4 sm:p-5 shrink-0 border-b border-white/5 relative">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCancel}
                    className="absolute right-2 top-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full w-8 h-8"
                >
                    <X className="w-4 h-4" />
                </Button>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <div className="w-6 h-6 flex items-center justify-center bg-white rounded-md p-1">
                        <img src="https://clickup.com/landing/images/logo-clickup_color.svg" alt="ClickUp" className="w-full h-full object-contain" />
                    </div>
                    Connect ClickUp
                </CardTitle>
                <CardDescription className="text-slate-400 text-[10px] sm:text-xs">
                    {step === "auth" ? "Authorize access to your ClickUp tickets." :
                        step === "selection" ? "Select target for ticket push." : "Push completed successfully."}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 p-4 sm:p-5 overflow-y-auto custom-scrollbar flex-1">
                {error && (
                    <div className="bg-red-900/20 border border-red-900/50 p-3 rounded-md text-red-500 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                {step === "auth" && (
                    <div className="space-y-8 py-6">
                        {!authWindow ? (
                            <div className="space-y-6 text-center animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-lg">
                                    <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-white tracking-tight">Sync Workspace</h3>
                                    <p className="text-xs text-slate-400 max-w-[240px] mx-auto leading-relaxed">
                                        Link your ClickUp account to automatically sync scrum tickets.
                                    </p>
                                </div>
                                <Button
                                    className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black text-base rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] group"
                                    onClick={handleAuth}
                                >
                                    <span className="mr-2">Continue to ClickUp</span>
                                    <X className="w-4 h-4 rotate-45 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-6 sm:p-10 rounded-[2.5rem] bg-blue-500/5 border border-white/5 space-y-8 animate-in zoom-in-95 duration-500 text-center">
                                <div className="relative">
                                    <div className="absolute inset-[-10px] rounded-full bg-blue-500/20 animate-ping opacity-50" />
                                    <div className="w-20 h-20 rounded-full bg-slate-900 border border-blue-500/30 flex items-center justify-center relative z-10 shadow-2xl">
                                        <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-lg font-black text-white tracking-tight">Waiting for Sync...</h4>
                                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Detection Engine Active</p>
                                </div>
                                <div className="w-full space-y-4">
                                    <p className="text-[11px] text-slate-400 font-medium px-4">
                                        Please complete the authorization in the secure popup window.
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-[10px] text-rose-500 font-bold uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-400"
                                        onClick={() => {
                                            if (authWindow && !authWindow.closed) authWindow.close()
                                            setAuthWindow(null)
                                            setLoading(false)
                                        }}
                                    >
                                        Cancel Protocol
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === "selection" && data && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        {/* USER INFO */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white">
                                {data.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                                <p className="text-sm font-black text-white">{data.username}</p>
                                <p className="text-[10px] font-bold text-slate-500">{data.email}</p>
                            </div>
                            <Badge variant="outline" className="ml-auto text-[10px] border-blue-500/30 text-blue-400">Connected</Badge>
                        </div>

                        {/* WORKSPACE — only show if more than 1 */}
                        {teams.length > 1 && (
                            <div className="space-y-2">
                                <Label>Workspace (Team)</Label>
                                <Select value={selectedTeamId} onValueChange={(v) => {
                                    setSelectedTeamId(v)
                                    setSelectedSpaceId("")
                                    setSelectedFolderId("")
                                    setSelectedListId("")
                                }}>
                                    <SelectTrigger className="bg-slate-950 border-slate-700">
                                        <SelectValue placeholder="Select Workspace" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teams.map((t: any) => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* SPACE — only show if more than 1 */}
                        {activeTeamId && spaces.length > 1 && (
                            <div className="space-y-2">
                                <Label>Space</Label>
                                <Select value={selectedSpaceId} onValueChange={(v) => {
                                    setSelectedSpaceId(v)
                                    setSelectedFolderId("")
                                    setSelectedListId("")
                                }}>
                                    <SelectTrigger className="bg-slate-950 border-slate-700">
                                        <SelectValue placeholder="Select Space" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {spaces.map((s: any) => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* FOLDER — only show if more than 1 */}
                        {activeSpaceId && folders.length > 1 && (
                            <div className="space-y-2">
                                <Label>Folder</Label>
                                <Select value={selectedFolderId} onValueChange={(v) => {
                                    setSelectedFolderId(v)
                                    setSelectedListId("")
                                }}>
                                    <SelectTrigger className="bg-slate-950 border-slate-700">
                                        <SelectValue placeholder="Select Folder" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {folderlessLists.length > 0 && <SelectItem value="ROOT">No Folder (Space Level)</SelectItem>}
                                        {folders.map((f: any) => (
                                            <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* LIST — only show if more than 1 */}
                        {(activeFolderId || activeSpaceId) && allLists.length > 1 && (
                            <div className="space-y-2">
                                <Label className="text-xs">Select List</Label>
                                <Select value={selectedListId} onValueChange={setSelectedListId}>
                                    <SelectTrigger className="bg-slate-950 border-slate-700 h-10 text-sm">
                                        <SelectValue placeholder="Select Target List" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allLists.map((l: any) => (
                                            <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                )}

                {step === "success" && (
                    <div className="py-8 sm:py-12 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl sm:text-2xl font-black text-white px-2">Success!</h3>
                            <p className="text-xs sm:text-sm text-slate-400 max-w-[280px] sm:max-w-xs mx-auto">
                                All scrum tickets have been successfully pushed to your ClickUp list.
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex flex-col-reverse sm:flex-row justify-between border-t border-slate-800 p-4 sm:p-6 gap-3">
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    className="w-full sm:w-auto text-slate-400 hover:text-white hover:bg-white/5"
                >
                    {step === "success" ? "Close" : "Cancel"}
                </Button>

                {step === "selection" && (
                    <Button
                        onClick={async () => {
                            setLoading(true)
                            try {
                                await onCommit(resolvedListId, token, selectedAssigneeId)
                                setStep("success")
                            } catch (e) {
                                // Error is handled by top-level toast/error state
                            } finally {
                                setLoading(false)
                            }
                        }}
                        disabled={!resolvedListId || loading}
                        className="bg-[#7b68ee] hover:bg-[#6c5ce7] text-white font-bold w-full sm:w-auto h-11 sm:h-10 px-8"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Push Tickets
                    </Button>
                )}

                {step === "success" && (
                    <Button
                        onClick={onCancel}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold w-full sm:w-auto h-11 sm:h-10 px-8"
                    >
                        Great!
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
