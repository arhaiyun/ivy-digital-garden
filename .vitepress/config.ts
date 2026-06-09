import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitepress'
import { parse as parseYaml } from 'yaml'
import { buildSidebar } from './sidebar.mjs'

const ivyYaml = parseYaml(readFileSync('data/ivy.yaml', 'utf8')) as {
  profile?: { birth_date?: string }
}

export default defineConfig({
  lang: 'zh-CN',
  title: "Ivy 糖果云朵",
  description: 'Ivy 小公主的成长档案 — 家人私密',
  srcDir: 'content',
  outDir: '.vitepress/dist',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  head: [
    ['meta', { name: 'robots', content: 'noindex, nofollow' }],
  ],

  themeConfig: {
    ivyBirthDate: ivyYaml.profile?.birth_date ?? '',
    nav: [
      { text: '首页', link: '/' },
      { text: '资源总览', link: '/viewer/' },
      { text: '日记', link: '/journal/' },
      { text: '里程碑', link: '/milestones/' },
      { text: '健康', link: '/health/' },
      { text: '家族', link: '/family/' },
      { text: '作品', link: '/creative/' },
      { text: '愿望', link: '/wishes/' },
      { text: '歌单', link: '/playlist/' },
    ],
    sidebar: {
      '/journal/': [{ text: '成长日记', items: buildSidebar('content', 'journal') }],
      '/milestones/': [{ text: '里程碑', items: buildSidebar('content', 'milestones') }],
      '/health/': [{ text: '健康记录', items: buildSidebar('content', 'health') }],
      '/family/': [{ text: '家族故事', items: buildSidebar('content', 'family') }],
      '/creative/': [{ text: '作品存档', items: buildSidebar('content', 'creative') }],
      '/wishes/': [{ text: '愿望清单', items: buildSidebar('content', 'wishes') }],
      '/playlist/': [{ text: '成长歌单', items: buildSidebar('content', 'playlist') }],
    },
    footer: {
      message: '仅供家人查看 · 请勿公开索引',
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    outline: { label: '目录' },
    lastUpdated: {
      text: '更新于',
      formatOptions: { dateStyle: 'medium', timeStyle: 'short' } as const,
    },
  },

  vite: {
    // 将 media/ 作为静态资源根目录，Markdown 中用 /photos/... 引用
    publicDir: 'media',
    plugins: [
      {
        name: 'ivy-public-media',
        enforce: 'pre',
        resolveId(source: string) {
          if (/^\/(photos|videos|audio|lyrics)\//.test(source)) {
            return { id: source, external: true }
          }
        },
      },
    ],
  },
})
