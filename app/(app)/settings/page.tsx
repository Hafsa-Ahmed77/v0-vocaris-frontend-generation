"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  return (
    <Tabs defaultValue="account" className="space-y-4">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
        <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your profile and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-summary">Daily summary email</Label>
              <Switch id="daily-summary" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="timezone">Timezone</Label>
              <Select>
                <SelectTrigger id="timezone" className="w-56">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="pst">PST</SelectItem>
                  <SelectItem value="est">EST</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => toast({ title: "Saved", description: "Your account settings were saved." })}>
              Save changes
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="integrations">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>Connect Slack, ClickUp, and Google Calendar.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {["Slack", "ClickUp", "Google Calendar"].map((name) => (
              <div key={name} className="rounded-xl border p-4">
                <div className="font-medium">{name}</div>
                <p className="text-sm text-muted-foreground">Status: Not connected</p>
                <Button className="mt-3 bg-transparent" variant="outline">
                  Connect
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="privacy">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="recording-consent">Recording consent prompts</Label>
              <Switch id="recording-consent" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="data-retention">Data retention</Label>
              <Select>
                <SelectTrigger id="data-retention" className="w-56">
                  <SelectValue placeholder="60 days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => alert("Saved!")}>Save changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
