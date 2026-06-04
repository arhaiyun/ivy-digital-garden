# 隐私与安全

## 分层可见性

在每条 Markdown 的 frontmatter 使用 `visibility`：

| 值 | 含义 |
|----|------|
| `family` | 家人可见（默认） |
| `private` | 仅维护者本地/不部署（可配合 `*.local.md` 不入库） |
| `public` | 将来若做公开摘录（**健康记录请勿使用**） |

## 仓库

- 使用 **GitHub Private** 仓库
- 勿在内容中写：身份证号、完整病历号、银行卡等
- 密钥放在 `.env`（已 gitignore），参考 `.env.example`

## 站点

- VitePress 已加 `noindex, nofollow`
- 部署时务必启用平台级访问控制（密码、VPN、或仅登录家人账号）
- 不要将 `dist/` 目录上传到公开静态托管且无鉴权

## 敏感健康数据

`content/health/` 下文件默认仅家人。备份时同样选择加密或私有存储。
