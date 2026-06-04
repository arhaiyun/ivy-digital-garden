# 使用指南

## 1. 填写 Ivy 档案

编辑 `data/ivy.yaml`，至少填写 `birth_date`（`YYYY-MM-DD`）。之后可在条目的 frontmatter 里写 `ivy_age_days`，或日后用脚本自动计算。

## 2. 写一篇记录

```bash
# 例：复制日记模板
cp templates/journal.md content/journal/2026-06-10-第一次笑.md
```

编辑 frontmatter：

| 字段 | 说明 |
|------|------|
| `title` | 标题 |
| `date` | 事件日期 |
| `type` | `journal` / `milestone` / `health` / `family` / `creative` / `wish` |
| `visibility` | `family`（默认）/ `private` / `public` |
| `tags` | 标签数组 |

## 3. 添加照片

1. 放入 `media/photos/YYYY/MM/文件名.jpg`
2. 确保已 `git lfs install`
3. Markdown 引用：`![描述](/photos/YYYY/MM/文件名.jpg)`

## 4. 本地预览站点

```bash
pnpm install
pnpm dev
```

浏览器打开终端提示的地址（通常 `http://localhost:5173`）。

## 5. 构建与部署（家人私密）

```bash
pnpm build
# 产物在 .vitepress/dist
```

建议：

- GitHub 仓库设为 **Private**
- 部署到 Cloudflare Pages / Vercel / GitHub Pages 时开启 **密码保护** 或仅邀请家人账号
- 已配置 `noindex`，降低被搜索引擎收录的概率

详见 [privacy.md](./privacy.md)、[media.md](./media.md)。

## 6. 协作（家人共同记录）

- 为家人开通仓库 Collaborator（私有库）
- 约定：健康类仅 `visibility: family` 或 `private`
- 提交信息建议：`journal: 2026-06-10 第一次笑` 便于检索
