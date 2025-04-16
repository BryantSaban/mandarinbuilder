"use client"

import type React from "react"

import NavigationMenu from "./navigation-menu"
import ThemeToggle from "./theme-toggle"
import UIVisibilityToggle from "./ui-visibility-toggle"

interface PageLayoutProps {
  children: React.ReactNode
  backgroundImage: string
}

export default function PageLayout({ children, backgroundImage }: PageLayoutProps) {
  return (
    <main className="min-h-screen flex flex-col relative text-gray-900 dark:text-white">
      {/* Background Image */}
      <div className="fixed inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url('${backgroundImage}')` }}>
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
      </div>

      {/* Navigation Menu - will be hidden in art mode */}
      <div className="ui-element">
        <NavigationMenu />
      </div>

      {/* Theme and UI Visibility Toggles */}
      <ThemeToggle />
      <UIVisibilityToggle />

      {/* Content */}
      <div className="ui-element">{children}</div>
    </main>
  )
}
