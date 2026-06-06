#!/usr/bin/env node
import { copyFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { buildCatalog } from './build-catalog.mjs'

const root = process.cwd()

export async function prepareViewer(projectRoot = root) {
  await buildCatalog(projectRoot)
  const source = join(projectRoot, 'data', 'catalog.json')
  const targetDir = join(projectRoot, 'viewer', 'public')
  await mkdir(targetDir, { recursive: true })
  await copyFile(source, join(targetDir, 'catalog.json'))
  return source
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const source = await prepareViewer()
  console.log(`viewer prepared with ${source}`)
}
