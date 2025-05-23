"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2, VolumeIcon as VolumeUp, VolumeX } from "lucide-react"
import { useChat } from "ai/react"
import ChatMessage from "./chat-message"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChineseChatbot() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [autoPlayAudio, setAutoPlayAudio] = useState(false)
  const [isProcessingAudio, setIsProcessingAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [displayMessages, setDisplayMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "你好！我是你的中文老师小美。我们今天学习什么？(Nǐ hǎo! Wǒ shì nǐ de zhōngwén lǎoshī Xiǎo Měi. Wǒmen jīntiān xuéxí shénme?) Hello! I'm your Chinese teacher, Xiao Mei. What shall we learn today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])

  // Use the AI SDK's useChat hook for handling chat state and API calls
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        content:
          "你好！我是你的中文老师小美。我们今天学习什么？(Nǐ hǎo! Wǒ shì nǐ de zhōngwén lǎoshī Xiǎo Měi. Wǒmen jīntiān xuéxí shénme?) Hello! I'm your Chinese teacher, Xiao Mei. What shall we learn today?",
        role: "assistant",
      },
    ],
    onFinish: (message) => {
      processNewMessage(message)
    },
  })

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()
    }

    return () => {
      // Clean up audio element
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  // Process new message from AI
  const processNewMessage = async (message: any) => {
    if (message.role === "assistant") {
      const newMessage = {
        id: message.id,
        content: message.content,
        role: "assistant" as const,
        timestamp: new Date(),
      }

      setDisplayMessages((prev) => [...prev, newMessage])

      // Auto-play audio if enabled
      if (autoPlayAudio) {
        const chineseText = extractChineseText(message.content)
        if (chineseText) {
          await handlePlayAudio(chineseText)
        }
      }
    }
  }

  // Extract Chinese text from message
  const extractChineseText = (content: string): string => {
    const match = content.match(/^([^(]+)/)
    return match ? match[1].trim() : ""
  }

  // Handle playing audio for a message
  const handlePlayAudio = async (text: string) => {
    setIsProcessingAudio(true)
    try {
      // Get the audio data from our API
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error("Failed to get audio data")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.audioData) {
        await playAudioFromDataUrl(data.audioData)
      } else {
        throw new Error("No audio data received")
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      showErrorToast("Could not play audio. Please try again.")
    } finally {
      setIsProcessingAudio(false)
    }
  }

  // Play audio from data URL
  const playAudioFromDataUrl = (dataUrl: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!audioRef.current) {
        audioRef.current = new Audio()
      }

      const audio = audioRef.current

      // Remove any existing event listeners
      audio.oncanplaythrough = null
      audio.onended = null
      audio.onerror = null

      // Set up new event listeners
      audio.oncanplaythrough = () => {
        audio.play().catch((err) => {
          console.error("Audio play error:", err)
          showErrorToast("Failed to play audio. Your browser might be blocking autoplay.")
          resolve()
        })
      }

      audio.onended = () => {
        resolve()
      }

      audio.onerror = (e) => {
        // Create a more descriptive error message
        console.error("Audio error:", e)
        let errorMsg = "Failed to load audio"

        if (audio.error) {
          // Add specific error code information if available
          switch (audio.error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMsg = "Audio playback was aborted"
              break
            case MediaError.MEDIA_ERR_NETWORK:
              errorMsg = "Network error while loading audio"
              break
            case MediaError.MEDIA_ERR_DECODE:
              errorMsg = "Audio decoding error"
              break
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMsg = "Audio format not supported by your browser"
              break
          }
        }

        showErrorToast(errorMsg)
        resolve()
      }

      // Set a timeout in case the audio never loads or plays
      const timeout = setTimeout(() => {
        console.warn("Audio playback timeout")
        showErrorToast("Audio playback timed out. Please try again.")
        resolve()
      }, 5000)

      // Update onended to clear the timeout
      const originalOnEnded = audio.onended
      audio.onended = () => {
        clearTimeout(timeout)
        if (originalOnEnded) {
          originalOnEnded.call(audio)
        }
        resolve()
      }

      try {
        // Set the source and load
        audio.src = dataUrl
        audio.load()
      } catch (err) {
        console.error("Error setting audio source:", err)
        showErrorToast("Error preparing audio playback")
        clearTimeout(timeout)
        resolve()
      }
    })
  }

  // Helper function to show error toast
  const showErrorToast = (message: string) => {
    const errorMessage = document.createElement("div")
    errorMessage.textContent = message
    errorMessage.style.cssText =
      "position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(220, 38, 38, 0.9); color: white; padding: 8px 16px; border-radius: 4px; z-index: 9999;"
    document.body.appendChild(errorMessage)
    setTimeout(() => {
      document.body.removeChild(errorMessage)
    }, 3000)
  }

  // Update display messages when user sends a message
  useEffect(() => {
    const userMessages = messages.filter((msg) => msg.role === "user")
    const displayUserMessages = displayMessages.filter((msg) => msg.role === "user")

    if (userMessages.length > displayUserMessages.length) {
      const latestUserMsg = userMessages[userMessages.length - 1]
      setDisplayMessages((prev) => [
        ...prev,
        {
          id: latestUserMsg.id,
          content: latestUserMsg.content,
          role: "user",
          timestamp: new Date(),
        },
      ])
    }
  }, [messages, displayMessages])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [displayMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex flex-col h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-purple-300/50 dark:border-purple-500/30 overflow-hidden">
      <div className="p-4 bg-purple-500/10 dark:bg-purple-600/20 border-b border-purple-200 dark:border-purple-800 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-300">Chinese Conversation Practice</h2>
          <p className="text-sm text-purple-600 dark:text-purple-400">Practice your Mandarin with Xiao Mei</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className={`border-purple-200 dark:border-purple-700 ${
            autoPlayAudio
              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
              : "text-purple-600 dark:text-purple-400"
          }`}
          onClick={() => setAutoPlayAudio(!autoPlayAudio)}
        >
          {autoPlayAudio ? (
            <>
              <VolumeUp className="h-4 w-4 mr-2" />
              Auto-Play On
            </>
          ) : (
            <>
              <VolumeX className="h-4 w-4 mr-2" />
              Auto-Play Off
            </>
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            role={message.role}
            timestamp={message.timestamp}
            isProcessingAudio={isProcessingAudio}
            onPlayAudio={handlePlayAudio}
          />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none">
              <div className="flex items-center mb-1">
                <div className="flex items-center space-x-1">
                  <div className="animate-bounce h-2 w-2 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
                  <div
                    className="animate-bounce h-2 w-2 bg-purple-500 dark:bg-purple-400 rounded-full"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="animate-bounce h-2 w-2 bg-purple-500 dark:bg-purple-400 rounded-full"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
            Error: {error.message || "Failed to send message. Please try again."}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-purple-200 dark:border-purple-800 bg-gray-50 dark:bg-gray-800/50">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="border-purple-200 dark:border-purple-700 focus:ring-purple-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
