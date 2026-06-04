#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
BUILD="${ROOT}/.build/clock"
BIN="${HOME}/bin/clock"
ERR="$(mktemp)"
OUT="$(mktemp)"
trap 'rm -f "${ERR}" "${OUT}"' EXIT

fail() { echo "FAIL: $*" >&2; exit 1; }
ok() { echo "PASS: $*"; }

[[ "$(uname -s)" == "Darwin" ]] || fail "仅支持 macOS"

# 1) 必须能编译
echo "== compile =="
swiftc -O -framework Cocoa "${ROOT}/Clock.swift" -o "${BUILD}"
[[ -x "${BUILD}" ]] || fail "编译产物不存在"
ok "swiftc 编译成功"

# 2) --self-test 必须输出合法时间
echo "== self-test =="
"${BUILD}" --self-test >"${OUT}" 2>"${ERR}"
[[ -s "${OUT}" ]] || fail "--self-test 无输出"
LAST="$(tail -1 "${OUT}")"
[[ "${LAST}" =~ ^[0-2][0-9]:[0-5][0-9]:[0-5][0-9]$ ]] || fail "时间格式错误: ${LAST}"
grep -qiE 'deprecat|TK_SILENCE|system version of Tk|error:' "${ERR}" && fail "self-test stderr: $(cat "${ERR}")"
ok "self-test 输出 ${LAST}"

# 3) 已安装命令存在且指向编译产物
echo "== install link =="
[[ -x "${BIN}" ]] || fail "${BIN} 未安装，请运行 install.sh"
grep -qF "${BUILD}" "${BIN}" || fail "~/bin/clock 未指向 ${BUILD}"
ok "~/bin/clock 链接正确"

# 4) 启动必须快（已编译，禁止每次 interpret）
echo "== launch speed =="
START=$(perl -MTime::HiRes=time -e 'printf "%.0f\n", time*1000')
"${BIN}" 2>"${ERR}" &
PID=$!
for _ in $(seq 1 30); do
  if ! kill -0 "${PID}" 2>/dev/null; then
    fail "clock 进程过早退出 (pid ${PID}), stderr: $(cat "${ERR}")"
  fi
  # 跑满 300ms 即视为启动成功
  NOW=$(perl -MTime::HiRes=time -e 'printf "%.0f\n", time*1000')
  if (( NOW - START >= 300 )); then
    break
  fi
  sleep 0.05
done
kill "${PID}" 2>/dev/null || true
wait "${PID}" 2>/dev/null || true
END=$(perl -MTime::HiRes=time -e 'printf "%.0f\n", time*1000')
ELAPSED=$((END - START))
(( ELAPSED < 2000 )) || fail "启动过慢: ${ELAPSED}ms（应 <2s）"
grep -qiE 'deprecat|TK_SILENCE|system version of Tk' "${ERR}" && fail "GUI stderr: $(cat "${ERR}")"
ok "GUI 启动 ${ELAPSED}ms，无 Tk 警告"

# 5) 冷启动整条命令（用户真实路径）
echo "== user command =="
: >"${ERR}"
START=$(perl -MTime::HiRes=time -e 'printf "%.0f\n", time*1000')
PATH="${HOME}/bin:${PATH}"
command clock 2>"${ERR}" &
PID=$!
sleep 0.5
kill -0 "${PID}" 2>/dev/null || fail "command clock 无法保持运行"
kill "${PID}" 2>/dev/null || true
wait "${PID}" 2>/dev/null || true
END=$(perl -MTime::HiRes=time -e 'printf "%.0f\n", time*1000')
(( END - START < 2000 )) || fail "command clock 启动 >2s"
grep -qiE 'deprecat|TK_SILENCE|system version of Tk' "${ERR}" && fail "command clock stderr: $(cat "${ERR}")"
ok "command clock 可用 $((END - START))ms"

echo ""
echo "全部测试通过 (5/5)"
