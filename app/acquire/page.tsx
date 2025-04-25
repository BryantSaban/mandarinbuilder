import NavigationMenu from "@/components/navigation-menu"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import FadeTransition from "@/components/fade-transition"

export default function AcquirePage() {
  return (
    <main className="min-h-screen flex flex-col relative text-white">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/acquire-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Navigation Menu */}
      <NavigationMenu />

      {/* Content */}
      <div className="container mx-auto px-4 py-20 flex-1 flex flex-col justify-center items-center relative z-10">
        <div className="max-w-3xl w-full bg-black/50 backdrop-blur-md p-8 rounded-xl border border-white/10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-400">Acquire</h1>
          <p className="text-xl mb-8">
            Build your vocabulary with our intelligent flashcard system that adapts to your learning pace. Our spaced
            repetition algorithm ensures you review words just before you're about to forget them.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-blue-300">Adaptive Learning</h3>
              <p>Our system adjusts to your learning speed, focusing more on words you find challenging.</p>
            </div>
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-blue-300">Audio Pronunciation</h3>
              <p>Hear native speakers pronounce each word to perfect your accent and listening skills.</p>
            </div>
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-blue-300">Character Recognition</h3>
              <p>Learn to recognize and write Chinese characters with our stroke-by-stroke guides.</p>
            </div>
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-blue-300">Context Examples</h3>
              <p>See how words are used in real sentences to better understand their meaning and usage.</p>
            </div>
          </div>

          <div className="flex justify-center">
            <FadeTransition href="/acquire/vocabulary">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-full">
                Start Building Vocabulary
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
