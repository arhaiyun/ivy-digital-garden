#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import YAML from 'yaml'
import { buildStats, loadCatalogYaml, parseMarkdownFile } from './lib/catalog.mjs'

const root = process.cwd()

export async function buildCatalog(projectRoot = root) {
  const contentRoot = join(projectRoot, 'content')
  const catalogDir = join(projectRoot, 'data', 'catalog')
  const ivy = YAML.parse(await readFile(join(projectRoot, 'data', 'ivy.yaml'), 'utf8'))

  const contentEntries = await collectContentEntries(contentRoot, projectRoot)
  const manualEntries = await collectManualCatalog(catalogDir, projectRoot)
  const merged = mergeEntries(contentEntries, manualEntries)
  const stats = buildStats(merged)

  const payload = {
    profile: ivy.profile,
    garden: ivy.garden,
    stats,
    entries: merged.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-CN')),
  }

  await mkdir(join(projectRoot, 'data'), { recursive: true })
  await writeFile(join(projectRoot, 'data', 'catalog.json'), `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  return payload
}

async function collectContentEntries(contentRoot, projectRoot) {
  const files = await findMarkdownFiles(contentRoot)
  return files
    .filter((file) => !file.endsWith('index.md') && !file.includes('示例'))
    .map((file) => parseMarkdownFile(projectRoot, file))
}

async function collectManualCatalog(catalogDir, projectRoot) {
  try {
    const files = await readdir(catalogDir)
    const yamlFiles = files.filter((name) => name.endsWith('.yaml') || name.endsWith('.yml'))
    return Promise.all(yamlFiles.map((name) => loadCatalogYaml(projectRoot, join(catalogDir, name))))
  } catch {
    return []
  }
}

function mergeEntries(contentEntries, manualEntries) {
  const map = new Map(contentEntries.map((entry) => [entry.id, entry]))

  for (const manual of manualEntries) {
    const existing = map.get(manual.id)
    if (!existing) {
      map.set(manual.id, {
        ...manual,
        link: manual.link || guessLink(manual),
        assets: manual.assets || [],
        summary: manual.summary || '',
      })
      continue
    }

    map.set(manual.id, {
      ...existing,
      ...manual,
      assets: mergeAssets(existing.assets, manual.assets || []),
      tags: manual.tags?.length ? manual.tags : existing.tags,
    })
  }

  return [...map.values()]
}

function mergeAssets(a = [], b = []) {
  const map = new Map()
  for (const asset of [...a, ...b]) {
    map.set(asset.path, asset)
  }
  return [...map.values()]
}

function guessLink(entry) {
  if (entry.content?.startsWith('content/')) {
    const rel = entry.content.replace(/^content\//, '').replace(/\.md$/, '')
    return `/${rel}`
  }
  if (entry.type) return `/${entry.type}/${entry.id}`
  return `/${entry.id}`
}

async function findMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) return findMarkdownFiles(path)
      if (entry.isFile() && entry.name.endsWith('.md')) return [path]
      return []
    }),
  )
  return nested.flat()
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const payload = await buildCatalog()
  console.log(`catalog.json: ${payload.entries.length} entries, ${payload.stats.byKind.photo + payload.stats.byKind.video + payload.stats.byKind.audio} assets`)
}
