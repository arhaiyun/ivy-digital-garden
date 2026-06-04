#!/usr/bin/env bash
# 从模板创建新条目
# 用法: ./scripts/new-entry.sh journal 2026-06-10 第一次笑

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TYPE="${1:?类型: journal|milestone|health|family|creative|wish}"
DATE="${2:?日期 YYYY-MM-DD}"
SLUG="${3:?简短标题，如 第一次笑}"

case "$TYPE" in
  journal)   TPL="journal.md" ;;
  milestone) TPL="milestone.md" ;;
  health)    TPL="health.md" ;;
  family)    TPL="family.md" ;;
  creative)  TPL="creative.md" ;;
  wish)      TPL="wish.md" ;;
  *) echo "未知类型: $TYPE"; exit 1 ;;
esac

DEST="$ROOT/content/${TYPE}s"
# health / family / creative / wish 目录名无 s 后缀问题
case "$TYPE" in
  journal)   DEST="$ROOT/content/journal" ;;
  milestone) DEST="$ROOT/content/milestones" ;;
  health)    DEST="$ROOT/content/health" ;;
  family)    DEST="$ROOT/content/family" ;;
  creative)  DEST="$ROOT/content/creative" ;;
  wish)      DEST="$ROOT/content/wishes" ;;
esac

FILE="$DEST/${DATE}-${SLUG}.md"
if [[ -f "$FILE" ]]; then
  echo "已存在: $FILE"
  exit 1
fi
cp "$ROOT/templates/$TPL" "$FILE"
echo "已创建: $FILE"
