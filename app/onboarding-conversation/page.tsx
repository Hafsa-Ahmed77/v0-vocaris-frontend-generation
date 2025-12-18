"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

type Transcript = { speaker: "user" | "agent"; text: string }

export default function OnboardingConversation() {
    const router = useRouter()
  const [status, setStatus] =
    useState<"disconnected" | "connecting" | "connected">("disconnected")
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [userName, setUserName] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [agentSpeaking, setAgentSpeaking] = useState(false)

  const wsRef = useRef<WebSocket | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  /* ---------------- LOG HELPER ---------------- */
  const log = (...args: any[]) => {
    console.log("[Onboarding]", ...args)
  }

  /* ---------------- AUDIO PLAY ---------------- */
  const playAudio = async (base64: string) => {
    setAgentSpeaking(true)
    log("Agent audio received")

    const audio = new Audio(`data:audio/mp3;base64,${base64}`)
    audio.onended = () => {
      setAgentSpeaking(false)
      log("Agent finished speaking")
    }

    await audio.play()
  }
  

  /* ---------------- START MEETING ---------------- */
  const startMeeting = async () => {
    if (!userName.trim()) return alert("Enter your name")

    setStatus("connecting")
    log("Connecting…")

    const res = await fetch("/api/voice-meeting-proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_name: userName,
        enable_dynamic_questions: true,
      }),
    })

    const data = await res.json()
    log("Session started", data.session_id)

    const ws = new WebSocket(data.websocket_url)
    wsRef.current = ws

    ws.onopen = async () => {
      setStatus("connected")
      log("WebSocket connected")

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      recorderRef.current = recorder

      recorder.ondataavailable = e => {
        if (e.data.size) audioChunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        audioChunksRef.current = []

        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = reader.result?.toString().split(",")[1]
          ws.send(
            JSON.stringify({ event: "audio.input", data: { audio: base64 } })
          )
          log("Audio sent")
        }
        reader.readAsDataURL(blob)
      }
    }

    ws.onmessage = e => {
      const msg = JSON.parse(e.data)

      if (msg.event === "audio.output") playAudio(msg.data.audio)

      if (msg.event === "message") {
        setTranscripts(p => [
          ...p,
          { speaker: msg.data.type, text: msg.data.text },
        ])
      }
    }

    ws.onclose = () => {
      log("WebSocket closed")
      setStatus("disconnected")
      setIsRecording(false)
      setAgentSpeaking(false)
    }
  }

  /* ---------------- END MEETING ---------------- */
  const endMeeting = () => {
    wsRef.current?.send(JSON.stringify({ event: "end_meeting" }))
    wsRef.current?.close()
    log("Meeting ended")
  }

  /* ---------------- MIC TOGGLE ---------------- */
  const toggleMic = () => {
    if (!recorderRef.current || agentSpeaking) return

    if (!isRecording) {
      audioChunksRef.current = []
      recorderRef.current.start()
      setIsRecording(true)
      log("Recording started")
    } else {
      recorderRef.current.stop()
      setIsRecording(false)
      log("Recording stopped")
    }
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center p-6">
    <div className="w-full max-w-3xl bg-slate-800 rounded-2xl p-6 text-white shadow-xl relative">

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 text-sm bg-slate-700 px-3 py-1 rounded hover:bg-slate-600"
      >
        ⬅ Back
      </button>
      <h1 className="text-2xl font-bold mb-4 text-center">
          Conversational Onboarding
        </h1>

        <input
          value={userName}
          onChange={e => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="w-full mb-4 p-3 rounded bg-slate-700 border border-slate-600 placeholder-slate-400"
        />

        <div className="flex gap-3 mb-4 justify-center flex-wrap">
          <button onClick={startMeeting} className="btn blue">Start</button>
          <button onClick={endMeeting} className="btn red">End</button>

          <button
            onClick={toggleMic}
            disabled={status !== "connected" || agentSpeaking}
            className={`mic ${isRecording ? "recording" : ""}`}
          >
            🎙️ {isRecording ? "Stop" : "Speak"}
          </button>
        </div>
        {/* Status */}
        <div className="flex items-center gap-3 mb-3 text-sm">
          <span>Status:</span>
          <span className={
            status === "connected" ? "text-green-400" :
            status === "connecting" ? "text-yellow-400" :
            "text-red-400"
          }>
            {status}
          </span>

          {agentSpeaking && (
            <span className="badge">🗣️ Agent speaking…</span>
          )}
        </div>

        {/* Waveform */}
        {agentSpeaking && (
          <div className="waveform mb-3">
            <span /><span /><span /><span /><span />
          </div>
        )}

        {/* Conversation */}
        <div className="h-64 bg-slate-700 rounded-lg p-3 overflow-y-auto">
          {transcripts.length === 0 && (
            <p className="text-center text-slate-300 mt-24">
              Conversation will appear here…
            </p>
          )}

          {transcripts.map((t, i) => (
            <div
              key={i}
              className={`mb-2 p-2 rounded-lg max-w-[80%]
                ${t.speaker === "user"
                  ? "bg-blue-600 ml-auto"
                  : "bg-purple-600"}`}
            >
              <b>{t.speaker === "user" ? "You" : "Agent"}:</b> {t.text}
            </div>
          ))}
        </div>

        {/* Styles */}
        <style jsx>{`
          .btn {
            padding: 10px 16px;
            border-radius: 8px;
            font-weight: 600;
          }
          .btn.blue { background:#2563eb }
          .btn.red { background:#dc2626 }

          .mic {
            padding: 12px 22px;
            border-radius: 999px;
            background:#16a34a;
            font-weight:700;
          }
          .mic.recording {
            background:#dc2626;
            animation:pulse 1.2s infinite;
          }

          .badge {
            background:#7c3aed;
            padding:4px 10px;
            border-radius:999px;
            font-size:12px;
          }

          .waveform {
            display:flex;
            gap:4px;
            height:20px;
          }
          .waveform span {
            width:4px;
            background:#a78bfa;
            animation:wave 1s infinite ease-in-out;
          }
          .waveform span:nth-child(2){animation-delay:.1s}
          .waveform span:nth-child(3){animation-delay:.2s}
          .waveform span:nth-child(4){animation-delay:.3s}
          .waveform span:nth-child(5){animation-delay:.4s}

          @keyframes wave {
            0%,100%{height:6px}
            50%{height:20px}
          }
          @keyframes pulse {
            0%{box-shadow:0 0 0 0 rgba(220,38,38,.7)}
            70%{box-shadow:0 0 0 14px rgba(220,38,38,0)}
            100%{box-shadow:0 0 0 0 rgba(220,38,38,0)}
          }
        `}</style>

      </div>
    </div>
  )
}
