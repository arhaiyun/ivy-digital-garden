# 媒体资源

本目录存放 **精选** 照片与视频，通过 [Git LFS](https://git-lfs.github.com/) 纳入版本管理。

## 目录约定

```
media/
├── photos/
│   └── YYYY/MM/
├── videos/
│   └── YYYY/MM/
├── audio/
│   └── YYYY/MM/
└── viewer/          # 构建产物（npm run build:all 生成）
```

## 使用建议

- 每月精选 5–15 张入仓即可，原片可留在手机相册 / iCloud
- 单文件建议 &lt; 20MB（视频更宜短片段）
- 在 Markdown 中引用：`![说明](/photos/2026/06/xxx.jpg)`、`<video controls src="/videos/...">`、`<audio controls src="/audio/...">`
- 批量导入：`npm run import:media -- --from ~/Downloads/batch --date 2026-06-10 --title "第一次去公园"`

## 首次启用 LFS

```bash
git lfs install
git add .gitattributes media/
```

详见 [docs/guide/media.md](../docs/guide/media.md)。
