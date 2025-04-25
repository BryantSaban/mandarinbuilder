import NavigationMenu from "@/components/navigation-menu"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import FadeTransition from "@/components/fade-transition"

export default function PracticePage() {
  return (
    <main className="min-h-screen flex flex-col relative text-white">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/practice-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Navigation Menu */}
      <NavigationMenu />

      {/* Content */}
      <div className="container mx-auto px-4 py-20 flex-1 flex flex-col justify-center items-center relative z-10">
        <div className="max-w-3xl w-full bg-black/50 backdrop-blur-md p-8 rounded-xl border border-white/10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-purple-400">Practice</h1>
          <p className="text-xl mb-8">
            Converse with our AI tutor through guided lessons or open-ended conversations. Practice speaking and
            listening in realistic scenarios to build your confidence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-purple-300">AI Conversation</h3>
              <p>Chat with our AI tutor that adapts to your level and provides helpful corrections.</p>
            </div>
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-purple-300">Role-Playing</h3>
              <p>Practice real-life scenarios like ordering food, asking for directions, or making friends.</p>
            </div>
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-purple-300">Speech Recognition</h3>
              <p>Get feedback on your pronunciation with our advanced speech recognition technology.</p>
            </div>
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-purple-300">Guided Dialogues</h3>
              <p>Follow structured conversations that gradually increase in complexity as you improve.</p>
            </div>
          </div>

          <div className="flex justify-center">
            <FadeTransition href="/practice/conversation">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg rounded-full">
                Start Practicing Conversations
              </Button>
            </FadeTransition>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute bottom-8 left-8 z-20">
        <Link href="/">
          <Button variant="outline" className="bg-black/30 border-white/20 text-white hover:bg-black/50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </main>
  )
}
