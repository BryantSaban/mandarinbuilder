"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface SlideImage {
  url: string
  alt: string
}

export default function ImageSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const images: SlideImage[] = [
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/china-2542630.jpg-uGMwef7x3VhV70ZvawHqBydurbnLaN.jpeg",
      alt: "Ancient Chinese calligraphy with red seals",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panda-4421395%20%281%29.jpg-06S35yED6YL4eYFXtPti2cNijXPZvE.jpeg",
      alt: "Panda eating bamboo with yellow background",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/woman-4456845.jpg-EqAYA7i1efmLm3IJJi9xEjIo05Ghky.jpeg",
      alt: "Woman in traditional clothing at Chinese architecture",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/roof-4456833.jpg-O6naQ1I4V6HJjtgULyonPgl74mrFXE.jpeg",
      alt: "Traditional Chinese buildings with curved roofs",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lugu-lake-4648775.jpg-ZQiG8ENNHJ14QvAUDH7n0iGqyGfvA2.jpeg",
      alt: "Traditional village on Lugu Lake surrounded by mountains",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yellow-mountains-532857.jpg-Shjh5CwsvI1WxMAfdFY8xB49aClPc8.jpeg",
      alt: "Yellow Mountains with dramatic peaks above sea of clouds",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/great-wall-of-china-3022907.jpg-OGYV3MUqkMdAHXSsPQZJWFBFTmmvIF.jpeg",
      alt: "Great Wall of China winding through misty mountains",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/road-4103334.jpg-f77OkGd07yFi7ZyTW6nllfMDRlGIyO.jpeg",
      alt: "Vibrant night street with neon Chinese signs in urban setting",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={image.url || "/placeholder.svg"}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
      {/* Very light overlay just to ensure text readability */}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  )
}
