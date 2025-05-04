// lib/getHsk.ts
import lvl1 from '../data/hsk-vocab-json/hsk-level-1.json'
import lvl2 from '../data/hsk-vocab-json/hsk-level-2.json'
import lvl3 from '../data/hsk-vocab-json/hsk-level-3.json'
import lvl4 from '../data/hsk-vocab-json/hsk-level-4.json'
import lvl5 from '../data/hsk-vocab-json/hsk-level-5.json'
import lvl6 from '../data/hsk-vocab-json/hsk-level-6.json'

function transform(raw: any[], level: number) {
  return raw.map(e => ({
    word: e.hanzi,
    pinyin: e.pinyin,
    definitions: e.translations,
    sentence: e.sentence || '',
    sentence_translation: e.sentence_translation || '',
    level,
  }))
}

const allEntries = [
  ...transform(lvl1, 1),
  ...transform(lvl2, 2),
  ...transform(lvl3, 3),
  ...transform(lvl4, 4),
  ...transform(lvl5, 5),
  ...transform(lvl6, 6),
]

export function getHsk() {
  return allEntries
}
