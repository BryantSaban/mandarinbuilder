"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface FadeTransitionProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function FadeTransition({ href, children, className }: FadeTransitionProps) {
  const router = useRouter()
  const [isFading, setIsFading] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsFading(true)

    // Wait for fade animation to complete before navigating
    setTimeout(() => {
      router.push(href)
    }, 800) // Slower fade (800ms)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "transition-opacity duration-800 cursor-pointer", // Slower duration
        isFading ? "opacity-0" : "opacity-100",
        className,
      )}
    >
      {children}
    </div>
  )
}
