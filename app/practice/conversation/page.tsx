"use client"

import { useState, useEffect } from "react"
import NavigationMenu from "@/components/navigation-menu"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ChatInterface from "@/components/chat-interface"
import ThemeToggle from "@/components/theme-toggle"

export default function ConversationPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen flex flex-col relative text-gray-900 dark:text-white">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/practice-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
      </div>

      {/* Navigation Menu */}
      <NavigationMenu />
      <ThemeToggle />

      {/* Content */}
      <div
        className="container mx-auto px-4 py-12 flex-1 flex flex-col relative z-10 transition-opacity duration-800"
        style={{ opacity: isLoading ? 0 : 1 }}
      >
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-purple-600 dark:text-purple-400 text-center">
            Conversation Practice
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="md:col-span-3 h-[600px]">
              <ChatInterface />
            </div>

            <div className="space-y-4">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Suggested Topics</h3>
                <ul className="space-y-2 text-sm">
                  <li className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/50">
                    Ordering food at a restaurant
                  </li>
                  <li className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/50">
                    Asking for directions
                  </li>
                  <li className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/50">
                    Introducing yourself
                  </li>
                  <li className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/50">
                    Shopping for clothes
                  </li>
                </ul>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Recent Corrections</h3>
                <ul className="space-y-2 text-sm">
                  <li className="text-gray-700 dark:text-gray-300">
                    <span className="line-through">Wo xi huan chi fan</span>
                    <span className="text-green-600 dark:text-green-400 block">Wǒ xǐhuān chīfàn</span>
                  </li>
                  <li className="text-gray-700 dark:text-gray-300">
                    <span className="line-through">Ni hao ma</span>
                    <span className="text-green-600 dark:text-green-400 block">Nǐ hǎo ma</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute bottom-8 left-8 z-20">
        <Link href="/practice">
          <Button
            variant="outline"
            className="bg-black/30 dark:bg-white/10 border-white/20 dark:border-gray-700 text-white dark:text-gray-200 hover:bg-black/50 dark:hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Practice
          </Button>
        </Link>
      </div>
    </main>
  )
}
