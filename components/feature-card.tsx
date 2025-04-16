"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Brain, BookOpen, MessageSquare, Map } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: "Brain" | "BookOpen" | "MessageSquare" | "Map"
  color: "red" | "darkRed" | "blue" | "purple" | "green" | "orange" | "gold"
  href: string
}

export default function FeatureCard({ title, description, icon, color, href }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getIcon = () => {
    switch (icon) {
      case "Brain":
        return <Brain className="h-8 w-8" />
      case "BookOpen":
        return <BookOpen className="h-8 w-8" />
      case "MessageSquare":
        return <MessageSquare className="h-8 w-8" />
      case "Map":
        return <Map className="h-8 w-8" />
      default:
        return <Brain className="h-8 w-8" />
    }
  }

  const getGlowColor = () => {
    switch (color) {
      case "red":
        return "from-red-500/30 to-red-500/0"
      case "darkRed":
        return "from-red-700/30 to-red-700/0"
      case "blue":
        return "from-blue-500/30 to-blue-500/0"
      case "purple":
        return "from-purple-500/30 to-purple-500/0"
      case "green":
        return "from-emerald-500/30 to-emerald-500/0"
      case "orange":
        return "from-orange-500/30 to-orange-500/0"
      case "gold":
        return "from-yellow-500/30 to-yellow-500/0"
      default:
        return "from-red-500/30 to-red-500/0"
    }
  }

  const getIconColor = () => {
    // Return yellow color for all card types
    return "text-yellow-500 group-hover:text-yellow-400"
  }

  const getTitleColor = () => {
    switch (color) {
      case "red":
        return "text-red-500"
      case "darkRed":
        return "text-red-700"
      case "blue":
        return "text-blue-500"
      case "purple":
        return "text-purple-500"
      case "green":
        return "text-emerald-500"
      case "orange":
        return "text-orange-500"
      case "gold":
        return "text-yellow-500"
      default:
        return "text-red-500"
    }
  }

  const getBackgroundImage = () => {
    switch (title) {
      case "Acquire":
        return "url('/images/acquire-bg.webp')"
      case "Learn":
        return "url('/images/learn-bg.webp')"
      case "Practice":
        return "url('/images/practice-bg.webp')"
      case "Journey":
        return "url('/images/journey-bg.png')"
      default:
        return "none"
    }
  }

  return (
    <Link href={href} className="block">
      <Card
        className={cn(
          "relative group border-zinc-800 bg-zinc-900/80 backdrop-blur-sm overflow-hidden transition-all duration-300",
          isHovered ? "scale-105" : "",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn(
            "absolute inset-0 bg-gradient-radial opacity-0 transition-opacity duration-300",
            getGlowColor(),
            isHovered ? "opacity-100" : "",
          )}
        />

        {/* Background image that fades in on hover */}
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-300",
            isHovered ? "opacity-20" : "",
          )}
          style={{ backgroundImage: getBackgroundImage() }}
        />

        <CardContent className="p-6 relative z-10">
          <div className={cn("p-3 rounded-full w-fit mb-4 transition-colors duration-300", getIconColor())}>
            {getIcon()}
          </div>

          <h3 className={cn("text-xl font-bold mb-2", getTitleColor())}>{title}</h3>
          <p className="text-zinc-400">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
