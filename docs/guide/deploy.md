# 部署到 GitHub Pages

线上地址（仓库名 `ivy-digital-garden`）：

**https://arhaiyun.github.io/ivy-digital-garden/**

## 一次性设置

1. 打开仓库 **Settings → Pages**
2. **Build and deployment → Source** 选 **Deploy from a branch**
3. **Branch** 选 `gh-pages`，目录选 **`/ (root)`**，保存
4. 推送 `main` 后会自动运行 [Deploy GitHub Pages](https://github.com/arhaiyun/ivy-digital-garden/actions) 工作流

首次部署约需 1–3 分钟；Actions 显示绿色勾后刷新上述链接。

## 若仍是 404

| 现象 | 处理 |
|------|------|
| Actions 失败 | 点开失败日志，常见为 LFS 或 `npm ci`；修复后重新 push |
| Actions 成功仍 404 | 确认 Pages 源为 **gh-pages / root**，不是 `main` |
| 私有仓库 | 免费账号需将仓库设为 **Public**，或开通 GitHub Pro 才能用私有 Pages |
| 子页面刷新 404 | 直接点站内链接进入；首页与子目录 index 一般正常 |

## 本地模拟线上构建

```bash
npm run build:pages
npx vitepress preview --host 127.0.0.1 --port 4173
```

本地预览默认根路径 `/`；线上为 `/ivy-digital-garden/`。
