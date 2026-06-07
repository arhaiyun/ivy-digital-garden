#!/usr/bin/env bash
# 下载歌单音频到 media/audio/YYYY/MM/（本地存档，不走外链）
# 依赖: python3 -m pip install yt-dlp
# 用法: ./scripts/fetch-playlist-audio.sh "稻香 周杰伦" 2026/06 01-daoxiang

set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "用法: $0 \"搜索词\" YYYY/MM 文件名前缀"
  echo "示例: $0 \"稻香 周杰伦\" 2026/06 01-daoxiang"
  exit 1
fi

QUERY="$1"
SUBDIR="$2"
BASENAME="$3"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/media/audio/$SUBDIR"
YTDLP="${YTDLP:-$(command -v yt-dlp || echo "$HOME/Library/Python/3.9/bin/yt-dlp")}"

mkdir -p "$OUT_DIR"

"$YTDLP" "bilisearch:$QUERY" \
  --no-playlist \
  -f "bestaudio[ext=m4a]/bestaudio/best" \
  -o "$OUT_DIR/${BASENAME}.%(ext)s"

echo "已保存到 $OUT_DIR/${BASENAME}.*"
ls -lh "$OUT_DIR/${BASENAME}".*
