// app/api/tts/route.ts
import { NextResponse } from "next/server"
import OpenAI from "openai"

// Server-only Node.js function
export const runtime = "nodejs"
export const maxDuration = 10

const VALID_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]

// Google Translate TTS fallback
async function getGoogleTTS(text: string) {
  console.log("🚧 Fallback: Google TTS for text:", text)
  const url =
    "https://translate.google.com/translate_tts" +
    "?ie=UTF-8" +
    `&q=${encodeURIComponent(text)}` +
    "&tl=zh-CN" +
    "&client=tw-ob"

  const resp = await fetch(url)
  if (!resp.ok) {
    throw new Error(`Google TTS failed: ${resp.status}`)
  }

  const buffer = await resp.arrayBuffer()
  const b64 = Buffer.from(buffer).toString("base64")
  return NextResponse.json(
    { text, audioData: `data:audio/mp3;base64,${b64}`, fallback: true },
    { status: 200 }
  )
}

export async function POST(req: Request) {
  // 1) Parse + debug
  const body = await req.json().catch(() => ({}))
  console.log("▶️ TTS handler body:", body)
  console.log("   – API key present?", Boolean(process.env.MANDARINBUILDER_API_KEY))
  console.log("   – raw voice param:", body.voice)

  // 2) Validate text
  const text = typeof body.text === "string" ? body.text.trim() : ""
  if (!text) {
    return NextResponse.json(
      { error: "Missing or invalid `text` parameter." },
      { status: 400 }
    )
  }

  // 3) Safe voice selection
  let voice: typeof VALID_VOICES[number] = "alloy"
  if (typeof body.voice === "string" && VALID_VOICES.includes(body.voice)) {
    voice = body.voice
  }
  console.log("   – using voice:", voice)

  // 4) Read your Vercel var
  const key = process.env.MANDARINBUILDER_API_KEY
  if (!key) {
    console.error("❌ Missing MANDARINBUILDER_API_KEY")
    return NextResponse.json(
      { error: "Server misconfiguration: missing API key." },
      { status: 500 }
    )
  }

  // 5) Call OpenAI TTS
  try {
    const openai = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true })
    const tts = await openai.audio.speech.create({
      model: "tts-1",
      voice,
      input: text,
    })
    const arrayBuffer = await tts.arrayBuffer()
    const b64 = Buffer.from(arrayBuffer).toString("base64")
    return NextResponse.json({ text, audioData: `data:audio/mp3;base64,${b64}` })
  } catch (err: any) {
    const status = err.response?.status
    console.error("❌ OpenAI TTS error:", err.message, "status=", status)

    // 5a) Quota → Google fallback
    if (status === 429) {
      try {
        return await getGoogleTTS(text)
      } catch (googleErr) {
        console.error("❌ Google TTS fallback failed:", googleErr)
        return NextResponse.json(
          { error: "Voice service is unavailable." },
          { status: 503 }
        )
      }
    }

    // 5b) Unauthorized → billing/key error
    if ([401, 402].includes(status)) {
      return NextResponse.json(
        { error: "TTS unauthorized—check your billing & API key." },
        { status: 403 }
      )
    }

    // 5c) Other failures
    return NextResponse.json(
      { error: "Text-to-speech service is unavailable. Please try again later." },
      { status: 503 }
    )
  }
}
