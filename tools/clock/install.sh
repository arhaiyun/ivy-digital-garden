#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="${ROOT}/.build"
BINARY="${BUILD_DIR}/clock"
BIN_DIR="${HOME}/bin"
TARGET="${BIN_DIR}/clock"
ZSHRC="${HOME}/.zshrc"

mkdir -p "${BUILD_DIR}" "${BIN_DIR}"

if [[ "$(uname -s)" != "Darwin" ]] || ! command -v swiftc >/dev/null 2>&1; then
  echo "fail: 需要 macOS 与 swiftc" >&2
  exit 1
fi

echo "编译 clock..."
swiftc -O -framework Cocoa "${ROOT}/Clock.swift" -o "${BINARY}"
chmod +x "${BINARY}"

cat > "${TARGET}" <<EOF
#!/usr/bin/env bash
exec "${BINARY}" "\$@"
EOF
chmod +x "${TARGET}"

MARKER='# ivy-digital-garden clock'
if ! grep -qF "${MARKER}" "${ZSHRC}" 2>/dev/null; then
  {
    echo ""
    echo "${MARKER}"
    echo 'export PATH="${HOME}/bin:${PATH}"'
  } >> "${ZSHRC}"
fi

echo "已安装: ${TARGET} -> ${BINARY}"
"${ROOT}/test.sh"
