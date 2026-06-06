import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { test } from 'node:test'
import { validateContent } from '../scripts/validate-content.mjs'

async function fixture(t) {
  const { mkdtemp } = await import('node:fs/promises')
  const { tmpdir } = await import('node:os')
  const root = await mkdtemp(join(tmpdir(), 'ivy-content-'))

  await mkdir(join(root, 'content', 'journal'), { recursive: true })
  await mkdir(join(root, 'content', 'health'), { recursive: true })
  await mkdir(join(root, 'content', 'milestones'), { recursive: true })
  await mkdir(join(root, 'data'), { recursive: true })
  await writeFile(join(root, 'data', 'ivy.yaml'), 'profile:\n  birth_date: "2026-03-05"\n')
  t.after(async () => {})

  return root
}

test('validateContent accepts complete family entries', async (t) => {
  const root = await fixture(t)
  await writeFile(
    join(root, 'content', 'journal', '2026-06-10-第一次笑.md'),
    '---\ntitle: 第一次笑\ndate: 2026-06-10\ntype: journal\nvisibility: family\n---\n# 第一次笑\n',
  )

  assert.deepEqual(await validateContent(root), [])
})

test('validateContent reports missing required fields, public health records, and example files', async (t) => {
  const root = await fixture(t)
  await writeFile(
    join(root, 'content', 'journal', '2026-06-10-第一次笑.md'),
    '---\ntitle: 第一次笑\ndate: 2026-06-11\ntype: journal\n---\n# 第一次笑\n',
  )
  await writeFile(
    join(root, 'content', 'health', '2026-06-12-体检.md'),
    '---\ntitle: 体检\ndate: 2026-06-12\ntype: health\nvisibility: public\n---\n# 体检\n',
  )
  await writeFile(
    join(root, 'content', 'milestones', '示例-请删除或改写.md'),
    '---\ntitle: 示例\ndate: 2026-06-04\ntype: milestone\nvisibility: family\n---\n# 示例\n',
  )

  const messages = (await validateContent(root)).map((issue) => issue.message)

  assert.ok(messages.includes('缺少必填字段: visibility'))
  assert.ok(messages.includes('文件名日期 2026-06-10 与 frontmatter date 2026-06-11 不一致'))
  assert.ok(messages.includes('健康记录不能设置为 public'))
  assert.ok(messages.includes('示例文件仍在内容目录中，请删除或改写'))
})
