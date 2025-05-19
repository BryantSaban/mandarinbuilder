"use client"

import { useState } from "react"
import { getHsk } from "../lib/getHsk"

/**
 * @param {{ word: string }} props
 */
export default function HoverCard({ word }) {
  const entry = getHsk().find((e) => e.word === word)
  const [playing, setPlaying] = useState(false) // Move useState to the top

  if (!entry) return null

  const audio = entry.audioSrc ? new Audio(entry.audioSrc) : null

  return (
    <div className="w-64 p-4 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-2">
        <h2 className="text-2xl font-bold">
          {entry.word} <span className="text-gray-500 text-lg">({entry.pinyin})</span>
        </h2>
        {audio && (
          <button
            className="ml-auto p-1 hover:bg-gray-100 rounded"
            onClick={() => {
              setPlaying(true)
              audio.play().finally(() => setPlaying(false))
            }}
            disabled={playing}
            aria-label="Play pronunciation"
          >
            🔈
          </button>
        )}
      </div>

      <p className="italic text-sm text-gray-700 mb-3">
        {Array.isArray(entry.definitions) ? entry.definitions.join("； ") : entry.definitions}
      </p>

      {entry.sentence && (
        <>
          <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-800 mb-1">
            "{entry.sentence}"
          </blockquote>
          <p className="text-gray-600 text-sm">— {entry.sentence_translation}</p>
        </>
      )}

      {entry.level && (
        <div className="mt-2 text-xs font-semibold inline-block py-1 px-2 rounded-full bg-blue-100 text-blue-700">
          HSK Level {entry.level}
        </div>
      )}
    </div>
  )
}
