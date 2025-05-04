// app/api/tts/route.ts
import { NextResponse } from "next/server"

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
  if (!resp.ok) throw new Error(`Google TTS failed: ${resp.status}`)

  const buffer = await resp.arrayBuffer()
  const b64 = Buffer.from(buffer).toString("base64")
  return NextResponse.json(
    {
      text,
      audioData: `data:audio/mpeg;base64,${b64}`,
      fallback: true,
    },
    { status: 200 }
  )
}

export async function POST(req: Request) {
  // 1) Parse + validate
  const { text: _text, voice: _voice } = await req.json().catch(() => ({}))
  const text = typeof _text === "string" ? _text.trim() : ""
  if (!text) {
    return NextResponse.json(
      { error: "Missing or invalid `text` parameter." },
      { status: 400 }
    )
  }

  // 2) Normalize voice
  let voice = "alloy"
  if (typeof _voice === "string") {
    const v = _voice.toLowerCase()
    if (VALID_VOICES.includes(v)) voice = v
  }

  // 3) Read your Vercel var
  const key = process.env.MANDARINBUILDER_API_KEY
  if (!key) {
    console.error("❌ Missing MANDARINBUILDER_API_KEY")
    return NextResponse.json(
      { error: "Server misconfiguration: missing API key." },
      { status: 500 }
    )
  }

  // 4) Call OpenAI TTS endpoint directly
  const apiRes = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "tts-1", voice, input: text }),
  })

  // 5a) Quota hit → Google fallback
  if (apiRes.status === 429) {
    try {
      return await getGoogleTTS(text)
    } catch {
      return NextResponse.json(
        { error: "Voice service unavailable (fallback failed)." },
        { status: 503 }
      )
    }
  }

  // 5b) Unauthorized → billing/key error
  if (apiRes.status === 401 || apiRes.status === 402) {
    return NextResponse.json(
      { error: "TTS unauthorized—check billing & API key." },
      { status: 403 }
    )
  }

  // 5c) Other service errors
  if (!apiRes.ok) {
    return NextResponse.json(
      { error: "Text-to-speech service is unavailable." },
      { status: 503 }
    )
  }

  // 6) Success: return base64-encoded audio with correct MIME
  const arrayBuffer = await apiRes.arrayBuffer()
  const b64 = Buffer.from(arrayBuffer).toString("base64")
  return NextResponse.json({
    text,
    audioData: `data:audio/mpeg;base64,${b64}`,
  })
}
