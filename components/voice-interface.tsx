"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, X, Maximize2, Minimize2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import WordBubble from "@/components/word-bubble"

interface VoiceInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

// Define the SpeechRecognition type for TypeScript
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onerror: (event: any) => void
  onresult: (event: any) => void
  onend: () => void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

export default function VoiceInterface({ isOpen, onClose }: VoiceInterfaceProps) {
  const [isListening, setIsListening] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [message, setMessage] = useState("")
  const [pinyin, setPinyin] = useState("")
  const [translation, setTranslation] = useState("")
  const [showSubtitles, setShowSubtitles] = useState(false)
  const [subtitles, setSubtitles] = useState<string[]>([])
  const [userSpeech, setUserSpeech] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isBrowserSupported, setIsBrowserSupported] = useState(true)

  // Reference to the recognition object
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Sample responses
  const responses = [
    {
      message: "你好！很高兴认识你！",
      pinyin: "Nǐ hǎo! Hěn gāoxìng rènshí nǐ!",
      translation: "Hello! Nice to meet you!",
    },
    {
      message: "今天天气真好，你觉得呢？",
      pinyin: "Jīntiān tiānqì zhēn hǎo, nǐ juédé ne?",
      translation: "The weather is nice today, don't you think?",
    },
    {
      message: "你想学习什么话题？我可以帮助你！",
      pinyin: "Nǐ xiǎng xuéxí shénme huàtí? Wǒ kěyǐ bāngzhù nǐ!",
      translation: "What topic would you like to learn? I can help you!",
    },
    {
      message: "请告诉我你的名字，我们开始对话吧！",
      pinyin: "Qǐng gàosù wǒ nǐ de míngzì, wǒmen kāishǐ duìhuà ba!",
      translation: "Please tell me your name, let's start our conversation!",
    },
    {
      message: "学习中文很有趣，对吗？",
      pinyin: "Xuéxí zhōngwén hěn yǒuqù, duì ma?",
      translation: "Learning Chinese is fun, isn't it?",
    },
  ]

  // Initialize speech recognition
  useEffect(() => {
    // Check if the browser supports the Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsBrowserSupported(false)
      setError("Your browser doesn't support speech recognition. Try using Chrome, Edge, or Safari.")
      return
    }

    // Create a new recognition instance
    const recognition = new SpeechRecognition() as SpeechRecognition

    // Configure recognition
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "zh-CN" // Set language to Mandarin Chinese

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
      setError(`Recognition error: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    // Store the recognition instance in the ref
    recognitionRef.current = recognition

    return () => {
      // Clean up
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false)
      setMessage("")
      setPinyin("")
      setTranslation("")
      setShowSubtitles(false)
      setUserSpeech("")
      setError(null)

      // Stop recognition if it's active
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop()
      }
    }
  }, [isOpen, isListening])

  const handleUserInput = (transcript: string) => {
    console.log("User said:", transcript)

    // Here you would typically send the transcript to a backend for processing
    // For now, we'll just respond with a random response
    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessage(randomResponse.message)
      setPinyin(randomResponse.pinyin)
      setTranslation(randomResponse.translation)

      // Display subtitles
      const words = randomResponse.message.split("").filter((char) => char.trim().length > 0)
      setSubtitles(words)
      setShowSubtitles(true)
    }, 1000)
  }

  const handleMicClick = () => {
    setError(null)

    if (!isBrowserSupported) {
      setError("Your browser doesn't support speech recognition. Try using Chrome, Edge, or Safari.")
      return
    }

    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsListening(false)
    } else {
      // Start listening
      setUserSpeech("")
      setIsListening(true)

      try {
        if (recognitionRef.current) {
          recognitionRef.current.start()
        }
      } catch (err) {
        console.error("Failed to start speech recognition:", err)
        setError("Failed to start speech recognition. Please try again.")
        setIsListening(false)
      }
    }
  }

  // Helper functions for pinyin and definitions (in a real app, these would use a dictionary API)
  const getPinyinForWord = (word: string): string => {
    const pinyinMap: Record<string, string> = {
      你: "nǐ",
      好: "hǎo",
      很: "hěn",
      高: "gāo",
      兴: "xìng",
      认: "rèn",
      识: "shí",
      今: "jīn",
      天: "tiān",
      气: "qì",
      真: "zhēn",
      觉: "jué",
      得: "dé",
      呢: "ne",
      想: "xiǎng",
      学: "xué",
      习: "xí",
      什: "shén",
      么: "me",
      话: "huà",
      题: "tí",
      我: "wǒ",
      可: "kě",
      以: "yǐ",
      帮: "bāng",
      助: "zhù",
      请: "qǐng",
      告: "gào",
      诉: "sù",
      的: "de",
      名: "míng",
      字: "zì",
      们: "men",
      开: "kāi",
      始: "shǐ",
      对: "duì",
      话: "huà",
      吧: "ba",
      中: "zhōng",
      文: "wén",
      有: "yǒu",
      趣: "qù",
      吗: "ma",
      "！": "!",
      "？": "?",
      "，": ",",
    }
    return pinyinMap[word] || word
  }

  const getDefinitionForWord = (word: string): string => {
    const definitionMap: Record<string, string> = {
      你: "you",
      好: "good",
      很: "very",
      高: "tall/high",
      兴: "happy/excited",
      认: "to recognize",
      识: "to know",
      今: "today/present",
      天: "day/sky",
      气: "air/gas",
      真: "real/true",
      觉: "to feel/think",
      得: "auxiliary word",
      呢: "question particle",
      想: "to think/want",
      学: "to learn",
      习: "to practice",
      什: "what",
      么: "what (with 什)",
      话: "speech/words",
      题: "topic/subject",
      我: "I/me",
      可: "can/able to",
      以: "by means of",
      帮: "to help",
      助: "to assist",
      请: "please",
      告: "to tell",
      诉: "to inform",
      的: "possessive particle",
      名: "name",
      字: "character/word",
      们: "plural marker",
      开: "to open",
      始: "to begin",
      对: "correct/right",
      话: "speech/words",
      吧: "suggestion particle",
      中: "middle/center",
      文: "language/culture",
      有: "to have",
      趣: "interesting",
      吗: "question particle",
      "！": "exclamation mark",
      "？": "question mark",
      "，": "comma",
    }
    return definitionMap[word] || ""
  }

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-300",
        isFullScreen ? "bg-black" : "bg-black/80",
      )}
    >
      {/* Toggle fullscreen button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-16 text-white/70 hover:text-white hover:bg-white/10"
        onClick={() => setIsFullScreen(!isFullScreen)}
      >
        {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
      </Button>

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Avatar/Waveform */}
      <div className="w-32 h-32 rounded-full bg-gradient-to-b from-blue-200 to-blue-500 mb-10 flex items-center justify-center overflow-hidden">
        {isListening ? (
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="absolute w-full h-full animate-pulse bg-blue-400 opacity-50"></div>
            <div className="absolute w-3/4 h-3/4 rounded-full animate-ping bg-blue-300 opacity-30"></div>
            <div className="absolute w-1/2 h-1/2 rounded-full bg-blue-200"></div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-blue-200 to-blue-500"></div>
        )}
      </div>

      {/* User speech feedback */}
      {isListening && userSpeech && (
        <div className="text-center mb-4 max-w-lg">
          <p className="text-white/70 text-lg italic">"{userSpeech}"</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-center mb-4 max-w-lg bg-red-500/20 p-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className="text-center mb-16 max-w-lg">
          <h2 className="text-white text-3xl font-bold mb-2">{message}</h2>
          <p className="text-white/80 text-lg mb-1">{pinyin}</p>
          <p className="text-white/60 text-md">{translation}</p>
        </div>
      )}

      {/* Subtitles */}
      {showSubtitles && (
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-2 max-w-2xl px-4 py-3">
          {subtitles.map((word, index) => (
            <WordBubble
              key={index}
              word={word}
              pinyin={getPinyinForWord(word)}
              definition={getDefinitionForWord(word)}
            />
          ))}
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
          onClick={handleMicClick}
          disabled={!isBrowserSupported}
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
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-white/50 text-sm">
          {isListening ? "Listening... Speak in Mandarin" : "Click the microphone to start speaking"}
        </p>
      </div>
    </div>
  )
}
