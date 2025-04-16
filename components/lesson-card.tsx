"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen } from "lucide-react"

interface LessonCardProps {
  title: string
  description: string
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  progress?: number
  onClick?: () => void
}

export default function LessonCard({ title, description, duration, level, progress = 0, onClick }: LessonCardProps) {
  const getLevelColor = () => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card
      className="overflow-hidden border border-emerald-200 dark:border-emerald-800 hover:shadow-md transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{title}</CardTitle>
          <Badge className={getLevelColor()}>{level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{description}</p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <Clock className="h-4 w-4 mr-1" />
          <span>{duration}</span>
        </div>
        {progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-300">Progress</span>
              <span className="text-emerald-600 dark:text-emerald-400">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-emerald-500 dark:bg-emerald-400 h-2 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800/50 pt-3 pb-3">
        <Button
          variant="ghost"
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 w-full"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          {progress > 0 ? "Continue Lesson" : "Start Lesson"}
        </Button>
      </CardFooter>
    </Card>
  )
}
