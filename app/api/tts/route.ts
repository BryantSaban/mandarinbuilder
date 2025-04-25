import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 10

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid text parameter" }, { status: 400 })
    }

    // Provide Google Translate TTS as fallback
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=zh-CN&client=tw-ob`

    return NextResponse.json({
      text,
      fallbackUrl: googleTtsUrl,
    })
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
