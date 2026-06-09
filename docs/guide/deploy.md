# 部署到 GitHub Pages

线上地址（仓库名 `ivy-digital-garden`）：

**https://arhaiyun.github.io/ivy-digital-garden/**

## 一次性设置（二选一，不要混用）

构建产物已在 `gh-pages` 分支，但 **Settings → Pages 必须指向正确来源**，否则会一直 404。

### 方式 A（推荐，最快）

1. **Settings → Pages → Build and deployment**
2. **Source** 选 **Deploy from a branch**
3. **Branch** 选 **`gh-pages`**，目录 **`/ (root)`**
4. 保存，等 1–3 分钟刷新站点

### 方式 B

1. **Source** 选 **GitHub Actions**
2. 到 [Actions](https://github.com/arhaiyun/ivy-digital-garden/actions) 手动 **Run workflow** 或 push `main`
3. 首次可能需在 **Environments → github-pages** 点批准

## 若仍是 404

| 现象 | 处理 |
|------|------|
| `gh-pages` 有文件但站点 404 | 几乎一定是 Pages 源没选对：A 用分支、B 用 Actions，**不能**选 `main` |
| Actions 失败 | 查看日志；常见为 LFS 或 `npm ci` |
| 私有仓库 | 免费账号仅 **Public** 仓库可发布 Pages |
| 子页面刷新 404 | 从首页点链接进入；GitHub Pages 对 cleanUrls 支持有限 |

## 本地模拟线上构建

```bash
npm run build:pages
npx vitepress preview --host 127.0.0.1 --port 4173
```

本地预览默认根路径 `/`；线上为 `/ivy-digital-garden/`。
