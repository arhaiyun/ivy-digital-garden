#!/usr/bin/env python3
"""终端全屏时钟（非 macOS 或 Swift 不可用时的回退）。Esc / Q 退出。"""

from __future__ import annotations

import curses
from datetime import datetime


def _run(stdscr: curses.window) -> None:
    curses.curs_set(0)
    curses.use_default_colors()
    stdscr.nodelay(False)
    stdscr.timeout(200)

    while True:
        stdscr.erase()
        h, w = stdscr.getmaxyx()
        text = datetime.now().strftime("%H:%M:%S")
        y = max(0, h // 2)
        x = max(0, (w - len(text)) // 2)
        try:
            stdscr.addstr(y, x, text, curses.A_BOLD)
        except curses.error:
            pass
        stdscr.refresh()
        ch = stdscr.getch()
        if ch in (27, ord("q"), ord("Q")):
            break


def main() -> int:
    curses.wrapper(_run)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
