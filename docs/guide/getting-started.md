# 使用指南

## 1. 填写 Ivy 档案

编辑 `data/ivy.yaml`，至少填写 `birth_date`（`YYYY-MM-DD`）。之后可在条目的 frontmatter 里写 `ivy_age_days`，或日后用脚本自动计算。

## 2. 写一篇记录

```bash
# 例：从日记模板生成新条目
./scripts/new-entry.sh journal 2026-06-10 第一次笑
```

编辑 frontmatter：

| 字段 | 说明 |
|------|------|
| `title` | 标题 |
| `date` | 事件日期 |
| `type` | `journal` / `milestone` / `health` / `family` / `creative` / `wish` |
| `visibility` | `family`（默认）/ `private` / `public` |
| `tags` | 标签数组 |

## 3. 添加媒体（图 / 视频 / 音频）

**手工：**

1. 放入 `media/photos|videos|audio/YYYY/MM/`
2. `git lfs install` 后提交
3. 在 Markdown 或 `data/catalog/<id>.yaml` 的 `assets` 里绑定

**批量导入：**

```bash
npm run import:media -- --from ~/Downloads/batch --date 2026-06-10 --title "第一次去公园"
```

详见 [catalog-schema.md](./catalog-schema.md)、[import-media.md](./import-media.md)。

## 4. 本地预览

```bash
npm install
npm run build:all   # 文档站 + 资源总览
npm run preview     # http://127.0.0.1:4173
```

- 文档站：`/`
- 资源总览：`/viewer/`（时间轴、媒体墙、统计）

开发热更新：`npm run dev`（5173）、`npm run viewer:dev`（5180）

## 5. 构建与部署（家人私密）

```bash
npm run build:all
# 产物在 .vitepress/dist（含 /viewer/）
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
