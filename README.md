# Ivy 的数字花园

为 **Ivy** 打造的成长档案：用 Markdown 长久保存文字与记忆，用 VitePress 生成仅供家人浏览的站点；精选照片通过 Git LFS 与仓库一同版本管理。

## 项目结构

```
ivy-digital-garden/
├── content/           # 全部正文（VitePress 内容源）
│   ├── journal/       # 成长日记
│   ├── milestones/    # 里程碑
│   ├── health/        # 健康记录
│   ├── family/        # 家族故事
│   ├── creative/      # 作品存档
│   └── wishes/        # 愿望清单
├── media/             # 照片、视频（Git LFS）
├── templates/         # 写作模板
├── data/ivy.yaml      # Ivy 档案与标签
├── docs/guide/        # 使用说明
├── .vitepress/        # 站点配置
└── scripts/           # 辅助脚本
```

## 快速开始

1. 填写 `data/ivy.yaml` 中的出生日期
2. `pnpm install && pnpm dev` 本地预览
3. 复制 `templates/` 或使用 `./scripts/new-entry.sh journal 2026-06-10 标题`
4. `git lfs install` 后添加 `media/photos/` 中的精选图

详细说明见 [docs/guide/getting-started.md](./docs/guide/getting-started.md)。

## 技术栈

- **内容**：Markdown + YAML frontmatter
- **站点**：[VitePress](https://vitepress.dev/)（中文、私有部署友好）
- **媒体**：Git LFS

## 隐私

仓库与站点均按 **家人私密** 设计。请勿将健康细节设为公开可见性。见 [docs/guide/privacy.md](./docs/guide/privacy.md)。

---

*愿 Ivy 的每一个平凡日子，都有人认真记下。*
