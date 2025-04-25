"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface WordBubbleProps {
  word: string
  pinyin: string
  definition: string
}

export default function WordBubble({ word, pinyin, definition }: WordBubbleProps) {
  const [saved, setSaved] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSaved(true)
    // In a real app, this would save the word to the user's flashcard deck
    console.log(`Saved word: ${word} (${pinyin}) - ${definition}`)

    // Reset saved state after 2 seconds
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative px-3 py-1.5 bg-black/70 text-white rounded-full text-lg transition-all duration-300",
              "hover:bg-black/80 group",
              hovered ? "scale-110" : "scale-100",
            )}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {word}
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-purple-600 text-white opacity-0 transition-opacity duration-500",
                hovered && "opacity-100",
              )}
              onClick={handleSave}
            >
              <Plus className="h-4 w-4" />
            </Button>

            {saved && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-green-600 text-white px-2 py-1 rounded animate-fade-in">
                Saved!
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-white dark:bg-gray-800 p-3 border border-purple-200 dark:border-purple-800"
        >
          <div className="text-center">
            <p className="text-purple-600 dark:text-purple-400 font-medium">{pinyin}</p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{definition}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
