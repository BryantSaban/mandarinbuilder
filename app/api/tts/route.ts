import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 10

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid text parameter" }, { status: 400 })
    }

    // Create Google Translate TTS URL
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
      })
    } catch (fetchError) {
      console.error("Error fetching audio:", fetchError)
      return NextResponse.json({
        text,
        error: "Failed to fetch audio data",
      })
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
