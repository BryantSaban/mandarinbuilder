"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, Bot, Mic, MicOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChat } from "ai/react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [displayMessages, setDisplayMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "你好！我是你的普通话老师。我们今天练习什么？(Hello! I'm your Mandarin teacher. What shall we practice today?)",
      role: "assistant",
      timestamp: new Date(),
    },
  ])

  // Use the AI SDK's useChat hook for handling chat state and API calls
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        content:
          "你好！我是你的普通话老师。我们今天练习什么？(Hello! I'm your Mandarin teacher. What shall we practice today?)",
        role: "assistant",
      },
    ],
    onFinish: (message) => {
      console.log("Chat finished with message:", message)
    },
  })

  // Update display messages when AI SDK messages change
  useEffect(() => {
    const updatedMessages = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      role: msg.role,
      timestamp: new Date(),
    }))

    // Skip the first message as it's already in displayMessages
    if (updatedMessages.length > 1) {
      setDisplayMessages(updatedMessages)
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [displayMessages])

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real app, this would start/stop speech recognition
  }

  return (
    <div className="flex flex-col h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-purple-300/50 dark:border-purple-500/30 overflow-hidden">
      <div className="p-4 bg-purple-500/10 dark:bg-purple-600/20 border-b border-purple-200 dark:border-purple-800">
        <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-300">Conversation Practice</h2>
        <p className="text-sm text-purple-600 dark:text-purple-400">Practice your Mandarin with our AI tutor</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.map((message) => (
          <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                message.role === "user"
                  ? "bg-purple-100 dark:bg-purple-900/30 text-gray-800 dark:text-white rounded-tr-none"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none",
              )}
            >
              <div className="flex items-center mb-1">
                {message.role === "assistant" ? (
                  <Bot className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
                ) : (
                  <User className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none">
              <div className="flex items-center mb-1">
                <Bot className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
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
