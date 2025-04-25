import { NextResponse } from "next/server"
import OpenAI from "openai"

export const runtime = "nodejs"
export const maxDuration = 10

export async function POST(req: Request) {
  try {
    const { text, voice = "alloy" } = await req.json()

    if (!text || typeof text !== "string") {
      console.error("Invalid text parameter:", text)
      return NextResponse.json({ error: "Invalid text parameter" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not found, falling back to Google TTS")
      return getGoogleTTS(text)
    }

    try {
      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })

      console.log(`Generating TTS with OpenAI for text: "${text.substring(0, 20)}..." using voice: ${voice}`)

      // Generate speech using OpenAI's TTS API
      const mp3Response = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice, // Options: alloy, echo, fable, onyx, nova, shimmer
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
      }

      // Fallback to Google TTS
      return getGoogleTTS(text)
    }
  } catch (error) {
    console.error("TTS processing error:", error)
    return NextResponse.json(
      {
        error: "Failed to process text-to-speech request",
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
  } catch (fallbackError) {
    console.error("Google TTS fallback error:", fallbackError)
    return NextResponse.json(
      {
        text,
        error: "Failed to generate speech with both OpenAI and fallback service",
      },
      { status: 500 },
    )
  }
}
