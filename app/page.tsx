import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import FeatureCard from "@/components/feature-card"
import ImageSlideshow from "@/components/image-slideshow"
import NavigationMenu from "@/components/navigation-menu"
import UIVisibilityToggle from "@/components/ui-visibility-toggle"
import ThemeToggle from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      {/* Navigation Menu */}
      <div className="ui-element">
        <NavigationMenu />
      </div>

      {/* Theme and UI Visibility Toggles */}
      <ThemeToggle />
      <UIVisibilityToggle />

      {/* Hero Section with Slideshow */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <ImageSlideshow />

        <div className="container relative z-10 px-4 md:px-6 space-y-12 text-center ui-element">
          <div className="space-y-4 p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 shadow-2xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-shadow-lg">
              <span className="inline-block relative">
                <span className="relative z-10">M</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">M</span>
              </span>
              <span className="inline-block relative">
                <span className="relative z-10">a</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">a</span>
              </span>
              <span className="inline-block relative">
                <span className="relative z-10">n</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">n</span>
              </span>
              <span className="inline-block relative">
                <span className="relative z-10">d</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">d</span>
              </span>
              <span className="inline-block relative">
                <span className="relative z-10">a</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">a</span>
              </span>
              <span className="inline-block relative">
                <span className="relative z-10">r</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">r</span>
              </span>
              <span className="inline-block relative">
                <span className="relative z-10">i</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">i</span>
              </span>
              <span className="inline-block relative">
                <span className="relative z-10">n</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">n</span>
              </span>
              {/* Space between Mandarin and Builder */}
              <span className="inline-block relative" style={{ width: "0.4em" }}>
                <span className="relative z-10">&nbsp;</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">&nbsp;</span>
              </span>
              <span className="inline-block relative">
                <span className="relative z-10">B</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">B</span>
              </span>
              <span className="inline-block relative">
                <span className="relative z-10">u</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">u</span>
              </span>
              <span className="inline-block relative">
                <span className="relative z-10">i</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">i</span>
              </span>
              <span className="inline-block relative">
                <span className="relative z-10">l</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">l</span>
              </span>
              <span className="inline-block relative">
                <span className="relative z-10">d</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">d</span>
              </span>
              <span className="inline-block relative">
                <span className="relative z-10">e</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">e</span>
              </span>
              <span className="inline-block relative">
                <span className="relative z-10">r</span>
                <span className="absolute inset-0 animate-glow-outline text-transparent">r</span>
              </span>
            </h1>
            <p
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-pink-400 drop-shadow-lg shadow-fuchsia-400/50"
              style={{ textShadow: "0 0 15px rgba(219, 39, 119, 0.5), 0 0 25px rgba(219, 39, 119, 0.3)" }}
            >
              Immersion Redefined
            </p>
          </div>

          <p className="max-w-[700px] mx-auto text-xl md:text-2xl text-white text-shadow-md">
            The most efficient way to master Mandarin through immersive learning
          </p>

          <div className="relative mx-auto max-w-2xl p-6 border border-zinc-800 rounded-lg bg-zinc-900/70 backdrop-blur-sm">
            <p className="italic text-lg md:text-xl">
              "Life cannot be extended. Efficiency is the only way to make every breath longer."
            </p>
          </div>

          <Link href="/signup" className="mt-4 inline-block">
            <Button className="bg-gradient-to-r from-fuchsia-600 to-pink-400 hover:from-fuchsia-500 hover:to-pink-300 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-fuchsia-500/20 active:scale-95">
              Start Your Journey
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce ui-element">
          <ChevronRight className="h-8 w-8 rotate-90 text-white/70" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-zinc-950/90 backdrop-blur-sm ui-element">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Unmatched Productivity</h2>
          <p className="text-zinc-400 text-center max-w-3xl mx-auto mb-16">
            Master Mandarin with our scientifically-backed approach that maximizes your learning efficiency and
            retention
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              title="Acquire"
              description="Build your vocabulary with our intelligent flashcard system that adapts to your learning pace"
              icon="Brain"
              color="blue"
              href="/acquire"
            />
            <FeatureCard
              title="Learn"
              description="Master sentence formation with interactive exercises designed by language experts"
              icon="BookOpen"
              color="green"
              href="/learn"
            />
            <FeatureCard
              title="Practice"
              description="Converse with our AI tutor through guided lessons or open-ended conversations"
              icon="MessageSquare"
              color="purple"
              href="/practice"
            />
            <FeatureCard
              title="Journey"
              description="Track your progress and unlock beautiful backgrounds as you reach new milestones"
              icon="Map"
              color="gold"
              href="/journey"
            />
          </div>
        </div>
      </section>

      {/* Why We Built This Website Section */}
      <section className="py-20 bg-black/80 backdrop-blur-sm relative overflow-hidden ui-element">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-red-600/20 blur-[100px]"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why We Built This Website</h2>
          <p className="text-zinc-400 text-center max-w-3xl mx-auto mb-10">
            Our journey to create the most efficient Mandarin learning platform started with a simple observation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-zinc-900/60 backdrop-blur-sm p-6 rounded-lg border border-zinc-800">
              <h3 className="text-xl font-bold mb-3 text-red-500">The Problem</h3>
              <p className="text-zinc-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu
                sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla
                enim.
              </p>
            </div>

            <div className="bg-zinc-900/60 backdrop-blur-sm p-6 rounded-lg border border-zinc-800">
              <h3 className="text-xl font-bold mb-3 text-emerald-500">Our Solution</h3>
              <p className="text-zinc-400">
                Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean
                lacinia bibendum nulla sed consectetur. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                auctor.
              </p>
            </div>

            <div className="bg-zinc-900/60 backdrop-blur-sm p-6 rounded-lg border border-zinc-800">
              <h3 className="text-xl font-bold mb-3 text-purple-500">Our Approach</h3>
              <p className="text-zinc-400">
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras
                mattis consectetur purus sit amet fermentum. Morbi leo risus, porta ac consectetur ac, vestibulum at
                eros.
              </p>
            </div>

            <div className="bg-zinc-900/60 backdrop-blur-sm p-6 rounded-lg border border-zinc-800">
              <h3 className="text-xl font-bold mb-3 text-fuchsia-500">The Future</h3>
              <p className="text-zinc-400">
                Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus
                auctor fringilla. Maecenas faucibus mollis interdum. Fusce dapibus, tellus ac cursus commodo, tortor
                mauris condimentum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-zinc-950/90 to-black/80 backdrop-blur-sm ui-element">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Master Mandarin?</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-10">
            Join thousands of learners who have transformed their language skills with Mandarin Builder
          </p>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-fuchsia-600 to-pink-400 hover:from-fuchsia-500 hover:to-pink-300 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-fuchsia-500/20 active:scale-95 relative overflow-hidden group">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-400/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative z-10">Get Started Now</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-zinc-800 bg-zinc-950/90 backdrop-blur-sm ui-element">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-pink-400">
                Mandarin Builder
              </h3>
              <p className="text-zinc-500 text-sm mt-1">
                © {new Date().getFullYear()} Mandarin Builder. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-zinc-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/features" className="text-zinc-400 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-zinc-400 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
