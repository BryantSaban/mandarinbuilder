// lib/getHsk.ts
import lvl1 from "../data/hsk-level-1.json"
import lvl2 from "../data/hsk-level-2.json"
import lvl3 from "../data/hsk-level-3.json"
import lvl4 from "../data/hsk-level-4.json"
import lvl5 from "../data/hsk-level-5.json"
import lvl6 from "../data/hsk-level-6.json"

export interface HskEntry {
  word: string
  pinyin: string
  definitions: string[]
  sentence: string
  sentence_translation: string
  level: number
  audioSrc?: string
}

function transform(raw: any[], level: number): HskEntry[] {
  return raw.map((e) => ({
    word: e.hanzi || e.word,
    pinyin: e.pinyin,
    definitions: e.translations || e.definitions || [],
    sentence: e.sentence || "",
    sentence_translation: e.sentence_translation || "",
    level,
    audioSrc: e.audioSrc,
  }))
}

// Combine all HSK levels into one array
const allEntries: HskEntry[] = [
  ...transform(lvl1, 1),
  ...transform(lvl2, 2),
  ...transform(lvl3, 3),
  ...transform(lvl4, 4),
  ...transform(lvl5, 5),
  ...transform(lvl6, 6),
]

/**
 * Returns the full HSK 1–6 dataset
 * @returns {HskEntry[]}
 */
export function getHsk(): HskEntry[] {
  return allEntries
}
