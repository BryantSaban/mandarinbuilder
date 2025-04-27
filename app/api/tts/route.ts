import { NextResponse } from "next/server"
import OpenAI from "openai"

// Explicitly set the runtime to nodejs
export const runtime = "nodejs"
export const maxDuration = 10

// Define valid voice options
const VALID_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json().catch((err) => {
      console.error("Failed to parse request body:", err)
      return {}
    })

    // Log the received body for debugging
    console.log("TTS API received body:", JSON.stringify(body))

    // Safely extract text with default
    const text = typeof body?.text === "string" ? body.text : ""

    // Validate text parameter
    if (!text) {
      console.error("Invalid or missing text parameter")
      return NextResponse.json({ error: "Invalid or missing text parameter" }, { status: 400 })
    }

    // ULTRA-DEFENSIVE voice parameter handling
    // Default to "alloy" voice
    let voice = "alloy"

    // Only proceed with voice extraction if body exists and is an object
    if (body && typeof body === "object") {
      // Check if voice property exists
      if ("voice" in body) {
        // Get the voice parameter
        const voiceParam = body.voice

        // Only proceed if voiceParam is not null/undefined and is a string
        if (voiceParam !== null && voiceParam !== undefined && typeof voiceParam === "string") {
          try {
            // Try to convert to lowercase safely
            const lowerVoice = String(voiceParam).toLowerCase()

            // Check if it's a valid voice option
            if (VALID_VOICES.includes(lowerVoice)) {
              voice = lowerVoice
            } else {
              console.warn(`Invalid voice parameter: ${voiceParam}, using default: alloy`)
            }
          } catch (e) {
            console.error("Error processing voice parameter:", e)
            // Keep the default voice
          }
        }
      }
    }

    // Log the parameters we're using
    console.log(`TTS API using text: "${text.substring(0, 20)}..." and voice: ${voice}`)

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not found, falling back to Google TTS")
      return getGoogleTTS(text)
    }

    try {
      // Initialize OpenAI client with the dangerouslyAllowBrowser option
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true, // Add this option to address the error
      })

      console.log(`Generating TTS with OpenAI for text: "${text.substring(0, 20)}..." using voice: ${voice}`)

      // Generate speech using OpenAI's TTS API with explicit type casting
      const mp3Response = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
        input: text,
      })

      // Get the audio data as an ArrayBuffer
      const audioData = await mp3Response.arrayBuffer()

      // Convert to base64 for safe transmission
      const base64Audio = Buffer.from(audioData).toString("base64")

      // Return the audio data as base64
      return NextResponse.json({
        text,
        audioData: `data:audio/mp3;base64,${base64Audio}`,
      })
    } catch (openaiError: any) {
      console.error("OpenAI TTS error:", openaiError)

      // Log more details about the error
      if (openaiError.response) {
        console.error("OpenAI API response status:", openaiError.response.status)
        console.error("OpenAI API response data:", openaiError.response.data)
      } else {
        console.error("OpenAI error details:", openaiError.message || "Unknown error")
      }

      // Fallback to Google TTS
      return getGoogleTTS(text)
    }
  } catch (error: any) {
    console.error("TTS processing error:", error.message || error)
    return NextResponse.json(
      {
        error: "Failed to process text-to-speech request: " + (error.message || "Unknown error"),
      },
      { status: 500 },
    )
  }
}

// Helper function for Google TTS fallback
async function getGoogleTTS(text: string) {
  console.log("Falling back to Google TTS for text:", text.substring(0, 20) + "...")
  const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=zh-CN&client=tw-ob`

  try {
    // Fetch the audio data server-side to avoid CORS issues
    const audioResponse = await fetch(googleTtsUrl)

    if (!audioResponse.ok) {
      throw new Error(`Failed to fetch audio: ${audioResponse.status}`)
    }

    // Get the audio data as an ArrayBuffer
    const audioData = await audioResponse.arrayBuffer()

    // Convert to base64 for safe transmission
    const base64Audio = Buffer.from(audioData).toString("base64")

    // Return the audio data as base64
    return NextResponse.json({
      text,
      audioData: `data:audio/mp3;base64,${base64Audio}`,
      fallback: true,
    })
  } catch (fallbackError: any) {
    console.error("Google TTS fallback error:", fallbackError.message || fallbackError)
    return NextResponse.json(
      {
        text,
        error: "Failed to generate speech with both OpenAI and fallback service",
      },
      { status: 500 },
    )
  }
}
