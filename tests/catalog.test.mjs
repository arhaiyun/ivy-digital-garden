import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { buildCatalog } from '../scripts/build-catalog.mjs'
import { importMedia } from '../scripts/import-media.mjs'

test('buildCatalog merges content and yaml assets', async () => {
  const root = await makeFixture()
  const payload = await buildCatalog(root)

  assert.equal(payload.entries.length, 1)
  assert.equal(payload.entries[0].title, '测试日记')
  assert.equal(payload.entries[0].assets.length, 1)
  assert.equal(payload.entries[0].assets[0].kind, 'photo')
  assert.equal(payload.stats.entries, 1)

  await rm(root, { recursive: true, force: true })
})

test('importMedia creates catalog and content draft', async () => {
  const root = await makeFixture({ withImportDir: true })
  const importDir = join(root, 'imports')
  await writeFile(join(importDir, 'sample.jpg'), 'fake-image')

  const result = await importMedia({
    fromDir: importDir,
    date: '2026-06-10',
    type: 'journal',
    title: '第一次笑',
    projectRoot: root,
  })

  assert.equal(result.assets.length, 1)
  assert.match(result.catalogPath, /2026-06-10-第一次笑\.yaml$/)

  const payload = await buildCatalog(root)
  assert.equal(payload.entries.length, 2)

  await rm(root, { recursive: true, force: true })
})

async function makeFixture({ withImportDir = false } = {}) {
  const root = join(tmpdir(), `ivy-catalog-${Date.now()}`)
  await mkdir(join(root, 'content', 'journal'), { recursive: true })
  await mkdir(join(root, 'data', 'catalog'), { recursive: true })
  await mkdir(join(root, 'media', 'photos', '2026', '06'), { recursive: true })
  await mkdir(join(root, 'templates'), { recursive: true })

  await writeFile(
    join(root, 'data', 'ivy.yaml'),
    'profile:\n  name: Ivy\n  birth_date: "2026-03-05"\ngarden:\n  started_at: "2026-06-04"\n',
  )

  await writeFile(
    join(root, 'content', 'journal', '2026-06-08-测试日记.md'),
    `---
title: 测试日记
date: 2026-06-08
type: journal
visibility: family
assets:
  - kind: photo
    path: media/photos/2026/06/demo.jpg
    caption: 示例
---

# 测试日记
`,
  )

  await writeFile(join(root, 'media', 'photos', '2026', '06', 'demo.jpg'), 'img')
  await writeFile(join(root, 'templates', 'journal.md'), await readJournalTemplate())

  if (withImportDir) {
    await mkdir(join(root, 'imports'), { recursive: true })
  }

  return root
}

async function readJournalTemplate() {
  const { readFile } = await import('node:fs/promises')
  const { fileURLToPath } = await import('node:url')
  const { dirname, join } = await import('node:path')
  const here = dirname(fileURLToPath(import.meta.url))
  return readFile(join(here, '..', 'templates', 'journal.md'), 'utf8')
}
