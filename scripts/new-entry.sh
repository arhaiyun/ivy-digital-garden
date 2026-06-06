#!/usr/bin/env bash
# 从模板创建新条目
# 用法: ./scripts/new-entry.sh journal 2026-06-10 第一次笑

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ $# -lt 3 ]]; then
  echo "用法: ./scripts/new-entry.sh journal|milestone|health|family|creative|wish YYYY-MM-DD 标题"
  exit 1
fi

TYPE="$1"
DATE="$2"
shift 2
TITLE="$*"

if [[ ! "$DATE" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  echo "日期格式应为 YYYY-MM-DD: $DATE"
  exit 1
fi

case "$TYPE" in
  journal)   TPL="journal.md"; DEST="$ROOT/content/journal" ;;
  milestone) TPL="milestone.md"; DEST="$ROOT/content/milestones" ;;
  health)    TPL="health.md"; DEST="$ROOT/content/health" ;;
  family)    TPL="family.md"; DEST="$ROOT/content/family" ;;
  creative)  TPL="creative.md"; DEST="$ROOT/content/creative" ;;
  wish)      TPL="wish.md"; DEST="$ROOT/content/wishes" ;;
  *) echo "未知类型: $TYPE"; exit 1 ;;
esac

SLUG="${TITLE// /-}"
SLUG="${SLUG//\//-}"

FILE="$DEST/${DATE}-${SLUG}.md"
if [[ -f "$FILE" ]]; then
  echo "已存在: $FILE"
  exit 1
fi

AGE_DAYS="$(node -e "
const fs = require('fs')
const data = fs.readFileSync('$ROOT/data/ivy.yaml', 'utf8')
const match = data.match(/birth_date:\\s*['\"]?(\\d{4}-\\d{2}-\\d{2})/)
if (!match) process.exit(0)
const birth = new Date(match[1] + 'T00:00:00Z')
const date = new Date('$DATE' + 'T00:00:00Z')
console.log(Math.floor((date - birth) / 86400000))
")"

while IFS= read -r line; do
  case "$line" in
    'title: ""') printf 'title: "%s"\n' "$TITLE" ;;
    'date: YYYY-MM-DD') printf 'date: %s\n' "$DATE" ;;
    'ivy_age_days: null') printf 'ivy_age_days: %s\n' "${AGE_DAYS:-null}" ;;
    '# {{title}}') printf '# %s\n' "$TITLE" ;;
    *) printf '%s\n' "$line" ;;
  esac
done < "$ROOT/templates/$TPL" > "$FILE"

echo "已创建: $FILE"
