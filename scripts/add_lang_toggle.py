#!/usr/bin/env python3
"""Inject a language-switch link into the site-header of chapter HTML files.

Idempotent: run after every HTML rebuild (build_html_chapters.py) and after
zh_join.py. English chN.html gets a 中文 link to chN.zh.html (only if that
file exists); Chinese chN.zh.html gets an English link back.
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MARK = 'class="site-lang"'


def inject(path, href, label, lang_attr=""):
    html = open(path, encoding="utf-8").read()
    link = f'<a class="site-lang" href="{href}"{lang_attr}>{label}</a>'
    if MARK in html:
        new = re.sub(r'<a class="site-lang"[^>]*>[^<]*</a>', link, html, count=1)
    else:
        new = re.sub(r'(<a class="site-pdf"[^>]*>.*?</a>)', r"\1\n  " + link,
                     html, count=1)
    if new != html:
        open(path, "w", encoding="utf-8").write(new)
    print(f"{os.path.basename(path)}: site-lang -> {href}")


if __name__ == "__main__":
    chapters = sys.argv[1:] or [f"ch{i}" for i in range(1, 8)]
    for ch in chapters:
        en = os.path.join(ROOT, "html", f"{ch}.html")
        zh = os.path.join(ROOT, "html", f"{ch}.zh.html")
        if os.path.exists(zh):
            inject(en, f"{ch}.zh.html", "中文", ' lang="zh-CN"')
            inject(zh, f"{ch}.html", "English", ' lang="en"')
        else:
            print(f"{ch}: no zh file yet, skipped")
