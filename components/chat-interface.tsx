"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, Bot, Mic, MicOff, Loader2, VolumeIcon as VolumeUp, VolumeX, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChat } from "ai/react"
import { cleanupAudio } from "@/lib/audio-utils"
import SettingsModal from "@/components/settings-modal"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [autoPlayAudio, setAutoPlayAudio] = useState(false)
  const [isProcessingAudio, setIsProcessingAudio] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [voiceChatEnabled, setVoiceChatEnabled] = useState(true)
  const [selectedVoice, setSelectedVoice] = useState("alloy")
  const [displayMessages, setDisplayMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "你好！我是你的中文老师小美。我们今天学习什么？(Nǐ hǎo! Wǒ shì nǐ de zhōngwén lǎoshī Xiǎo Měi. Wǒmen jīntiān xuéxí shénme?) Hello! I'm your Chinese teacher, Xiao Mei. What shall we learn today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Use the AI SDK's useChat hook for handling chat state and API calls
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setInput } = useChat({
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

  // Initialize speech recognition
  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined") {
      // Check if the browser supports the Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        // Create a new recognition instance
        const recognition = new SpeechRecognition()

        // Configure recognition
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "zh-CN" // Set language to Mandarin Chinese, but can be changed to English

        // Set up event handlers
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("")

          setInput(transcript)

          // If this is a final result
          if (event.results[0].isFinal) {
            // Auto submit after a short delay
            setTimeout(() => {
              const submitEvent = new Event("submit", { cancelable: true, bubbles: true })
              document.querySelector("form")?.dispatchEvent(submitEvent)
            }, 500)
          }
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error", event)
          setIsRecording(false)
        }

        recognition.onend = () => {
          setIsRecording(false)
        }

        // Store the recognition instance in the ref
        recognitionRef.current = recognition
      }
    }

    // Create audio element
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()
    }

    return () => {
      // Clean up
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      cleanupAudio()

      // Clean up audio element
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [setInput])

  // Extract Chinese text from message
  const extractChineseText = (content: string): string => {
    const match = content.match(/^([^(]+)/)
    return match ? match[1].trim() : ""
  }

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

  // Handle playing audio for a message
  const handlePlayAudio = async (text: string) => {
    setIsProcessingAudio(true)
    try {
      console.log("Requesting TTS for text:", text.substring(0, 20) + "...")

      // Get the audio data from our API
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, voice: selectedVoice }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${data.error || "Unknown error"}`)
      }

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.audioData) {
        console.log("Audio data received, playing audio...")
        await playAudioFromDataUrl(data.audioData)
        if (data.fallback) {
          console.log("Used fallback TTS service")
        }
      } else {
        throw new Error("No audio data received from API")
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      showErrorToast(`Could not play audio: ${error instanceof Error ? error.message : "Unknown error"}`)
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
          resolve()
        })
      }

      audio.onended = () => {
        resolve()
      }

      audio.onerror = (e) => {
        console.error("Audio error:", e)
        resolve()
      }

      // Set a timeout in case the audio never loads or plays
      const timeout = setTimeout(() => {
        console.warn("Audio playback timeout")
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

      // Set the source and load
      audio.src = dataUrl
      audio.load()
    })
  }

  // Helper function to show error toast
  const showErrorToast = (message: string) => {
    const errorMessage = document.createElement("div")
    errorMessage.textContent = message
    errorMessage.style.cssText =
      "position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(220, 38, 38, 0.9); color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; font-size: 14px; max-width: 80%; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
    document.body.appendChild(errorMessage)

    console.error("Error toast shown:", message)

    setTimeout(() => {
      document.body.removeChild(errorMessage)
    }, 5000) // Show for 5 seconds instead of 3
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

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      console.error("Speech recognition not available")
      return
    }

    if (isRecording) {
      // Stop listening
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      // Start listening
      setInput("")
      setIsRecording(true)

      try {
        recognitionRef.current.start()
      } catch (err) {
        console.error("Failed to start speech recognition:", err)
        setIsRecording(false)
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-purple-300/50 dark:border-purple-500/30 overflow-hidden">
      <div className="p-4 bg-purple-500/10 dark:bg-purple-600/20 border-b border-purple-200 dark:border-purple-800 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-300">Conversation Practice</h2>
          <p className="text-sm text-purple-600 dark:text-purple-400">Practice your Mandarin with Xiao Mei</p>
        </div>
        <div className="flex space-x-2">
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
          <Button
            variant="outline"
            size="sm"
            className="border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.map((message) => (
          <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
            {message.role === "user" ? (
              <div className="bg-purple-100 dark:bg-purple-900/30 text-gray-800 dark:text-white rounded-lg rounded-tr-none p-3 max-w-[80%]">
                <div className="flex items-center mb-1">
                  <User className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg rounded-tl-none p-3 max-w-[80%]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <Bot className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {extractChineseText(message.content) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-1 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-full ml-2"
                      onClick={() => handlePlayAudio(extractChineseText(message.content))}
                      disabled={isProcessingAudio}
                    >
                      {isProcessingAudio ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <VolumeUp className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            )}
          </div>
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
          {voiceChatEnabled && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={cn(
                "border-purple-200 dark:border-purple-700",
                isRecording ? "text-red-600 dark:text-red-400 animate-pulse" : "text-purple-600 dark:text-purple-400",
              )}
              onClick={toggleRecording}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          )}
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder={isRecording ? "Listening..." : "Type your message..."}
            className="border-purple-200 dark:border-purple-700 focus:ring-purple-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading || (!input.trim() && !isRecording)}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        voiceChatEnabled={voiceChatEnabled}
        setVoiceChatEnabled={setVoiceChatEnabled}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
      />
    </div>
  )
}
