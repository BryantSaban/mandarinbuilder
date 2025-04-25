import NavigationMenu from "@/components/navigation-menu"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import FadeTransition from "@/components/fade-transition"

export default function JourneyPage() {
  return (
    <main className="min-h-screen flex flex-col relative text-white">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/journey-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Navigation Menu */}
      <NavigationMenu />

      {/* Content */}
      <div className="container mx-auto px-4 py-20 flex-1 flex flex-col justify-center items-center relative z-10">
        <div className="max-w-3xl w-full bg-black/50 backdrop-blur-md p-8 rounded-xl border border-white/10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-yellow-400">Journey</h1>
          <p className="text-xl mb-8">
            Track your progress and unlock beautiful backgrounds as you reach new milestones. Visualize your learning
            journey and stay motivated with achievements and rewards.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-yellow-300">Progress Tracking</h3>
              <p>See detailed statistics on your learning progress, strengths, and areas for improvement.</p>
            </div>
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-yellow-300">Milestone Rewards</h3>
              <p>Unlock beautiful Chinese landscape backgrounds and other rewards as you reach milestones.</p>
            </div>
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-yellow-300">Learning Path</h3>
              <p>Follow a personalized learning path that adapts to your goals and learning style.</p>
            </div>
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-yellow-300">Community Challenges</h3>
              <p>Participate in community challenges and compare your progress with other learners.</p>
            </div>
          </div>

          <div className="flex justify-center">
            <FadeTransition href="/journey/progress">
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg rounded-full">
                View Your Journey
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
