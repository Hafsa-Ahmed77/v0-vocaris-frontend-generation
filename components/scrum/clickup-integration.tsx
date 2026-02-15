"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

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
    const [step, setStep] = useState<"auth" | "selection">("auth")
    const [token, setToken] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Hierarchy Data
    const [data, setData] = useState<any>(null)

    // Selections
    const [selectedTeamId, setSelectedTeamId] = useState<string>("")
    const [selectedSpaceId, setSelectedSpaceId] = useState<string>("")
    const [selectedFolderId, setSelectedFolderId] = useState<string>("")
    const [selectedListId, setSelectedListId] = useState<string>("")
    const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>("")

    const handleAuth = () => {
        // Open the popup
        window.open("https://vocaris-ztudf.ondigitalocean.app/api/v1/auth/clickup/authorize", "ClickUpAuth", "width=600,height=700")
        // We can't automatically get the token due to CORS unless the backend redirects back. 
        // We will focus the input for the user.
    }

    const fetchHierarchy = async () => {
        if (!token.trim()) {
            setError("Please enter the access token from the popup.")
            return
        }
        setLoading(true)
        setError("")
        try {
            const res = await fetch(`/api/clickup/workspace?token=${token}`)
            if (!res.ok) throw new Error("Failed to fetch ClickUp workspaces")

            const json = await res.json()
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
        } finally {
            setLoading(false)
        }
    }

    // Derived lists based on selections
    const spaces = data?.spaces?.filter((s: any) => String(s.team_id) === String(selectedTeamId)) || [] // Assuming flattened?
    // Wait, the user said "Returns hierarchical structure".
    // Usually ClickUp API returns Teams -> Spaces -> Folders -> Lists.
    // If the API returns them all separately or nested, we need to handle it.
    // For now, let's assume standard ClickUp structure where we might need to drill down or the API gives a big tree.
    // Given "Fetch all teams, spaces, folders, lists", let's assume they are nested in the JSON or we filter?
    // Let's assume the API reformats it nicely or we have to traverse.
    // Use optional chaining and safety checks.

    // Let's approximate the structure based on standard API + user description.
    // If the API returns a flattened list of everything, we filter.
    // If it returns `teams: [{ spaces: [...] }]`, we traverse.

    const activeTeam = data?.teams?.find((t: any) => t.id === selectedTeamId)
    const activeSpaces = activeTeam?.spaces || [] // If nested

    const activeSpace = activeSpaces.find((s: any) => s.id === selectedSpaceId)
    const activeFolders = activeSpace?.folders || []
    const spaceLists = activeSpace?.lists || [] // Folderless lists in space

    const activeFolder = activeFolders.find((f: any) => f.id === selectedFolderId)
    const activeLists = activeFolder?.lists || []

    return (
        <Card className="w-full max-w-lg mx-auto bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <img src="https://clickup.com/landing/images/logo-clickup_color.svg" alt="ClickUp" className="w-5 h-5 filter brightness-0 invert" />
                    Connect ClickUp
                </CardTitle>
                <CardDescription className="text-slate-400">
                    {step === "auth" ? "Authorize Vocaris to access your ClickUp tickets." : "Select where to push these tickets."}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {error && (
                    <div className="bg-red-900/20 border border-red-900/50 p-3 rounded-md text-red-500 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                {step === "auth" && (
                    <div className="space-y-4">
                        <div className="text-sm text-slate-400">
                            1. Click the button below to authorize. <br />
                            2. Copy the token from the popup window. <br />
                            3. Paste it here to proceed.
                        </div>
                        <Button variant="outline" className="w-full border-blue-700 text-blue-400 hover:bg-blue-900/30" onClick={handleAuth}>
                            Open ClickUp Authorization
                        </Button>
                        <div className="space-y-2">
                            <Label htmlFor="token">Access Token</Label>
                            <Input
                                id="token"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Paste token here..."
                                className="bg-slate-950 border-slate-700"
                            />
                        </div>
                    </div>
                )}

                {step === "selection" && data && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        {/* WORKSPACE */}
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
                                    {data.teams?.map((t: any) => (
                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* SPACE */}
                        {selectedTeamId && (
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
                                        {activeSpaces.map((s: any) => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* FOLDER (Optional if lists are at space level) */}
                        {selectedSpaceId && (activeFolders.length > 0 || spaceLists.length > 0) && (
                            <div className="space-y-2">
                                <Label>Folder / List Container</Label>
                                <Select value={selectedFolderId} onValueChange={(v) => {
                                    setSelectedFolderId(v)
                                    setSelectedListId("")
                                }}>
                                    <SelectTrigger className="bg-slate-950 border-slate-700">
                                        <SelectValue placeholder="Select Folder" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Separate Section for Folderless Lists? Or just mix them? */}
                                        {spaceLists.length > 0 && <SelectItem value="ROOT">No Folder (Space Level)</SelectItem>}
                                        {activeFolders.map((f: any) => (
                                            <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* LIST */}
                        {(selectedFolderId || (selectedSpaceId && activeFolders.length === 0)) && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Select List</Label>
                                    <Select value={selectedListId} onValueChange={setSelectedListId}>
                                        <SelectTrigger className="bg-slate-950 border-slate-700">
                                            <SelectValue placeholder="Select Target List" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectedFolderId === "ROOT"
                                                ? spaceLists.map((l: any) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)
                                                : activeLists.map((l: any) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* ASSIGNEE (Optional) */}
                                {activeTeam?.members && activeTeam.members.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Assignee (Optional)</Label>
                                        <Select value={selectedAssigneeId} onValueChange={setSelectedAssigneeId}>
                                            <SelectTrigger className="bg-slate-950 border-slate-700">
                                                <SelectValue placeholder="Select Assignee" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {activeTeam.members.map((m: any) => (
                                                    <SelectItem key={m.user?.id || m.id} value={String(m.user?.id || m.id)}>
                                                        {m.user?.username || m.username}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between border-t border-slate-800 pt-4">
                <Button variant="ghost" onClick={onCancel}>Cancel</Button>

                {step === "auth" ? (
                    <Button onClick={fetchHierarchy} disabled={loading || !token}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Next: Select List
                    </Button>
                ) : (
                    <Button
                        onClick={() => onCommit(selectedListId, token, selectedAssigneeId)}
                        disabled={!selectedListId || loading}
                        className="bg-[#7b68ee] hover:bg-[#6c5ce7] text-white"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Push Tickets
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
