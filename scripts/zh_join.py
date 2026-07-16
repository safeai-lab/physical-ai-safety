#!/usr/bin/env python3
"""Assemble html/chN.zh.html from translated parts in html/zh-parts/chN/.

NOTRANSLATE parts are copied verbatim; every other part must have a
part-XXX.zh.html twin. Head/footer transforms (lang, title, CJK fonts,
draft-translation footer) are applied here deterministically.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
TITLES = json.load(open(os.path.join(HERE, "zh_titles.json"), encoding="utf-8"))

FONT_BLOCK = (
    '<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700'
    '&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">\n'
    '<style>\n'
    'html[lang="zh-CN"] body { font-family: "STIX Two Text", "Noto Serif SC", "Songti SC", serif; }\n'
    'html[lang="zh-CN"] h1, html[lang="zh-CN"] h2, html[lang="zh-CN"] h3, html[lang="zh-CN"] h4,\n'
    'html[lang="zh-CN"] h5, html[lang="zh-CN"] .site-header '
    '{ font-family: "Source Sans 3", "Noto Sans SC", "PingFang SC", sans-serif; }\n'
    '</style>\n'
)

FOOTER_ZH = (
    "  <p>&copy; Ding Zhao &middot; 《物理AI安全》（<em>Physical AI Safety</em>）"
    "&middot; HTML 预览版 &middot; 中文译文为草稿，以英文 PDF 版为准。</p>"
)


def join(ch):
    t = TITLES[ch]
    outdir = os.path.join(ROOT, "html", "zh-parts", ch)
    names = sorted(n for n in os.listdir(outdir) if not n.endswith(".zh.html"))
    text = []
    for n in names:
        if ".NOTRANSLATE" in n:
            text.append(open(os.path.join(outdir, n), encoding="utf-8").read())
        else:
            zh = os.path.join(outdir, n.replace(".html", ".zh.html"))
            if not os.path.exists(zh):
                raise SystemExit(f"MISSING translation: {ch}/{n}")
            text.append(open(zh, encoding="utf-8").read())
    html = "".join(text)

    html = html.replace('<html lang="en">', '<html lang="zh-CN">', 1)
    html = re.sub(r"<title>.*?</title>",
                  f"<title>{t['num']} · {t['title']} — 物理AI安全 (Physical AI Safety)</title>",
                  html, count=1)
    html = re.sub(r'(<span class="site-book">).*?(</span>)',
                  r"\g<1>物理AI安全\g<2>", html, count=1)
    html = re.sub(r'(<span class="site-chapter">).*?(</span>)',
                  rf"\g<1>{t['num']} · {t['title']}\g<2>", html, count=1)
    html = re.sub(r'(<a class="site-pdf"[^>]*>).*?(</a>)',
                  r"\g<1>PDF 版\g<2>", html, count=1)
    html = html.replace("</head>", FONT_BLOCK + "</head>", 1)
    html = re.sub(r"<footer class=\"site-footer\">.*?</footer>",
                  '<footer class="site-footer">\n' + FOOTER_ZH + "\n</footer>",
                  html, count=1, flags=re.S)

    out = os.path.join(ROOT, "html", f"{ch}.zh.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"{ch}: wrote {out} ({len(html)} bytes)")


if __name__ == "__main__":
    for ch in (sys.argv[1:] or [f"ch{i}" for i in range(1, 8)]):
        join(ch)
