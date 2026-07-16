#!/usr/bin/env python3
"""Strip the site-header buttons ("PDF edition" / 中文-English toggle) from
chapter HTML files.

2026-07-16 author decision: the two header buttons are not useful — the
online reader provides its own PDF|HTML and language controls. This script
used to *inject* the language toggle; it now REMOVES both anchors, and stays
in the same pipeline slot (run after every build_html_chapters.py rebuild
and after zh_join.py) so regenerated pages come out clean. Idempotent.
"""
import glob
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

BUTTON_RE = re.compile(r'\s*<a class="site-(?:pdf|lang)"[^>]*>[^<]*</a>')


def strip(path):
    html = open(path, encoding="utf-8").read()
    new = BUTTON_RE.sub("", html)
    if new != html:
        open(path, "w", encoding="utf-8").write(new)
        print(f"{os.path.basename(path)}: header buttons removed")


if __name__ == "__main__":
    targets = sys.argv[1:] or sorted(glob.glob(os.path.join(ROOT, "html", "*.html")))
    for t in targets:
        path = t if os.path.sep in t else os.path.join(ROOT, "html", t)
        if os.path.exists(path):
            strip(path)
