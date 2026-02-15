"use client"

import { useEffect, useRef } from "react"

interface VoiceVisualizerProps {
    stream: MediaStream | null
    isRecording: boolean
}

export function VoiceVisualizer({ stream, isRecording }: VoiceVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()
    const audioContextRef = useRef<AudioContext>()
    const analyserRef = useRef<AnalyserNode>()
    const sourceRef = useRef<MediaStreamAudioSourceNode>()

    useEffect(() => {
        if (!stream || !isRecording || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Initialize Audio Context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        audioContextRef.current = audioContext

        const analyser = audioContext.createAnalyser()
        analyser.fftSize = 256
        analyserRef.current = analyser

        const source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)
        sourceRef.current = source

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        const draw = () => {
            if (!isRecording) return

            animationRef.current = requestAnimationFrame(draw)

            analyser.getByteFrequencyData(dataArray)

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const barWidth = (canvas.width / bufferLength) * 2.5
            let barHeight
            let x = 0

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2

                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
                gradient.addColorStop(0, "#a78bfa") // purple-400
                gradient.addColorStop(1, "#2563eb") // blue-600

                ctx.fillStyle = gradient
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

                x += barWidth + 1
            }
        }

        draw()

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
            if (audioContextRef.current) audioContextRef.current.close()
        }
    }, [stream, isRecording])

    return <canvas ref={canvasRef} width={300} height={100} className="w-full h-24" />
}
