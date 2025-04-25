"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { VolumeIcon as VolumeUp, User, Bot, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isProcessingAudio: boolean
  onPlayAudio: (text: string) => Promise<void>
}

export default function ChatMessage({ content, role, timestamp, isProcessingAudio, onPlayAudio }: ChatMessageProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  // Extract Chinese text (everything before the first parenthesis)
  const getChineseText = () => {
    if (role !== "assistant") return ""
    const match = content.match(/^([^(]+)/)
    return match ? match[1].trim() : ""
  }

  const handlePlayAudio = async () => {
    const chineseText = getChineseText()
    if (!chineseText) return

    setIsPlayingAudio(true)
    try {
      await onPlayAudio(chineseText)
    } finally {
      setIsPlayingAudio(false)
    }
  }

  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      {role === "user" ? (
        <div className="bg-purple-100 dark:bg-purple-900/30 text-gray-800 dark:text-white rounded-lg rounded-tr-none p-3 max-w-[80%]">
          <div className="flex items-center mb-1">
            <User className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg rounded-tl-none p-3 max-w-[80%]">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <Bot className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            {getChineseText() && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-1 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-full ml-2"
                onClick={handlePlayAudio}
                disabled={isPlayingAudio || isProcessingAudio}
              >
                {isPlayingAudio || isProcessingAudio ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <VolumeUp className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      )}
    </div>
  )
}
