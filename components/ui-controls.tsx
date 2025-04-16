"use client"

import ThemeToggle from "./theme-toggle"
import UIVisibilityToggle from "./ui-visibility-toggle"

interface UIControlsProps {
  className?: string
}

export default function UIControls({ className }: UIControlsProps) {
  return (
    <div
      className={`fixed bottom-4 right-4 flex space-x-2 ${className} transition-opacity duration-300 hide-ui-fade-persist`}
    >
      <UIVisibilityToggle />
      <ThemeToggle />
    </div>
  )
}
