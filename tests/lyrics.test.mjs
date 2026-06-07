import { test } from 'node:test'
import assert from 'node:assert/strict'
import { findActiveLineIndex, parseLrc } from '../shared/lyrics/parse-lrc.mjs'

test('parseLrc extracts timed lines and skips metadata', () => {
  const lrc = `[ti:稻香]
[00:10.00]第一句
[00:15.50]第二句`
  const lines = parseLrc(lrc)
  assert.equal(lines.length, 2)
  assert.equal(lines[0].text, '第一句')
  assert.equal(lines[0].time, 10)
  assert.equal(lines[1].time, 15.5)
})

test('findActiveLineIndex returns current lyric line', () => {
  const lines = [
    { time: 10, text: 'a' },
    { time: 20, text: 'b' },
    { time: 30, text: 'c' },
  ]
  assert.equal(findActiveLineIndex(lines, 9), -1)
  assert.equal(findActiveLineIndex(lines, 10), 0)
  assert.equal(findActiveLineIndex(lines, 25), 1)
  assert.equal(findActiveLineIndex(lines, 30), 2)
})
