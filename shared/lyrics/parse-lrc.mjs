/**
 * 解析 LRC 歌词为 { time, text }[]，time 单位为秒
 */
export function parseLrc(text, offsetMs = 0) {
  const offset = Number(offsetMs) / 1000 || 0
  const lines = []
  const metaPattern = /^\[(ti|ar|al|by|offset|tool|ve):/i

  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line || metaPattern.test(line)) continue

    const timeMatches = [...line.matchAll(/\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g)]
    if (!timeMatches.length) continue

    const textPart = line.replace(/\[\d{1,2}:\d{2}(?:\.\d{1,3})?\]/g, '').trim()
    if (!textPart) continue

    const last = timeMatches[timeMatches.length - 1]
    const min = Number(last[1])
    const sec = Number(last[2])
    const frac = last[3] ? Number(last[3].padEnd(3, '0')) / 1000 : 0
    const time = min * 60 + sec + frac + offset

    lines.push({ time, text: textPart })
  }

  return lines.sort((a, b) => a.time - b.time)
}

export function findActiveLineIndex(lines, currentTime) {
  if (!lines.length) return -1
  let index = -1
  for (let i = 0; i < lines.length; i++) {
    if (currentTime >= lines[i].time) index = i
    else break
  }
  return index
}
