"use client"

import { useState, useEffect } from "react"
import NavigationMenu from "@/components/navigation-menu"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"
import ChatInterface from "@/components/chat-interface"
import ThemeToggle from "@/components/theme-toggle"
import SettingsModal from "@/components/settings-modal"
import WordBubble from "@/components/word-bubble"
import VoiceTutorInterface from "@/components/voice-tutor-interface"

export default function ConversationPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [voiceChatEnabled, setVoiceChatEnabled] = useState(true)
  const [selectedVoice, setSelectedVoice] = useState("alloy")
  const [subtitles, setSubtitles] = useState<string[]>([])
  const [showSubtitles, setShowSubtitles] = useState(false)
  const [isTutorActive, setIsTutorActive] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Helper functions for pinyin and definitions (in a real app, these would use a dictionary API)
  const getPinyinForWord = (word: string): string => {
    const pinyinMap: Record<string, string> = {
      我: "wǒ",
      叫: "jiào",
      小: "xiǎo",
      明: "míng",
      很: "hěn",
      高: "gāo",
      兴: "xìng",
      认: "rèn",
      识: "shí",
      你: "nǐ",
      "！": "!",
      "，": ",",
    }
    return pinyinMap[word] || word
  }

  const getDefinitionForWord = (word: string): string => {
    const definitionMap: Record<string, string> = {
      我: "I, me",
      叫: "to be called, named",
      小: "small, little",
      明: "bright, clear",
      很: "very",
      高: "tall, high",
      兴: "happy, excited",
      认: "to recognize",
      识: "to know",
      你: "you",
      "！": "exclamation mark",
      "，": "comma",
    }
    return definitionMap[word] || ""
  }

  const toggleTutor = () => {
    setIsTutorActive(!isTutorActive)
  }

  return (
    <main className="min-h-screen flex flex-col relative text-gray-900 dark:text-white">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/practice-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 text-shadow-md bg-white/10 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border-l-4 border-purple-500 dark:border-purple-400">
              Conversation Practice
            </h1>
            <Button
              variant="outline"
              size="icon"
              className="bg-black/30 dark:bg-white/10 border-white/20 dark:border-gray-700 text-white dark:text-gray-200"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="md:col-span-3 h-[600px] relative">
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

              {/* Replace Recent Corrections with Activate Tutor button */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                  {isTutorActive ? "AI Tutor Active" : "AI Tutor Mode"}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {isTutorActive
                    ? "Return to standard conversation practice."
                    : "Practice with our AI tutor for real-time pronunciation feedback."}
                </p>
                <Button
                  className={`w-full ${
                    isTutorActive
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  } text-white`}
                  onClick={toggleTutor}
                >
                  {isTutorActive ? "Back to Practice" : "Activate Tutor!"}
                </Button>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Voice Features</h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    Click the microphone icon to speak in Chinese or English
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    Click the speaker icon to hear authentic pronunciation
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    Toggle auto-play to hear each response automatically
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Subtitles area */}
        {showSubtitles && (
          <div
            id="chatSubtitles"
            className="fixed bottom-32 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-2 max-w-2xl px-4 py-3 z-50"
          >
            {subtitles.map((word, index) => (
              <WordBubble
                key={index}
                word={word}
                pinyin={getPinyinForWord(word)}
                definition={getDefinitionForWord(word)}
              />
            ))}
          </div>
        )}

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          voiceChatEnabled={voiceChatEnabled}
          setVoiceChatEnabled={setVoiceChatEnabled}
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
        />

        {/* Voice Tutor Interface */}
        {isTutorActive && <VoiceTutorInterface onClose={toggleTutor} selectedVoice={selectedVoice} />}
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
