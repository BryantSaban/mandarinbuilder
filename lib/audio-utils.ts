// Use browser's built-in audio playback
export function playAudio(text: string, fallbackUrl?: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      // If we have a fallback URL, use it directly
      if (fallbackUrl) {
        const audio = new Audio()

        const handleCanPlay = () => {
          audio.play().catch((err) => {
            console.warn("Fallback audio playback failed:", err)
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

        const handleError = (e: Event) => {
          console.warn("Fallback audio error:", e)
          if (audio.error) {
            console.warn("Audio error code:", audio.error.code)
          }
          clearTimeout(timeout)
          resolve()
        }

        audio.addEventListener("canplaythrough", handleCanPlay)
        audio.addEventListener("ended", handleEnded)
        audio.addEventListener("error", handleError)

        // Set timeout in case audio never loads
        const timeout = setTimeout(() => {
          console.warn("Fallback audio timeout")
          audio.removeEventListener("canplaythrough", handleCanPlay)
          audio.removeEventListener("ended", handleEnded)
          audio.removeEventListener("error", handleError)
          resolve()
        }, 5000)

        try {
          audio.src = fallbackUrl
          audio.load()
        } catch (err) {
          console.error("Error setting fallback audio source:", err)
          clearTimeout(timeout)
          resolve()
        }
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
