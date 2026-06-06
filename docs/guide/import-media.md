# 批量导入媒体

把文件夹里的照片、视频、音频一次性导入到 `media/`，并自动生成 catalog 与日记草稿。

## 命令

```bash
npm run import:media -- \
  --from ~/Downloads/ivy-batch \
  --date 2026-06-10 \
  --type journal \
  --title "第一次去公园"
```

## 参数

| 参数 | 必填 | 说明 |
|------|------|------|
| `--from` | ✅ | 源文件夹 |
| `--date` | ✅ | `YYYY-MM-DD` |
| `--title` | ✅ | 条目标题 |
| `--type` | | 默认 `journal` |
| `--slug` | | 自定义 id，默认由日期+标题生成 |
| `--no-content` | | 只写 catalog，不生成 Markdown |
| `--dry-run` | | 预览，不写入文件 |

## 导入后

```bash
npm run catalog:build   # 刷新 catalog.json
npm run build:all       # 重建文档站 + 资源总览
```
