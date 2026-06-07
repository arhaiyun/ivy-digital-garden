# Catalog 资源目录

每条记忆对应一份 catalog 清单，把 **文字 + 照片 + 视频 + 音频** 绑在一起。

## 文件位置

- 手工维护：`data/catalog/<id>.yaml`
- 自动生成：`data/catalog.json`（运行 `npm run catalog:build`）

## 字段

| 字段 | 必填 | 说明 |
|------|------|------|
| `id` | ✅ | 与 content 文件名一致，如 `2026-06-04-花园启程` |
| `date` | ✅ | `YYYY-MM-DD` |
| `type` | ✅ | `journal` / `milestone` / `health` / `family` / `creative` / `wish` / `playlist` |
| `title` | ✅ | 标题 |
| `content` | 推荐 | Markdown 路径 |
| `visibility` | 推荐 | `family` / `private` / `public` |
| `assets` | 可选 | 媒体列表 |

## assets 示例

```yaml
assets:
  - kind: photo
    path: media/photos/2026/06/ivy-smile.jpg
    caption: 第一次笑
  - kind: video
    path: media/videos/2026/06/first-laugh.mp4
    caption: 录像
  - kind: audio
    path: media/audio/2026/06/dad-message.m4a
    caption: 爸爸留言
```

Markdown 正文里引用 `/photos/...`、`/videos/...`、`/audio/...` 也会被自动收录进 catalog。
