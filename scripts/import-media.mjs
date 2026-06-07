#!/usr/bin/env node
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import YAML from 'yaml'
import { kindFromPath, MEDIA_DIRS } from './lib/catalog.mjs'

const SUPPORTED = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic',
  '.mp4', '.mov', '.m4v', '.webm',
  '.m4a', '.mp3', '.wav', '.aac', '.caf',
])

export async function importMedia(options) {
  const {
    fromDir,
    date,
    type = 'journal',
    title,
    slug,
    createContent = true,
    dryRun = false,
    projectRoot = process.cwd(),
  } = options

  const root = projectRoot

  if (!fromDir || !date || !title) {
    throw new Error('缺少必填参数: --from --date --title')
  }

  const id = slug || `${date}-${slugify(title)}`
  const [year, month] = date.split('-')
  const sourceFiles = await listImportableFiles(fromDir)

  if (sourceFiles.length === 0) {
    throw new Error(`目录中没有可导入的媒体文件: ${fromDir}`)
  }

  const assets = []
  for (const [index, source] of sourceFiles.entries()) {
    const kind = kindFromPath(source)
    if (!kind) continue
    const folder = MEDIA_DIRS[kind]
    const ext = extname(source)
    const targetName = `${String(index + 1).padStart(2, '0')}-${slugify(basename(source, ext))}${ext.toLowerCase()}`
    const relativePath = join('media', folder, year, month, targetName)
    const targetPath = join(root, relativePath)

    if (!dryRun) {
      await mkdir(join(root, 'media', folder, year, month), { recursive: true })
      await copyFile(source, targetPath)
    }

    assets.push({
      kind,
      path: relativePath.replace(/\\/g, '/'),
      caption: basename(source, ext),
    })
  }

  const catalog = {
    id,
    date,
    type,
    title,
    visibility: 'family',
    content: `content/${type}/${id}.md`,
    tags: [],
    assets,
  }

  const catalogPath = join(root, 'data', 'catalog', `${id}.yaml`)
  const contentPath = join(root, 'content', type, `${id}.md`)

  if (!dryRun) {
    await mkdir(join(root, 'data', 'catalog'), { recursive: true })
    await writeFile(catalogPath, YAML.stringify(catalog), 'utf8')

    if (createContent) {
      await mkdir(join(root, 'content', type), { recursive: true })
      const template = await readFile(join(root, 'templates', `${mapTypeToTemplate(type)}.md`), 'utf8')
      const body = renderTemplate(template, { title, date, type, assets })
      await writeFile(contentPath, body, 'utf8')
    }
  }

  return { id, catalogPath, contentPath, assets }
}

async function listImportableFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (!entry.isFile()) continue
    if (!SUPPORTED.has(extname(entry.name).toLowerCase())) continue
    files.push(join(dir, entry.name))
  }
  return files.sort()
}

function mapTypeToTemplate(type) {
  const map = {
    journal: 'journal',
    milestone: 'milestone',
    health: 'health',
    family: 'family',
    creative: 'creative',
    wish: 'wish',
    playlist: 'playlist',
  }
  return map[type] || 'journal'
}

function renderTemplate(template, { title, date, type, assets }) {
  const mediaBlocks = assets
    .map((asset) => {
      const url = publicAssetUrl(asset.path)
      if (asset.kind === 'photo') return `![${asset.caption}](${url})`
      if (asset.kind === 'video') return `<video controls src="${url}"></video>`
      if (asset.kind === 'audio') return `<audio controls src="${url}"></audio>`
      return ''
    })
    .join('\n\n')

  return template
    .replace('title: ""', `title: "${title}"`)
    .replace('date: YYYY-MM-DD', `date: ${date}`)
    .replace('type: journal', `type: ${type}`)
    .replace('ivy_age_days: null', 'ivy_age_days: null')
    .replace('## 照片\n\n<!--', `## 媒体\n\n${mediaBlocks}\n\n<!--`)
}

function publicAssetUrl(path) {
  return `/${path.replace(/^media\//, '')}`
}

function slugify(text) {
  return text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]+/g, '')
    .slice(0, 40) || 'import'
}

function parseArgs(argv) {
  const options = { createContent: true, dryRun: false }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--from') options.fromDir = argv[++i]
    else if (arg === '--date') options.date = argv[++i]
    else if (arg === '--type') options.type = argv[++i]
    else if (arg === '--title') options.title = argv[++i]
    else if (arg === '--slug') options.slug = argv[++i]
    else if (arg === '--no-content') options.createContent = false
    else if (arg === '--dry-run') options.dryRun = true
  }
  return options
}

if (import.meta.url === `file://${process.argv[1]}`) {
  importMedia(parseArgs(process.argv.slice(2)))
    .then((result) => {
      console.log(`imported ${result.assets.length} assets -> ${result.id}`)
      console.log(`catalog: ${result.catalogPath}`)
      if (result.contentPath) console.log(`content: ${result.contentPath}`)
    })
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
}
