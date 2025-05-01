import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 10

const VALID_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]

async function getGoogleTTS(text: string) {
  const url =
    "https://translate.google.com/translate_tts" +
    "?ie=UTF-8" +
    `&q=${encodeURIComponent(text)}` +
    "&tl=zh-CN" +
    "&client=tw-ob"

  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`Google TTS failed: ${resp.status}`)

  const buf = await resp.arrayBuffer()
  return NextResponse.json({
    text,
    audioData: `data:audio/mp3;base64,${Buffer.from(buf).toString("base64")}`,
    fallback: true,
  })
}

export async function POST(req: Request) {
  // 1) Parse + validate
  const { text: _text, voice: _voice } = await req.json().catch(() => ({}))
  const text = typeof _text === "string" ? _text.trim() : ""
  if (!text) {
    return NextResponse.json({ error: "Missing or invalid `text`." }, { status: 400 })
  }

  // 2) Voice normalization
  let voice = "alloy"
  if (typeof _voice === "string") {
    const v = _voice.toLowerCase()
    if (VALID_VOICES.includes(v)) voice = v
  }

  // 3) API key
  const key = process.env.MANDARINBUILDER_API_KEY
  if (!key) {
    return NextResponse.json(
      { error: "Server error: missing API key." },
      { status: 500 }
    )
  }

  // 4) Direct fetch to OpenAI TTS endpoint
  const apiRes = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "tts-1", voice, input: text }),
  })

  if (apiRes.status === 429) {
    // quota hit → fallback
    try {
      return await getGoogleTTS(text)
    } catch {
      return NextResponse.json(
        { error: "Voice service unavailable (Google fallback failed)." },
        { status: 503 }
      )
    }
  }

  if (apiRes.status === 401 || apiRes.status === 402) {
    return NextResponse.json(
      { error: "TTS unauthorized—check billing & API key." },
      { status: 403 }
    )
  }

  if (!apiRes.ok) {
    return NextResponse.json(
      { error: "Text-to-speech service is unavailable." },
      { status: 503 }
    )
  }

  // 5) Success: return audio
  const arrayBuffer = await apiRes.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString("base64")
  return NextResponse.json({ text, audioData: `data:audio/mp3;base64,${base64}` })
}
