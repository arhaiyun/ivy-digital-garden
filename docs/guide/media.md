# 媒体与 Git LFS

## 为什么用 LFS

照片与视频体积大，普通 Git 会让仓库膨胀。本仓库通过 `.gitattributes` 对 `media/` 及常见扩展名启用 **Git LFS**。

## 首次设置

```bash
# 安装 Git LFS（macOS）
brew install git-lfs

# 在本仓库启用
git lfs install
git lfs track
```

添加媒体后：

```bash
git add media/photos/2026/06/example.jpg
git status   # 应显示 LFS 指针文件
```

## 容量建议

| 类型 | 建议 |
|------|------|
| 照片 | 每月精选 5–15 张，单张 &lt; 5MB |
| 视频 | 短片段（&lt; 20MB），长视频仅存网盘链接 |
| 原片 | 留在手机 / iCloud，仓库只保留「故事相关」的精选 |

## 仅链接、不入库

若某条视频很大，可在 Markdown 中写：

```markdown
[观看视频（iCloud 链接）](https://...)
```

并在 frontmatter 的 `tags` 加 `external-media`。
