"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, X, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Define valid voice options
const VALID_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]

interface VoiceTutorInterfaceProps {
  onClose: () => void
  selectedVoice?: string
}

export default function VoiceTutorInterface({ onClose, selectedVoice = "nova" }: VoiceTutorInterfaceProps) {
  const [isListening, setIsListening] = useState(false)
  const [userSpeech, setUserSpeech] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [tutorResponse, setTutorResponse] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if the browser supports the Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        // Create a new recognition instance
        const recognition = new SpeechRecognition()

        // Configure recognition
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "zh-CN" // Set language to Mandarin Chinese, but can be changed to English

        // Set up event handlers
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("")

          setUserSpeech(transcript)

          // If this is a final result
          if (event.results[0].isFinal) {
            handleUserInput(transcript)
          }
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error", event)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        // Store the recognition instance in the ref
        recognitionRef.current = recognition
      }
    }

    // Create audio element
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()
    }

    return () => {
      // Clean up
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }

      // Clean up audio element
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  const handleUserInput = async (transcript: string) => {
    setIsProcessing(true)
    setErrorMessage(null) // Clear any previous errors

    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a response based on what the user said
      const responses = [
        "很好！你的发音很清晰。(Hěn hǎo! Nǐ de fāyīn hěn qīngxī.) Very good! Your pronunciation is clear.",
        "请再说一次，慢一点。(Qǐng zài shuō yīcì, màn yīdiǎn.) Please say it again, a bit slower.",
        "注意声调，第三个字是第四声。(Zhùyì shēngdiào, dì sān gè zì shì dì sì shēng.) Pay attention to the tone, the third character is fourth tone.",
        "非常好！你的中文进步很快。(Fēicháng hǎo! Nǐ de zhōngwén jìnbù hěn kuài.) Excellent! Your Chinese is improving quickly.",
      ]

      const response = responses[Math.floor(Math.random() * responses.length)]
      setTutorResponse(response)

      // Extract Chinese text (everything before the first parenthesis)
      const chineseText = response.match(/^([^(]+)/)
      if (chineseText && chineseText[1]) {
        // Play the Chinese part of the response
        await playAudio(chineseText[1].trim())
      }
    } catch (error: any) {
      console.error("Error processing speech:", error)
      setErrorMessage(`Failed to process your speech: ${error.message || "Unknown error"}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      console.error("Speech recognition not available")
      return
    }

    if (isListening) {
      // Stop listening
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      // Start listening
      setUserSpeech("")
      setTutorResponse("")
      setErrorMessage(null)
      setIsListening(true)

      try {
        recognitionRef.current.start()
      } catch (err) {
        console.error("Failed to start speech recognition:", err)
        setIsListening(false)
      }
    }
  }

  // Add this function after the toggleListening function
  const playAudio = async (text: string) => {
    try {
      console.log("Voice tutor requesting TTS for text:", text.substring(0, 20) + "...")

      // Ensure we have a valid voice
      let safeVoice = "nova" // Default fallback
      if (typeof selectedVoice === "string" && VALID_VOICES.includes(selectedVoice)) {
        safeVoice = selectedVoice
      }

      // Create a simple payload with only the required fields
      const payload = {
        text: text,
        voice: safeVoice,
      }

      console.log("Voice tutor sending TTS request with payload:", JSON.stringify(payload))

      // Get the audio data from our API
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API error: ${response.status} - ${errorData.error || "Unknown error"}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.audioData) {
        console.log("Voice tutor received audio data, playing...")
        await playAudioFromDataUrl(data.audioData)
        if (data.fallback) {
          console.log("Voice tutor used fallback TTS service")
        }
      } else {
        throw new Error("No audio data received from API")
      }
    } catch (error: any) {
      console.error("Voice tutor error playing audio:", error)
      setErrorMessage(`Failed to play audio: ${error.message || "Unknown error"}`)
    }
  }

  // Play audio from data URL
  const playAudioFromDataUrl = (dataUrl: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!audioRef.current) {
        audioRef.current = new Audio()
      }

      const audio = audioRef.current

      // Remove any existing event listeners
      audio.oncanplaythrough = null
      audio.onended = null
      audio.onerror = null

      // Set up new event listeners
      audio.oncanplaythrough = () => {
        audio.play().catch((err) => {
          console.error("Audio play error:", err)
          setErrorMessage("Failed to play audio. Your browser might be blocking autoplay.")
          resolve()
        })
      }

      audio.onended = () => {
        resolve()
      }

      audio.onerror = (e) => {
        // Create a more descriptive error message
        console.error("Audio error:", e)
        let errorMsg = "Failed to load audio"

        if (audio.error) {
          // Add specific error code information if available
          switch (audio.error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMsg = "Audio playback was aborted"
              break
            case MediaError.MEDIA_ERR_NETWORK:
              errorMsg = "Network error while loading audio"
              break
            case MediaError.MEDIA_ERR_DECODE:
              errorMsg = "Audio decoding error"
              break
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMsg = "Audio format not supported by your browser"
              break
          }
        }

        setErrorMessage(errorMsg)
        resolve()
      }

      // Set a timeout in case the audio never loads or plays
      const timeout = setTimeout(() => {
        console.warn("Audio playback timeout")
        setErrorMessage("Audio playback timed out. Please try again.")
        resolve()
      }, 5000)

      // Update onended to clear the timeout
      const originalOnEnded = audio.onended
      audio.onended = () => {
        clearTimeout(timeout)
        if (originalOnEnded) {
          originalOnEnded.call(audio)
        }
        resolve()
      }

      try {
        // Set the source and load
        audio.src = dataUrl
        audio.load()
      } catch (err) {
        console.error("Error setting audio source:", err)
        setErrorMessage("Error preparing audio playback")
        clearTimeout(timeout)
        resolve()
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
      {/* Blue orb */}
      <div className="relative w-32 h-32 mb-16">
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-b from-blue-100 to-blue-500 shadow-lg shadow-blue-500/50",
            isListening && "animate-pulse",
          )}
        >
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-white animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* User speech feedback */}
      {userSpeech && (
        <div className="mb-8 max-w-lg text-center">
          <p className="text-white/80 text-lg">{userSpeech}</p>
        </div>
      )}

      {/* Tutor response */}
      {tutorResponse && (
        <div className="mb-12 max-w-lg text-center">
          <p className="text-white text-xl font-medium">{tutorResponse}</p>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="mb-8 max-w-lg bg-red-500/20 p-4 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all",
            isListening ? "bg-red-500 text-white animate-pulse" : "bg-white/10 text-white hover:bg-white/20",
          )}
          onClick={toggleListening}
        >
          <Mic className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-16 h-16 rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-white/50 text-sm">
          {isListening ? "Listening... Speak in Mandarin" : "Click the microphone to start speaking"}
        </p>
      </div>
    </div>
  )
}
