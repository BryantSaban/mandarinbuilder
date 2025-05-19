"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Send,
  Mic,
  VolumeIcon as VolumeUp,
  VolumeX,
  Loader2,
  Settings,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useChat } from "ai/react"
import SettingsModal from "@/components/settings-modal"

const VALID_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"] as const

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatInterface() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isProcessingAudio, setIsProcessingAudio] = useState(false)
  const [autoPlayAudio, setAutoPlayAudio] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<typeof VALID_VOICES[number]>("alloy")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [displayMessages, setDisplayMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "你好！我是你的中文老师小美。我们今天学习什么？(Nǐ hǎo! Wǒ shì nǐ de zhōngwén lǎoshī Xiǎo Měi.)",
      role: "assistant",
      timestamp: new Date(),
    },
  ])

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isSending,
    error: sendError,
    setInput,
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        content:
          "你好！我是你的中文老师小美。我们今天学习什么？(Nǐ hǎo! Wǒ shì nǐ de zhōngwén lǎoshī Xiǎo Měi.)",
        role: "assistant",
      },
    ],
    onFinish: (msg) => processNewMessage(msg),
  })

  useEffect(() => {
    const userMsgs = messages.filter((m) => m.role === "user")
    if (userMsgs.length > displayMessages.filter((m) => m.role === "user").length) {
      const last = userMsgs[userMsgs.length - 1]
      setDisplayMessages((prev) => [
        ...prev,
        { id: last.id, content: last.content, role: "user", timestamp: new Date() },
      ])
    }
  }, [messages, displayMessages])

  const extractChineseText = (content: string) => {
    const m = content.match(/^([^(]+)/)
    return m ? m[1].trim() : ""
  }

  async function processNewMessage(message: any) {
    if (message.role !== "assistant") return
    const newMsg: Message = {
      id: message.id,
      content: message.content,
      role: "assistant",
      timestamp: new Date(),
    }
    setDisplayMessages((prev) => [...prev, newMsg])
    if (autoPlayAudio) {
      const txt = extractChineseText(message.content)
      if (txt) await handlePlayAudio(txt)
    }
  }

  async function handlePlayAudio(text: string) {
    setIsProcessingAudio(true)
    setErrorMessage(null)

    try {
      const voice = VALID_VOICES.includes(selectedVoice) ? selectedVoice : "alloy"
      console.log("Requesting TTS:", text, "voice:", voice)

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `API ${res.status}`)
      if (!data.audioData) throw new Error("No audio returned")

      await playAudioFromDataUrl(data.audioData)
      if (data.fallback) console.log("Used Google fallback TTS")
    } catch (err: any) {
      console.error("Error playing audio:", err)
      showErrorToast(`Could not play audio: ${err.message || err}`)
    } finally {
      setIsProcessingAudio(false)
    }
  }

  function showErrorToast(msg: string) {
    setErrorMessage(msg)
  }

  function playAudioFromDataUrl(dataUrl: string): Promise<void> {
    return new Promise((resolve) => {
      const audio = audioRef.current ?? new Audio()
      audioRef.current = audio

      // Clear previous handlers
      audio.oncanplaythrough = null
      audio.onended = null
      audio.onerror = null

      // Play when ready
      audio.oncanplaythrough = () => {
        audio
          .play()
          .catch((playErr) => {
            console.error("play() failed:", playErr)
            showErrorToast(`Audio playback failed: ${playErr.message || playErr}`)
          })
          .finally(resolve)
      }

      // ── ▶ Changed onerror handler here ──
      audio.onerror = () => {
        const code = audio.error?.code
        console.error("Audio element error, code=", code)
        let msg = "Failed to load audio"
        switch (code) {
          case MediaError.MEDIA_ERR_ABORTED:
            msg = "Audio playback was aborted."
            break
          case MediaError.MEDIA_ERR_NETWORK:
            msg = "Network error while loading audio."
            break
          case MediaError.MEDIA_ERR_DECODE:
            msg = "Audio decoding error."
            break
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            msg = "Audio format not supported."
            break
        }
        showErrorToast(msg)
        resolve()
      }
      // ──────────────────────────────────

      // Timeout safety
      const to = window.setTimeout(() => {
        console.warn("Audio timed out")
        showErrorToast("Audio playback timed out.")
        resolve()
      }, 8000)

      audio.onended = () => {
        clearTimeout(to)
        resolve()
      }

      // Kick things off
      audio.src = dataUrl
      audio.load()
    })
  }

  return (
    <div className="flex flex-col h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl overflow-hidden">
      <div className="flex justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Conversation Practice</h2>
        <div className="flex space-x-2">
          <Button onClick={() => setAutoPlayAudio((v) => !v)} size="sm" variant="outline">
            {autoPlayAudio ? <VolumeUp /> : <VolumeX />}
            {autoPlayAudio ? "Auto-Play On" : "Auto-Play Off"}
          </Button>
          <Button onClick={() => setIsSettingsOpen(true)} size="sm" variant="outline">
            <Settings />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={`p-3 max-w-[80%] ${
                m.role === "user" ? "bg-purple-100 rounded-tr-none" : "bg-gray-100 rounded-tl-none"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">
                  {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                {m.role === "assistant" && extractChineseText(m.content) && (
                  <Button
                    onClick={() => handlePlayAudio(extractChineseText(m.content))}
                    size="icon"
                    disabled={isProcessingAudio}
                    variant="ghost"
                  >
                    {isProcessingAudio ? <Loader2 className="animate-spin" /> : <VolumeUp />}
                  </Button>
                )}
              </div>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}

        {(sendError || errorMessage) && (
          <div className="p-3 bg-red-100 text-red-700 rounded flex items-center">
            <AlertCircle className="mr-2" />
            {sendError?.message || errorMessage}
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            disabled={isSending}
            className="flex-1"
          />
          <Button type="submit" disabled={isSending || !input.trim()}>
            {isSending ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </form>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedVoice={selectedVoice}
        setSelectedVoice={(v) => VALID_VOICES.includes(v as any) && setSelectedVoice(v as any)}
      />
    </div>
  )
}
