"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-4 right-16 z-50 bg-black/30 backdrop-blur-sm border-white/20 text-white hover:bg-black/50 dark:bg-white/30 dark:hover:bg-white/50 theme-toggle transition-colors duration-300"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 transition-transform duration-300 hover:rotate-90" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
      )}
    </Button>
  )
}
