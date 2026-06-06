---
layout: home

hero:
  name: Ivy
  text: 的数字花园
  tagline: 成长日记 · 里程碑 · 家族记忆 — 仅供家人

features:
  - title: 成长日记
    details: 日常点滴与写给 Ivy 的话
    link: /journal/
  - title: 里程碑
    details: 记录每一个「第一次」
    link: /milestones/
  - title: 健康
    details: 体检与疫苗（敏感信息，保持私密）
    link: /health/
  - title: 资源总览
    details: 时间轴、媒体墙与统计仪表盘
    link: /viewer/
  - title: 更多
    details: 家族故事、作品与愿望清单
    link: /family/
---

这里是属于 **Ivy** 的成长档案。

## 快速开始

1. 在 `data/ivy.yaml` 填写 Ivy 的出生日期
2. 从 `templates/` 复制模板到对应 `content/` 子目录
3. 精选照片放入 `media/photos/`，用 Git LFS 管理
4. 本地预览站点：`npm run dev`

## 栏目

| 栏目 | 路径 | 说明 |
|------|------|------|
| 成长日记 | [journal/](./journal/) | 日常与写给 Ivy 的话 |
| 里程碑 | [milestones/](./milestones/) | 人生第一次 |
| 健康 | [health/](./health/) | 体检、疫苗（敏感，仅家人） |
| 家族 | [family/](./family/) | 故事与亲友留言 |
| 作品 | [creative/](./creative/) | 涂鸦、手工等 |
| 愿望 | [wishes/](./wishes/) | 对未来的期许 |

> 本仓库建议保持 **GitHub 私有**，部署站点时启用访问控制。
