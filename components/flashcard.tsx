"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Maximize2, Minimize2, Move } from "lucide-react"
import { cn } from "@/lib/utils"
import Draggable from "react-draggable"

interface FlashcardProps {
  cards: {
    front: string
    back: string
    pinyin?: string
    examples: string[]
  }[]
}

export default function Flashcard({ cards }: FlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const nodeRef = useRef(null)

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % cards.length)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const currentCard = cards[currentIndex]

  return (
    <Draggable nodeRef={nodeRef} handle=".handle" bounds="parent">
      <div
        ref={nodeRef}
        className={cn("transition-all duration-500 ease-in-out", isExpanded ? "w-[90vw] max-w-4xl" : "w-full max-w-md")}
      >
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl border-2 border-blue-300/50 dark:border-blue-500/30 overflow-hidden">
          <div className="p-2 bg-blue-500/10 dark:bg-blue-600/20 flex justify-between items-center handle cursor-move">
            <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Card {currentIndex + 1} of {cards.length}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-700 dark:text-blue-300"
                onClick={toggleExpand}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-700 dark:text-blue-300 cursor-move">
                <Move className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "relative w-full transition-all duration-500 ease-in-out cursor-pointer",
              isExpanded ? "h-[70vh]" : "h-[40vh]",
            )}
            onClick={toggleFlip}
          >
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden transition-all duration-500 bg-amber-50/90 dark:bg-slate-800/90",
                isFlipped ? "opacity-0 rotate-y-180" : "opacity-100",
              )}
            >
              <div className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                {currentCard.front}
              </div>
              {currentCard.pinyin && (
                <div className="text-xl text-gray-600 dark:text-gray-300 mb-6">{currentCard.pinyin}</div>
              )}
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">Click to reveal meaning</div>
            </div>

            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-start p-6 backface-hidden transition-all duration-500 bg-amber-50/90 dark:bg-slate-800/90",
                isFlipped ? "opacity-100" : "opacity-0 rotate-y-180",
              )}
            >
              <div className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4">
                {currentCard.back}
              </div>

              <div className="w-full">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Example Sentences:</h3>
                <div className="space-y-3 overflow-auto max-h-[calc(100%-4rem)]">
                  {currentCard.examples.map((example, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SRS Buttons - More subtle with new color scheme */}
          <div className="p-4 flex justify-center space-x-3 bg-gray-100/90 dark:bg-gray-800/90 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              className="bg-blue-500/60 hover:bg-blue-500/70 text-white px-3 py-2 rounded-lg transition-all duration-200 flex-1 shadow-sm hover:shadow-md"
              onClick={() => console.log("Again selected")}
            >
              <div className="flex flex-col items-center w-full">
                <span className="font-medium text-white">Again</span>
                <span className="text-xs mt-1 text-white/90">10 min</span>
              </div>
            </Button>
            <Button
              variant="ghost"
              className="bg-emerald-300/60 hover:bg-emerald-300/70 text-white px-3 py-2 rounded-lg transition-all duration-200 flex-1 shadow-sm hover:shadow-md"
              onClick={() => console.log("Difficult selected")}
            >
              <div className="flex flex-col items-center w-full">
                <span className="font-medium text-white">Difficult</span>
                <span className="text-xs mt-1 text-white/90">1 day</span>
              </div>
            </Button>
            <Button
              variant="ghost"
              className="bg-green-500/60 hover:bg-green-500/70 text-white px-3 py-2 rounded-lg transition-all duration-200 flex-1 shadow-sm hover:shadow-md"
              onClick={() => console.log("Good selected")}
            >
              <div className="flex flex-col items-center w-full">
                <span className="font-medium text-white">Good</span>
                <span className="text-xs mt-1 text-white/90">3 days</span>
              </div>
            </Button>
            <Button
              variant="ghost"
              className="bg-yellow-500/60 hover:bg-yellow-500/70 text-white px-3 py-2 rounded-lg transition-all duration-200 flex-1 shadow-sm hover:shadow-md"
              onClick={() => console.log("Perfect selected")}
            >
              <div className="flex flex-col items-center w-full">
                <span className="font-medium text-white">Perfect</span>
                <span className="text-xs mt-1 text-white/90">7 days</span>
              </div>
            </Button>
          </div>
          {/* End of SRS Buttons section */}
        </Card>
      </div>
    </Draggable>
  )
}
