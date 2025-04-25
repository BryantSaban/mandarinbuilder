"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"
import Link from "next/link"
import PageLayout from "@/components/page-layout"

export default function NightVillagePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showPoem, setShowPoem] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      // Show poem after a delay
      const poemTimer = setTimeout(() => {
        setShowPoem(true)
      }, 1000)

      return () => clearTimeout(poemTimer)
    }
  }, [isLoading])

  return (
    <PageLayout backgroundImage="/images/night-village-bg.png">
      <div
        className="container mx-auto px-4 py-12 flex-1 flex flex-col justify-center items-center relative z-10 transition-opacity duration-800"
        style={{ opacity: isLoading ? 0 : 1 }}
      >
        <div className="max-w-2xl w-full">
          <div
            className={`bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-xl transition-all duration-1000 ${
              showPoem ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
            }`}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white text-center">Night Village</h1>

            <div className="space-y-6 text-white/90">
              <p className="text-lg italic text-center">"山中夜望"</p>
              <p className="text-lg italic text-center">"Night View from the Mountain"</p>

              <div className="border-l-4 border-yellow-500/50 pl-4 py-2">
                <p className="mb-2">远山连绵如水墨，</p>
                <p className="text-sm text-white/70 mb-4">Distant mountains stretch like ink paintings,</p>

                <p className="mb-2">村落点点星光明。</p>
                <p className="text-sm text-white/70 mb-4">Village lights twinkle like stars.</p>

                <p className="mb-2">松风轻抚两旅人，</p>
                <p className="text-sm text-white/70 mb-4">Pine winds gently caress two travelers,</p>

                <p className="mb-2">静观人间烟火情。</p>
                <p className="text-sm text-white/70">Quietly observing the world's warmth below.</p>
              </div>

              <div className="flex justify-center">
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>

              <p className="text-center text-sm text-white/60">Unlocked at 25 sentences mastered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute bottom-8 left-8 z-20">
        <Link href="/journey/progress">
          <Button variant="outline" className="bg-black/30 border-white/20 text-white hover:bg-black/50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Progress
          </Button>
        </Link>
      </div>
    </PageLayout>
  )
}
