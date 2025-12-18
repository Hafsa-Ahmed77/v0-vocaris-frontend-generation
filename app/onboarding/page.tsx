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

  // progress (assume max 7 questions)
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
    } catch {
      alert("Server not responding")
    } finally {
      setLoading(false)
    }
  }

  // Submit answer
  const submitAnswer = async (finalAnswer: string) => {
    if (!finalAnswer.trim() || questionId === null) return

    try {
      setLoading(true)
      const res = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: userName,
          question_id: questionId,
          answer: finalAnswer,
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
    } catch {
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-sky-100 px-4">
      <div className="w-full max-w-xl rounded-3xl bg-gradient-to-br from-sky-200 via-white to-sky-100 shadow-xl border border-slate-200 p-8">
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

              <button
                onClick={startForm}
                className="w-full rounded-xl bg-blue-600 py-3 text-black font-semibold hover:bg-blue-700 transition"
              >
                {loading ? "Starting..." : "Start"}
              </button>
            </motion.div>
          )}

          {/* Question Step */}
          {started && !completed && (
            <motion.div
              key="question-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <p className="text-lg font-medium text-slate-800">{question}</p>

              {/* YES / NO example */}
              {questionId === 2 ? (
                <div className="flex gap-4">
                  <button
                    onClick={() => submitAnswer("yes")}
                    className="flex-1 rounded-xl border-2 border-blue-600 text-blue-600 py-3 hover:bg-blue-50 transition"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => submitAnswer("no")}
                    className="flex-1 rounded-xl border border-slate-300 py-3 hover:bg-slate-50 transition"
                  >
                    No
                  </button>
                </div>
              ) : (
                <>
                  <textarea
                    rows={4}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition"
                  />
                  <button
                    onClick={() => submitAnswer(answer)}
                    className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    {loading ? "Submitting..." : "Next"}
                  </button>
                </>
              )}
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
