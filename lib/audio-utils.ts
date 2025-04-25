// Cache for audio elements to prevent multiple instances
const audioCache = new Map<string, HTMLAudioElement>()

// Use browser's built-in speech synthesis when available
export function playAudio(text: string, fallbackUrl?: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      // First try: Browser's speech synthesis
      if (typeof window !== "undefined" && window.speechSynthesis) {
        // Make sure voices are loaded
        const voices = window.speechSynthesis.getVoices()

        // If we have voices, try to use speech synthesis
        if (voices && voices.length > 0) {
          try {
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = "zh-CN"

            // Find a Chinese voice if available
            const chineseVoice = voices.find((voice) => voice.lang.includes("zh"))
            if (chineseVoice) {
              utterance.voice = chineseVoice
            }

            // Set up event handlers
            utterance.onend = () => resolve()
            utterance.onerror = () => {
              // If speech synthesis fails, try the fallback
              if (fallbackUrl) {
                playFallbackAudio(fallbackUrl).finally(resolve)
              } else {
                resolve()
              }
            }

            // Speak the text
            window.speechSynthesis.speak(utterance)

            // Safety timeout
            setTimeout(() => {
              if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel()
                resolve()
              }
            }, 5000)

            return // Exit early if we're using speech synthesis
          } catch (err) {
            console.error("Speech synthesis execution error:", err)
            // Continue to fallback
          }
        }
      }

      // Second try: Audio fallback
      if (fallbackUrl) {
        playFallbackAudio(fallbackUrl).finally(resolve)
      } else {
        // Last resort: Just resolve without playing audio
        console.warn("No speech synthesis or fallback available")
        resolve()
      }
    } catch (err) {
      console.error("Error in playAudio:", err)
      resolve() // Always resolve to prevent blocking the UI
    }
  })
}

// Simplified fallback audio player
function playFallbackAudio(audioUrl: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const audio = new Audio()

      // Set up minimal event handlers
      audio.oncanplaythrough = () => {
        audio.play().catch(() => {
          console.warn("Fallback audio playback failed")
          resolve()
        })
      }

      audio.onended = () => resolve()
      audio.onerror = () => {
        console.warn("Fallback audio error")
        resolve()
      }

      // Set timeout in case audio never loads
      const timeout = setTimeout(() => {
        resolve()
      }, 3000)

      // Clean up on completion
      audio.onended = () => {
        clearTimeout(timeout)
        resolve()
      }

      // Set source and load
      audio.src = audioUrl
      audio.load()
    } catch (err) {
      console.error("Error with fallback audio:", err)
      resolve()
    }
  })
}

// Clean up audio resources
export function cleanupAudio() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }

  audioCache.forEach((audio) => {
    audio.pause()
    audio.src = ""
  })
  audioCache.clear()
}
