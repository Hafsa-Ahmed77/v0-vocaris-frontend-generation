"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

const steps = [
  { id: "name", title: "Your name" },
  { id: "role", title: "Your role" },
  { id: "org", title: "Organization" },
  { id: "style", title: "Communication style" },
] as const

export default function OnboardingPage() {
  const [index, setIndex] = useState(0)
  const [form, setForm] = useState({ name: "", role: "", org: "", style: "" })
  const router = useRouter()
  const progress = ((index + 1) / steps.length) * 100

  function next() {
    if (index < steps.length - 1) setIndex((i) => i + 1)
    else router.push("/dashboard")
  }
  function back() {
    if (index > 0) setIndex((i) => i - 1)
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Quick onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" aria-label="Onboarding progress" />
          <div className="mt-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={steps[index].id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {steps[index].id === "name" && (
                  <div>
                    <Label htmlFor="name">What should we call you?</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Alex"
                    />
                  </div>
                )}
                {steps[index].id === "role" && (
                  <div>
                    <Label htmlFor="role">Your role</Label>
                    <Input
                      id="role"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="e.g. Product Manager"
                    />
                  </div>
                )}
                {steps[index].id === "org" && (
                  <div>
                    <Label htmlFor="org">Organization</Label>
                    <Input
                      id="org"
                      value={form.org}
                      onChange={(e) => setForm({ ...form, org: e.target.value })}
                      placeholder="e.g. Acme Inc."
                    />
                  </div>
                )}
                {steps[index].id === "style" && (
                  <div>
                    <Label htmlFor="style">Communication style</Label>
                    <Input
                      id="style"
                      value={form.style}
                      onChange={(e) => setForm({ ...form, style: e.target.value })}
                      placeholder="e.g. concise, data-driven"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button variant="ghost" onClick={back} disabled={index === 0} aria-disabled={index === 0}>
              Back
            </Button>
            <Button onClick={next}>{index === steps.length - 1 ? "Finish" : "Continue"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
