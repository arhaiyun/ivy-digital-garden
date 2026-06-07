# 成长歌单

**一首歌一篇**，以本地音频为主（`media/audio/`），不放外链。

## 新建

```bash
./scripts/new-entry.sh playlist 2026-06-10 世上只有妈妈好
```

## Frontmatter

| 字段 | 说明 |
|------|------|
| `artist` | 演唱者/演奏者 |
| `ivy_age_months` | 开始常听时的月龄 |
| `scene` | 睡前 / 洗澡 / 外出 等 |
| `memory` | 为什么选这首（短述） |
| `assets` | 本地音频（`media/audio/`，必填） |

## 下载音频

```bash
./scripts/fetch-playlist-audio.sh "稻香 周杰伦" 2026/06 01-daoxiang
```

## 本地哼唱/录音

1. 放入 `media/audio/YYYY/MM/`
2. 在 `assets` 或正文中引用：`<audio controls src="/audio/2026/03/hum.m4a"></audio>`

歌单会出现在文档站「歌单」栏目，以及资源总览的时间轴中。
