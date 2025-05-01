"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Award, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import ProgressTimeline from "@/components/progress-timeline"
import PageLayout from "@/components/page-layout"
import { cn } from "@/lib/utils"

export default function ProgressPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBackground, setSelectedBackground] = useState(1) // 0-based index

  const backgrounds = [
    { name: "Night City", unlocked: true },
    { name: "Bamboo Forest", unlocked: true },
    { name: "Shanghai Skyline", unlocked: false },
    { name: "Night Village", unlocked: true }, // New background
    { name: "Great Wall", unlocked: false },
    { name: "Forbidden City", unlocked: false },
    { name: "Li River", unlocked: false },
    { name: "Temple of Heaven", unlocked: false },
    { name: "Dragon's Gate", unlocked: false },
    { name: "Celestial Palace", unlocked: false }, // 1000-level background
  ]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <PageLayout backgroundImage="/images/journey-bg-chinese.png">
      <div
        className="container mx-auto px-4 py-12 flex-1 flex flex-col relative z-10 transition-opacity duration-800"
        style={{ opacity: isLoading ? 0 : 1 }}
      >
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-yellow-600 dark:text-yellow-400 text-center">
            Your Learning Journey
          </h1>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Sentence Milestones</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Hover over each milestone to see details. Your current progress: 10 sentences.
            </p>
            <ProgressTimeline />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <Award className="h-10 w-10 text-yellow-500 dark:text-yellow-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Current Level</h3>
                  <p className="text-yellow-600 dark:text-yellow-400 font-semibold">Novice</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <TrendingUp className="h-10 w-10 text-yellow-500 dark:text-yellow-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Sentences Mastered</h3>
                  <p className="text-yellow-600 dark:text-yellow-400 font-semibold">10 / 1000</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <Calendar className="h-10 w-10 text-yellow-500 dark:text-yellow-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Learning Streak</h3>
                  <p className="text-yellow-600 dark:text-yellow-400 font-semibold">5 days</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border-l-4 border-yellow-500 dark:border-yellow-400">
              <p className="text-gray-800 dark:text-white">
                <span className="font-semibold">Ultimate Goal:</span> Reach 1000 sentences to unlock the legendary{" "}
                <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Celestial Palace</span> background!
              </p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Unlocked Backgrounds</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {backgrounds.map((bg, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2",
                    bg.unlocked
                      ? index === selectedBackground
                        ? "border-yellow-500 dark:border-yellow-400"
                        : "border-transparent hover:border-yellow-300 dark:hover:border-yellow-600"
                      : "border-transparent opacity-50 cursor-not-allowed",
                  )}
                  onClick={() => bg.unlocked && setSelectedBackground(index)}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        index === 0
                          ? "url('/images/journey-bg.png')"
                          : index === 1
                            ? "url('/images/acquire-bg.webp')"
                            : index === 3
                              ? "url('/images/night-village-bg.png')"
                              : "url('/placeholder.svg?height=100&width=200')",
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                    <span className="text-xs text-white font-medium">{bg.name}</span>
                  </div>
                  {!bg.unlocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-xs text-white">Locked</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute bottom-8 left-8 z-20">
        <Link href="/journey">
          <Button
            variant="outline"
            className="bg-black/30 dark:bg-white/10 border-white/20 dark:border-gray-700 text-white dark:text-gray-200 hover:bg-black/50 dark:hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journey
          </Button>
        </Link>
      </div>
    </PageLayout>
  )
}
