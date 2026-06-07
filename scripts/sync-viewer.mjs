#!/usr/bin/env node
import { cp, mkdir, rm, stat } from 'node:fs/promises'
import { join } from 'node:path'

const root = process.cwd()
const MEDIA_FOLDERS = ['audio', 'photos', 'videos', 'lyrics']

export async function syncViewer(projectRoot = root) {
  const dist = join(projectRoot, 'viewer', 'dist')
  const dest = join(projectRoot, 'media', 'viewer')
  const siteDist = join(projectRoot, '.vitepress', 'dist', 'viewer')
  const siteRoot = join(projectRoot, '.vitepress', 'dist')

  await rm(dest, { recursive: true, force: true })
  await mkdir(dest, { recursive: true })
  await cp(dist, dest, { recursive: true })

  // 若文档站已构建，也同步进 dist（避免 publicDir 遗漏）
  try {
    await rm(siteDist, { recursive: true, force: true })
    await mkdir(siteDist, { recursive: true })
    await cp(dist, siteDist, { recursive: true })
  } catch {
    // dist 尚未生成时忽略
  }

  await syncMediaToSiteDist(projectRoot, siteRoot)

  return dest
}

async function syncMediaToSiteDist(projectRoot, siteRoot) {
  for (const folder of MEDIA_FOLDERS) {
    const source = join(projectRoot, 'media', folder)
    const target = join(siteRoot, folder)
    try {
      await stat(source)
    } catch {
      continue
    }
    await rm(target, { recursive: true, force: true })
    await cp(source, target, { recursive: true, filter: (src) => !src.endsWith('.gitkeep') })
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dest = await syncViewer()
  console.log(`viewer synced -> ${dest}`)
}
