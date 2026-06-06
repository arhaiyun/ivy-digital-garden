import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'

export function buildSidebar(contentRoot, section) {
  const sectionDir = join(contentRoot, section)
  const entries = readdirSync(sectionDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md')
    .map((entry) => {
      const filePath = join(sectionDir, entry.name)
      const frontmatter = parseFrontmatter(readFileSync(filePath, 'utf8'))
      const stem = basename(entry.name, '.md')

      return {
        date: frontmatter.date || dateFromFilename(entry.name) || '',
        text: frontmatter.title || titleFromFilename(stem),
        link: `/${section}/${stem}`,
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.link.localeCompare(a.link))
    .map(({ text, link }) => ({ text, link }))

  return [{ text: '栏目首页', link: `/${section}/` }, ...entries]
}

export function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  return Object.fromEntries(
    match[1]
      .split('\n')
      .map((line) => line.match(/^([A-Za-z0-9_]+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, key, rawValue]) => [key, normalizeValue(rawValue)]),
  )
}

function normalizeValue(value) {
  return value.replace(/^["']|["']$/g, '').trim()
}

function dateFromFilename(filename) {
  return filename.match(/^(\d{4}-\d{2}-\d{2})-/)?.[1]
}

function titleFromFilename(stem) {
  return stem.replace(/^\d{4}-\d{2}-\d{2}-/, '')
}
