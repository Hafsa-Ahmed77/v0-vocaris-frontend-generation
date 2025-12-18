"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function QuickSetupForm() {
  const router = useRouter()

  const [userName, setUserName] = useState("")
  const [started, setStarted] = useState(false)

  const [questionId, setQuestionId] = useState<number | null>(null)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  // progress (optional)
  const progress =
    questionId && questionId <= 7 ? (questionId / 7) * 100 : started ? 100 : 0

  // redirect after completion
  useEffect(() => {
    if (completed) {
      const t = setTimeout(() => {
        router.push("/onboarding-chat")
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [completed, router])

  // Start form
  const startForm = async () => {
    if (!userName.trim()) return

    try {
      setLoading(true)
      const res = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: userName }),
      })
      
      const data = await res.json()
      setQuestionId(data.question_id)
      setQuestion(data.question)
      setStarted(true)
    } catch (err) {
      alert("Server not responding")
    } finally {
      setLoading(false)
    }
  }

  // Submit answer
  const submitAnswer = async () => {
    if (!answer.trim() && answer !== "") return
    if (questionId === null) return

    try {
      setLoading(true)
      const res = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: userName,
          question_id: questionId,
          answer: answer,
        }),
      })
      
      const data = await res.json()
      setAnswer("")

      if (data.message) {
        setCompleted(true)
      } else {
        setQuestionId(data.question_id)
        setQuestion(data.question)
      }
    } catch (err) {
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden
 bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-100 px-4">
{/* background decoration */}
<div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-400/25 rounded-full blur-3xl" />
<div className="absolute top-1/3 -right-32 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl" />
<div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-400/25 rounded-full blur-3xl" />
<div className="relative z-10 w-full max-w-xl rounded-3xl bg-gradient-to-br from-sky-200 via-white to-sky-100 shadow-xl border border-slate-200 p-8">
  {/* Progress bar */}
        <div className="w-full h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {/* Title */}
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-1">
          Quick Setup
        </h2>
        <p className="text-center text-slate-600 mb-8">
          Answer a few questions to personalize your experience
        </p>

        <AnimatePresence mode="wait">
          {/* Name Step */}
          {!started && !completed && (
            <motion.div
            key="name-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border px-4 py-3 text-black font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          
            <div className="flex gap-4">
              <button
                onClick={() => router.back()}
                className="flex-1 rounded-xl border bg-sky-600 border-gray-300 py-3 font-semibold text-white-700 hover:bg-gray-100 transition"
              >
                Go Back
              </button>
          
              <button
                onClick={startForm}
                className="flex-1 rounded-xl bg-sky-600 py-3 text-white font-semibold hover:bg-blue-700 transition"
              >
                {loading ? "Starting..." : "Start"}
              </button>
            </div>
          </motion.div>
          
          )}

          {/* Question Step */}
          {started && !completed && questionId !== null && (
            <motion.div
              key="question-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <p className="text-lg font-medium text-slate-800">{question}</p>
              <textarea
                rows={4}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition"
              />
              <button
                onClick={submitAnswer}
                className="w-full rounded-xl bg-blue-600 py-3 text-black font-semibold hover:bg-blue-700 transition"
              >
                {loading ? "Submitting..." : "Next"}
              </button>
            </motion.div>
          )}

          {/* Completion Step */}
          {completed && (
            <motion.div
              key="completed-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-4 py-10"
            >
              <div className="text-4xl">🎉</div>
              <h3 className="text-2xl font-bold text-slate-900">Setup Complete</h3>
              <p className="text-slate-600">Redirecting to onboarding…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
