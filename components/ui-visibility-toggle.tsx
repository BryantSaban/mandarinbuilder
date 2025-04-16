"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Paintbrush, Eye } from "lucide-react"

export default function UIVisibilityToggle() {
  const [isUIVisible, setIsUIVisible] = useState(true)

  const toggleUIVisibility = () => {
    const newState = !isUIVisible
    setIsUIVisible(newState)

    // Apply or remove the class from the body element
    if (newState) {
      document.body.classList.remove("hide-ui")
    } else {
      document.body.classList.add("hide-ui")
    }
  }

  // Ensure the class is removed when component unmounts
  useEffect(() => {
    // Initialize - make sure UI is visible when component mounts
    document.body.classList.remove("hide-ui")

    return () => {
      document.body.classList.remove("hide-ui")
    }
  }, [])

  return (
    <Button
      variant="outline"
      size="icon"
      className={`fixed bottom-4 right-4 z-50 backdrop-blur-sm border-white/20 text-white transition-all duration-300
        ${
          isUIVisible
            ? "bg-black/30 hover:bg-black/50 dark:bg-white/30 dark:hover:bg-white/50"
            : "bg-yellow-500/50 hover:bg-yellow-500/70 dark:bg-yellow-400/50 dark:hover:bg-yellow-400/70"
        }`}
      onClick={toggleUIVisibility}
      aria-label={isUIVisible ? "Hide interface" : "Show interface"}
    >
      {isUIVisible ? <Paintbrush className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </Button>
  )
}
