import { streamText } from "ai"
import { deepinfra } from "@ai-sdk/deepinfra"

export const runtime = "nodejs"
export const maxDuration = 30 // Allow streaming responses up to 30 seconds

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Create a streaming response using the AI SDK
    const result = streamText({
      model: deepinfra("mistralai/Mixtral-8x7B-Instruct-v0.1"),
      system:
        "You are a friendly Mandarin tutor named Mei. Respond in simplified Chinese with pinyin in parentheses. Include a short English translation after each sentence. Be encouraging, and guide the user patiently. Keep responses concise and focused on helping the user learn Mandarin.",
      messages,
      temperature: 0.7,
    })

    // Return the streaming response
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Deep Infra error:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
