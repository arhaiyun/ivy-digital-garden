#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { parseFrontmatter } from '../.vitepress/sidebar.mjs'

const REQUIRED_FIELDS = ['title', 'date', 'type', 'visibility']

export async function validateContent(root = process.cwd()) {
  const contentRoot = join(root, 'content')
  const files = await findMarkdownFiles(contentRoot)
  const issues = []

  for (const file of files) {
    const rel = relative(root, file)
    const markdown = await readFile(file, 'utf8')
    const frontmatter = parseFrontmatter(markdown)

    if (file.endsWith('示例-请删除或改写.md')) {
      issues.push({ file: rel, message: '示例文件仍在内容目录中，请删除或改写' })
    }

    if (file.endsWith('index.md')) continue

    for (const field of REQUIRED_FIELDS) {
      if (!frontmatter[field]) {
        issues.push({ file: rel, message: `缺少必填字段: ${field}` })
      }
    }

    const filenameDate = rel.match(/\/(\d{4}-\d{2}-\d{2})-/)?.[1]
    if (filenameDate && frontmatter.date && filenameDate !== frontmatter.date) {
      issues.push({
        file: rel,
        message: `文件名日期 ${filenameDate} 与 frontmatter date ${frontmatter.date} 不一致`,
      })
    }

    if (frontmatter.type === 'health' && frontmatter.visibility === 'public') {
      issues.push({ file: rel, message: '健康记录不能设置为 public' })
    }
  }

  return issues
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
  const issues = await validateContent()
  for (const issue of issues) {
    console.error(`${issue.file}: ${issue.message}`)
  }
  process.exitCode = issues.length === 0 ? 0 : 1
}
