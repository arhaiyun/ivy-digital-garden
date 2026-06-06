#!/usr/bin/env node
import { cp, mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'

const root = process.cwd()
const source = join(root, 'viewer', 'dist')
const target = join(root, 'media', 'viewer')

export async function syncViewer(projectRoot = root) {
  const dist = join(projectRoot, 'viewer', 'dist')
  const dest = join(projectRoot, 'media', 'viewer')
  const siteDist = join(projectRoot, '.vitepress', 'dist', 'viewer')

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

  return dest
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dest = await syncViewer()
  console.log(`viewer synced -> ${dest}`)
}
