// Use browser's built-in audio playback
export function playAudio(text: string, fallbackUrl?: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      // If we have a fallback URL, use it directly
      if (fallbackUrl) {
        const audio = new Audio(fallbackUrl)

        const handleCanPlay = () => {
          audio.play().catch(() => {
            console.warn("Fallback audio playback failed")
            resolve()
          })
        }

        const handleEnded = () => {
          audio.removeEventListener("canplaythrough", handleCanPlay)
          audio.removeEventListener("ended", handleEnded)
          audio.removeEventListener("error", handleError)
          clearTimeout(timeout)
          resolve()
        }

        const handleError = () => {
          console.warn("Fallback audio error")
          clearTimeout(timeout)
          resolve()
        }

        audio.addEventListener("canplaythrough", handleCanPlay)
        audio.addEventListener("ended", handleEnded)
        audio.addEventListener("error", handleError)

        // Set timeout in case audio never loads
        const timeout = setTimeout(() => {
          audio.removeEventListener("canplaythrough", handleCanPlay)
          audio.removeEventListener("ended", handleEnded)
          audio.removeEventListener("error", handleError)
          resolve()
        }, 5000)

        audio.load()
      } else {
        // No fallback URL provided
        console.warn("No audio URL provided")
        resolve()
      }
    } catch (err) {
      console.error("Error with audio playback:", err)
      resolve() // Always resolve to prevent blocking the UI
    }
  })
}

// Clean up audio resources
export function cleanupAudio() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}
