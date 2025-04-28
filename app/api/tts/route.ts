import { NextResponse } from "next/server"
import OpenAI from "openai"

// Explicitly set the runtime to nodejs
export const runtime = "nodejs"
export const maxDuration = 10

// Define valid voice options
const VALID_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]

export async function POST(req: Request) {
  try {
    // Parse the request body safely
    const body = await req.json().catch((err) => {
      console.error("Failed to parse request body:", err)
      return {}
    })

    // Extract text with validation
    const text = typeof body?.text === "string" ? body.text : ""
    if (!text) {
      return NextResponse.json({ error: "Invalid or missing text parameter" }, { status: 400 })
    }

    // ULTRA-DEFENSIVE voice parameter handling
    let voice = "alloy" // default

    if (body && typeof body === "object" && typeof body.voice === "string") {
      // safely lowercase only real strings
      const lowerVoice = body.voice.toLowerCase()

      if (VALID_VOICES.includes(lowerVoice)) {
        voice = lowerVoice as typeof voice
      } else {
        console.warn(`Invalid voice parameter "${body.voice}", falling back to "${voice}"`)
      }
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Generate speech using OpenAI's TTS API
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
