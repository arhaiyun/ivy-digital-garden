import assert from 'node:assert/strict'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { buildSidebar } from '../.vitepress/sidebar.mjs'

test('buildSidebar lists dated entries newest first and skips index pages', async (t) => {
  const contentRoot = await mkdtemp(join(tmpdir(), 'ivy-sidebar-'))
  await mkdir(join(contentRoot, 'journal'), { recursive: true })
  await writeFile(join(contentRoot, 'journal', 'index.md'), '# Journal\n')
  await writeFile(
    join(contentRoot, 'journal', '2026-06-04-花园启程.md'),
    '---\ntitle: 花园启程\ndate: 2026-06-04\n---\n# 花园启程\n',
  )
  await writeFile(
    join(contentRoot, 'journal', '2026-06-10-第一次笑.md'),
    '---\ntitle: 第一次笑\ndate: 2026-06-10\n---\n# 第一次笑\n',
  )

  assert.deepEqual(buildSidebar(contentRoot, 'journal'), [
    { text: '栏目首页', link: '/journal/' },
    { text: '第一次笑', link: '/journal/2026-06-10-第一次笑' },
    { text: '花园启程', link: '/journal/2026-06-04-花园启程' },
  ])
})
