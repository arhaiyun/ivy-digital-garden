import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Mirror JournalDate.parseDateParts logic for regression tests
function parseDateParts(raw) {
  if (!raw) return null

  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return {
      year: raw.getFullYear(),
      month: raw.getMonth() + 1,
      day: raw.getDate(),
    }
  }

  const match = String(raw).trim().match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return null

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }
}

function formatLabel(date, ivyAgeDays) {
  const parts = parseDateParts(date)
  if (!parts) return ''
  const text = `${parts.year}年${parts.month}月${parts.day}日`
  if (ivyAgeDays == null || ivyAgeDays === '') return text
  return `${text} · 出生第 ${Number(ivyAgeDays) + 1} 天`
}

test('formatLabel handles plain YYYY-MM-DD strings', () => {
  assert.equal(formatLabel('2026-03-05', 0), '2026年3月5日 · 出生第 1 天')
})

test('formatLabel handles ISO datetime strings from YAML', () => {
  assert.equal(
    formatLabel('2026-03-05T00:00:00.000Z', 93),
    '2026年3月5日 · 出生第 94 天',
  )
})

test('formatLabel handles Date objects', () => {
  const date = new Date(2026, 2, 5)
  assert.equal(formatLabel(date, null), '2026年3月5日')
})

test('JournalDate component exists in theme', () => {
  const source = readFileSync(
    join(process.cwd(), '.vitepress/theme/components/JournalDate.vue'),
    'utf8',
  )
  assert.match(source, /parseDateParts/)
})
