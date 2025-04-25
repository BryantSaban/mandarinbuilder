import ChineseChatbot from "@/components/chinese-chatbot"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import NavigationMenu from "@/components/navigation-menu"
import ThemeToggle from "@/components/theme-toggle"

export default function ChatbotPage() {
  return (
    <main className="min-h-screen flex flex-col relative text-gray-900 dark:text-white">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/night-village-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />
      </div>

      {/* Navigation Menu */}
      <NavigationMenu />
      <ThemeToggle />

      {/* Content */}
      <div className="container mx-auto px-4 py-12 flex-1 flex flex-col relative z-10">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
              Chinese Conversation Practice
            </h1>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-purple-200 dark:border-purple-800 mb-8">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Practice your Mandarin conversation skills with our AI tutor, Xiao Mei. She'll respond in Chinese with
              pinyin and English translations to help you learn.
            </p>

            <div className="flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <p>• Click the speaker icon to hear authentic Chinese pronunciation</p>
              <p>• Toggle auto-play to automatically hear each response</p>
              <p>• Ask questions about Chinese language and culture</p>
              <p>• Practice common phrases and everyday conversations</p>
            </div>
          </div>

          <div className="h-[600px]">
            <ChineseChatbot />
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute bottom-8 left-8 z-20">
        <Link href="/">
          <Button
            variant="outline"
            className="bg-black/30 dark:bg-white/10 border-white/20 dark:border-gray-700 text-white dark:text-gray-200 hover:bg-black/50 dark:hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </main>
  )
}
