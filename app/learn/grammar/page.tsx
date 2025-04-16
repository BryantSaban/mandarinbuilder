"use client"

import { useState, useEffect } from "react"
import NavigationMenu from "@/components/navigation-menu"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, BarChart, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import LessonCard from "@/components/lesson-card"
import ThemeToggle from "@/components/theme-toggle"

// Sample lesson data
const sampleLessons = [
  {
    id: "1",
    title: "Basic Sentence Structure",
    description: "Learn the fundamental structure of Mandarin sentences and how to form simple statements.",
    duration: "20 min",
    level: "Beginner" as const,
    progress: 75,
  },
  {
    id: "2",
    title: "Question Words",
    description: "Master the different question words in Mandarin and how to form various types of questions.",
    duration: "25 min",
    level: "Beginner" as const,
    progress: 30,
  },
  {
    id: "3",
    title: "Measure Words",
    description: "Understand the concept of measure words and how they're used with nouns in Mandarin.",
    duration: "30 min",
    level: "Beginner" as const,
    progress: 0,
  },
  {
    id: "4",
    title: "Past Tense Expressions",
    description: "Learn how to express past actions and events in Mandarin Chinese.",
    duration: "35 min",
    level: "Intermediate" as const,
    progress: 0,
  },
  {
    id: "5",
    title: "Comparative Structures",
    description: "Master how to make comparisons between objects, people, and concepts in Mandarin.",
    duration: "40 min",
    level: "Intermediate" as const,
    progress: 0,
  },
  {
    id: "6",
    title: "Complex Sentence Patterns",
    description: "Learn advanced sentence structures for expressing complex ideas and relationships.",
    duration: "45 min",
    level: "Advanced" as const,
    progress: 0,
  },
]

export default function GrammarPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen flex flex-col relative text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900">
      {/* Background Image */}
      <div className="fixed inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/images/learn-bg.webp')" }}>
        <div className="absolute inset-0 bg-black/20 dark:bg-black/50" />
      </div>

      {/* Navigation Menu */}
      <NavigationMenu />
      <ThemeToggle />

      {/* Content */}
      <div
        className="container mx-auto px-4 py-20 flex-1 flex flex-col justify-center items-center relative z-10 transition-opacity duration-800"
        style={{ opacity: isLoading ? 0 : 1 }}
      >
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-emerald-600 dark:text-emerald-400 text-center">
            Grammar Lessons
          </h1>

          <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-emerald-200 dark:border-emerald-800 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Learning Path</h2>
              <Button
                variant="outline"
                className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
              >
                <BarChart className="h-4 w-4 mr-2" />
                View Progress
              </Button>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1 text-emerald-500 dark:text-emerald-400" />
                <span>2 lessons completed</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-emerald-500 dark:text-emerald-400" />
                <span>45 minutes learned</span>
              </div>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
              <div className="bg-emerald-500 dark:bg-emerald-400 h-2 rounded-full" style={{ width: "15%" }} />
            </div>
            <p className="text-xs text-right text-gray-600 dark:text-gray-400">15% of beginner course completed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                title={lesson.title}
                description={lesson.description}
                duration={lesson.duration}
                level={lesson.level}
                progress={lesson.progress}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute bottom-8 left-8 z-20">
        <Link href="/learn">
          <Button
            variant="outline"
            className="bg-white/30 dark:bg-black/30 border-emerald-200 dark:border-white/20 text-emerald-700 dark:text-white hover:bg-white/50 dark:hover:bg-black/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Learn
          </Button>
        </Link>
      </div>
      {/* Next button */}
      <div className="absolute bottom-8 right-8 z-20">
        <Link href="/practice">
          <Button
            variant="outline"
            className="bg-black/30 dark:bg-white/10 border-white/20 dark:border-gray-700 text-white dark:text-gray-200 hover:bg-black/50 dark:hover:bg-white/20"
          >
            Next to Practice
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </main>
  )
}
