#!/usr/bin/env python3
"""Split html/chN.html into ~12KB translation parts under html/zh-parts/chN/.

The preamble (through <main class="chapter-body">) and the tail (from the
bibliography <div id="refs"> to EOF) are written as .NOTRANSLATE parts and
copied verbatim at join time; zh_join.py applies the deterministic head/footer
transforms (lang attr, title, fonts) so no agent ever edits the MathJax config.
"""
import json
import os
import re
import sys

CHUNK = 12000
BLOCK_RE = re.compile(r"^<(p|h[1-6]|figure|div|ul|ol|table|section|blockquote)[ >]")
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def split(ch):
    src = os.path.join(ROOT, "html", f"{ch}.html")
    outdir = os.path.join(ROOT, "html", "zh-parts", ch)
    os.makedirs(outdir, exist_ok=True)
    for f in os.listdir(outdir):
        os.remove(os.path.join(outdir, f))
    lines = open(src, encoding="utf-8").read().splitlines(keepends=True)

    i = next(k for k, l in enumerate(lines) if 'class="chapter-body"' in l) + 1
    try:
        j = next(k for k, l in enumerate(lines) if 'id="refs"' in l)
    except StopIteration:
        j = len(lines)
    preamble, body, tail = lines[:i], lines[i:j], lines[j:]

    parts, cur, size = [], [], 0
    for l in body:
        if cur and size >= CHUNK and BLOCK_RE.match(l):
            parts.append(cur)
            cur, size = [], 0
        cur.append(l)
        size += len(l)
    if cur:
        parts.append(cur)

    def w(name, ls):
        with open(os.path.join(outdir, name), "w", encoding="utf-8") as f:
            f.writelines(ls)

    w("part-000.NOTRANSLATE.html", preamble)
    for n, p in enumerate(parts, 1):
        w(f"part-{n:03d}.html", p)
    if tail:
        w(f"part-{len(parts) + 1:03d}.NOTRANSLATE.html", tail)
    return [f"part-{n:03d}.html" for n in range(1, len(parts) + 1)]


if __name__ == "__main__":
    chapters = sys.argv[1:] or [f"ch{i}" for i in range(1, 8)]
    manifest = {ch: split(ch) for ch in chapters}
    print(json.dumps(manifest))
