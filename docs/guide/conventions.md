# 写作约定

## 文件命名

```
YYYY-MM-DD-简短中文标题.md
```

例：`2026-08-01-第一次翻身.md`

## Frontmatter 必填

```yaml
title: ""
date: YYYY-MM-DD
type: journal   # 六类之一
visibility: family
```

## 月龄与天数

填写 `ivy_age_days` 便于排序回顾；出生日期在 `data/ivy.yaml` 填好后，可自行计算或日后加脚本。

## 标签

- 日记：`日常` `睡眠` `外出`
- 里程碑：使用 `data/ivy.yaml` 中的 `milestone_tags`
- 健康：`体检` `疫苗` `就医`

## 链接

- 站内：`[某里程碑](/milestones/2026-08-01-第一次翻身)`
- 站外：注明来源，避免失效链接（可附存档说明）
