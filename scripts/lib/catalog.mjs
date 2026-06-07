import { readFileSync, existsSync } from 'node:fs'
import { basename, join, relative } from 'node:path'
import YAML from 'yaml'

export function parseFrontmatterYaml(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  return YAML.parse(match[1]) || {}
}

export const ASSET_KINDS = ['photo', 'video', 'audio']
export const MEDIA_DIRS = {
  photo: 'photos',
  video: 'videos',
  audio: 'audio',
}

const EXT_KIND = {
  jpg: 'photo',
  jpeg: 'photo',
  png: 'photo',
  gif: 'photo',
  webp: 'photo',
  heic: 'photo',
  mp4: 'video',
  mov: 'video',
  m4v: 'video',
  webm: 'video',
  m4a: 'audio',
  mp3: 'audio',
  wav: 'audio',
  aac: 'audio',
  caf: 'audio',
}

export function kindFromPath(filePath) {
  const ext = basename(filePath).split('.').pop()?.toLowerCase()
  return EXT_KIND[ext] || null
}

export function publicUrl(mediaPath) {
  const normalized = mediaPath.replace(/^media\//, '')
  const [folder, ...rest] = normalized.split('/')
  return `/${folder}/${rest.join('/')}`
}

export function parseMarkdownFile(root, filePath) {
  const markdown = readFileSync(filePath, 'utf8')
  const frontmatter = parseFrontmatterYaml(markdown)
  const rel = relative(root, filePath)
  const stem = basename(filePath, '.md')
  const section = rel.split('/')[1]
  const id = stem
  const assetsFromBody = extractAssetsFromMarkdown(markdown, root)
  const assetsFromFrontmatter = normalizeAssets(frontmatter.assets, root)

  const links = normalizeLinks(frontmatter.links)

  return {
    id,
    date: frontmatter.date || dateFromStem(stem),
    type: frontmatter.type || section,
    title: frontmatter.title || titleFromStem(stem),
    visibility: frontmatter.visibility || 'family',
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : splitTags(frontmatter.tags),
    author: frontmatter.author || '',
    artist: frontmatter.artist || '',
    ivy_age_months: frontmatter.ivy_age_months ?? null,
    scene: frontmatter.scene || '',
    memory: frontmatter.memory || '',
    links,
    content: rel,
    link: `/${section}/${stem}`,
    assets: mergeAssets(assetsFromFrontmatter, assetsFromBody),
    summary: frontmatter.memory || excerptFromMarkdown(markdown),
  }
}

export function loadCatalogYaml(root, filePath) {
  const raw = readFileSync(filePath, 'utf8')
  const data = YAML.parse(raw)
  if (!data?.id) {
    throw new Error(`${filePath} 缺少 id`)
  }
  return {
    ...data,
    assets: normalizeAssets(data.assets, root),
  }
}

export function normalizeAssets(assets, root) {
  if (!assets) return []
  const list = Array.isArray(assets) ? assets : [assets]
  return list
    .map((asset) => {
      if (typeof asset === 'string') {
        const kind = kindFromPath(asset)
        if (!kind) return null
        return buildAsset({ kind, path: asset }, root)
      }
      return buildAsset(asset, root)
    })
    .filter(Boolean)
}

function buildAsset(asset, root) {
  if (!asset?.path) return null
  const path = asset.path.replace(/^\//, '')
  const kind = asset.kind || kindFromPath(path)
  if (!kind || !ASSET_KINDS.includes(kind)) return null
  const full = join(root, path)
  return {
    id: asset.id || basename(path),
    kind,
    path,
    url: publicUrl(path.startsWith('media/') ? path : `media/${path}`),
    caption: asset.caption || '',
    exists: existsSync(full),
  }
}

function extractAssetsFromMarkdown(markdown, root) {
  const body = markdown.replace(/^---[\s\S]*?---\n?/, '')
  const patterns = [
    /!\[[^\]]*]\((\/(?:photos|videos|audio)\/[^)]+)\)/g,
    /<(?:video|audio)[^>]+src=["'](\/(?:videos|audio)\/[^"']+)["']/g,
    /\[[^\]]*]\((\/(?:photos|videos|audio)\/[^)]+)\)/g,
  ]
  const urls = new Set()
  for (const pattern of patterns) {
    for (const match of body.matchAll(pattern)) {
      urls.add(match[1])
    }
  }

  return [...urls].map((url) => {
    const folder = url.split('/')[1]
    const kind = folder === 'photos' ? 'photo' : folder === 'videos' ? 'video' : 'audio'
    const path = `media${url}`
    return buildAsset({ kind, path, url }, root)
  })
}

function mergeAssets(...groups) {
  const map = new Map()
  for (const group of groups) {
    for (const asset of group) {
      map.set(asset.path, asset)
    }
  }
  return [...map.values()]
}

function excerptFromMarkdown(markdown) {
  const body = markdown
    .replace(/^---[\s\S]*?---\n?/, '')
    .replace(/[#>*`\[\]()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return body.slice(0, 120)
}

export function normalizeLinks(links) {
  if (!links) return []
  const list = Array.isArray(links) ? links : [links]
  return list
    .filter((item) => item?.url)
    .map((item) => ({
      platform: item.platform || 'other',
      url: String(item.url),
      label: platformLabel(item.platform),
    }))
}

export function platformLabel(platform) {
  const labels = {
    netease: '网易云',
    qq: 'QQ音乐',
    apple: 'Apple Music',
    spotify: 'Spotify',
    youtube: 'YouTube',
    other: '链接',
  }
  return labels[platform] || platform
}

function splitTags(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  return String(value)
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function dateFromStem(stem) {
  return stem.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || ''
}

function titleFromStem(stem) {
  return stem.replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

export function buildStats(entries) {
  const byType = {}
  const byKind = { photo: 0, video: 0, audio: 0 }
  let missingAssets = 0

  for (const entry of entries) {
    byType[entry.type] = (byType[entry.type] || 0) + 1
    for (const asset of entry.assets) {
      byKind[asset.kind] = (byKind[asset.kind] || 0) + 1
      if (!asset.exists) missingAssets += 1
    }
  }

  return {
    entries: entries.length,
    byType,
    byKind,
    missingAssets,
    updatedAt: new Date().toISOString(),
  }
}
