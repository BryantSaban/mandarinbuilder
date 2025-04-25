"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Home, Brain, BookOpen, MessageSquare, Map, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const menuItems = [
    { name: "Home", href: "/", icon: <Home className="h-5 w-5 mr-2" /> },
    { name: "Acquire", href: "/acquire", icon: <Brain className="h-5 w-5 mr-2" /> },
    { name: "Learn", href: "/learn", icon: <BookOpen className="h-5 w-5 mr-2" /> },
    { name: "Practice", href: "/practice", icon: <MessageSquare className="h-5 w-5 mr-2" /> },
    { name: "Journey", href: "/journey", icon: <Map className="h-5 w-5 mr-2" /> },
    { name: "Chinese Chatbot", href: "/chinese-chatbot", icon: <MessageCircle className="h-5 w-5 mr-2" /> },
  ]

  return (
    <div className="fixed top-0 left-0 z-50">
      {/* Hamburger button */}
      <button
        onClick={toggleMenu}
        className="m-4 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors duration-200 dark:bg-white/20 dark:hover:bg-white/30"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white dark:text-gray-900" />
        ) : (
          <Menu className="h-6 w-6 text-white dark:text-gray-900" />
        )}
      </button>

      {/* Navigation menu */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-black/80 backdrop-blur-md transform transition-transform duration-300 ease-in-out dark:bg-white/90",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white dark:text-gray-900">Mandarin Builder</h2>
            <button onClick={toggleMenu} className="text-white dark:text-gray-900">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1">
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center text-lg text-white hover:text-yellow-400 transition-colors duration-200 py-2 dark:text-gray-900 dark:hover:text-yellow-600"
                    onClick={toggleMenu}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-6 border-t border-white/20 dark:border-gray-300/20">
            <p className="text-white/60 text-sm dark:text-gray-700">© {new Date().getFullYear()} Mandarin Builder</p>
          </div>
        </div>
      </div>
    </div>
  )
}
