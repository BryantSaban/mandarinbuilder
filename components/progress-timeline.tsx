"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const milestones = [
  { sentences: 5, label: "Beginner", unlocks: "Night City", achieved: true },
  { sentences: 10, label: "Novice", unlocks: "Bamboo Forest", achieved: true },
  { sentences: 25, label: "Apprentice I", unlocks: "Night Village", achieved: false },
  { sentences: 50, label: "Apprentice II", unlocks: "Shanghai Skyline", achieved: false },
  { sentences: 100, label: "Intermediate", unlocks: "Great Wall", achieved: false },
  { sentences: 200, label: "Advanced", unlocks: "Forbidden City", achieved: false },
  { sentences: 250, label: "Expert", unlocks: "Li River", achieved: false },
  { sentences: 300, label: "Master", unlocks: "Temple of Heaven", achieved: false },
  { sentences: 500, label: "Grandmaster", unlocks: "Dragon's Gate", achieved: false },
  { sentences: 1000, label: "Legendary", unlocks: "Celestial Palace", achieved: false },
]

export default function ProgressTimeline() {
  const [activeIndex, setActiveIndex] = useState(1) // Example: user has reached 10 sentences
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="relative max-w-4xl mx-auto py-10">
      {/* Timeline line */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-700 -translate-y-1/2"></div>

      {/* Progress overlay */}
      <div
        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-yellow-600 to-yellow-400 dark:from-yellow-500 dark:to-yellow-300 -translate-y-1/2"
        style={{ width: `${((activeIndex + 1) / milestones.length) * 100}%` }}
      ></div>

      {/* Milestone points */}
      <div className="relative flex justify-between">
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full border-2 z-10 transition-all duration-300 flex items-center justify-center",
                index <= activeIndex
                  ? "border-yellow-500 bg-yellow-500 dark:border-yellow-400 dark:bg-yellow-400"
                  : "border-gray-400 bg-gray-200 dark:border-gray-600 dark:bg-gray-700",
                hoveredIndex === index && "scale-125",
              )}
            >
              <span
                className={cn(
                  "font-bold text-xs",
                  index <= activeIndex ? "text-white" : "text-gray-700 dark:text-gray-200",
                )}
              >
                {milestone.sentences}
              </span>
            </div>

            {/* Milestone label - only shown on hover */}
            <div
              className={cn(
                "absolute top-12 -translate-x-1/2 transition-all duration-300 text-center bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg shadow-md border border-yellow-200 dark:border-yellow-800",
                hoveredIndex === index ? "opacity-100 scale-100 z-20" : "opacity-0 scale-90 pointer-events-none",
              )}
            >
              <p className="font-bold whitespace-nowrap text-gray-800 dark:text-white">
                {milestone.sentences} Sentences
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{milestone.label}</p>
              <p
                className={cn(
                  "text-xs mt-1",
                  index <= activeIndex ? "text-yellow-600 dark:text-yellow-400" : "text-gray-500 dark:text-gray-400",
                )}
              >
                Unlocks: {milestone.unlocks}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
