import NavigationMenu from "@/components/navigation-menu"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import FadeTransition from "@/components/fade-transition"

export default function LearnPage() {
  return (
    <main className="min-h-screen flex flex-col relative text-white">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/learn-bg-chinese.webp')" }}
      >
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Navigation Menu */}
      <NavigationMenu />

      {/* Content */}
      <div className="container mx-auto px-4 py-20 flex-1 flex flex-col justify-center items-center relative z-10">
        <div className="max-w-3xl w-full bg-black/50 backdrop-blur-md p-8 rounded-xl border border-white/10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-emerald-400">Learn</h1>
          <p className="text-xl mb-8">
            Master sentence formation with interactive exercises designed by language experts. Our structured approach
            helps you understand grammar patterns and build natural-sounding sentences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-emerald-300">Grammar Patterns</h3>
              <p>Learn the building blocks of Mandarin grammar through clear, concise explanations.</p>
            </div>
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-emerald-300">Sentence Building</h3>
              <p>Practice constructing sentences with interactive drag-and-drop exercises.</p>
            </div>
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-emerald-300">Error Correction</h3>
              <p>Receive instant feedback on your sentences with detailed explanations of corrections.</p>
            </div>
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-emerald-300">Cultural Context</h3>
              <p>Understand how language is used in different cultural contexts and situations.</p>
            </div>
          </div>

          <div className="flex justify-center">
            <FadeTransition href="/learn/grammar">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg rounded-full">
                Start Learning Grammar
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
