#!/usr/bin/env python3
"""Structural verification: html/chN.zh.html must mirror html/chN.html.

Checks: math delimiter counts, id sets, img src lists, per-tag counts
(tolerating the link/style the join step injects), and a CJK-content sanity
ratio. Exit code 1 on any failure. Run BEFORE add_lang_toggle.py.
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

TAGS = ["p", "h1", "h2", "h3", "h4", "h5", "figure", "figcaption", "ul", "ol",
        "li", "table", "tr", "td", "th", "em", "strong", "code", "pre",
        "a", "div", "span", "img"]
TOLERANCE = {"link": 1, "style": 1}


def stats(path):
    s = open(path, encoding="utf-8").read()
    return s, {
        "math": tuple(s.count(d) for d in (r"\(", r"\)", r"\[", r"\]")),
        "ids": set(re.findall(r'id="([^"]+)"', s)),
        "imgs": re.findall(r'<img[^>]*src="([^"]+)"', s),
        "tags": {t: len(re.findall(rf"<{t}[ >/]", s)) for t in TAGS + list(TOLERANCE)},
    }


def verify(ch):
    en_s, en = stats(os.path.join(ROOT, "html", f"{ch}.html"))
    zh_s, zh = stats(os.path.join(ROOT, "html", f"{ch}.zh.html"))
    errs = []
    if en["math"] != zh["math"]:
        errs.append(f"math delimiters en={en['math']} zh={zh['math']}")
    if en["ids"] != zh["ids"]:
        d1, d2 = en["ids"] - zh["ids"], zh["ids"] - en["ids"]
        errs.append(f"ids missing={sorted(d1)[:5]} extra={sorted(d2)[:5]}")
    if en["imgs"] != zh["imgs"]:
        errs.append("img src list differs")
    for t, n in en["tags"].items():
        tol = TOLERANCE.get(t, 0)
        if not (n <= zh["tags"][t] <= n + tol):
            errs.append(f"<{t}> count en={n} zh={zh['tags'][t]} (tol +{tol})")
    cjk = len(re.findall(r"[一-鿿]", zh_s))
    letters = len(re.findall(r"[A-Za-z]", en_s))
    if cjk < 0.15 * letters:
        errs.append(f"low CJK content: {cjk} CJK chars vs {letters} en letters")
    if errs:
        print(f"{ch}: FAIL")
        for e in errs:
            print(f"  - {e}")
        return False
    print(f"{ch}: PASS (CJK chars: {cjk})")
    return True


if __name__ == "__main__":
    ok = all([verify(ch) for ch in (sys.argv[1:] or [f"ch{i}" for i in range(1, 8)])])
    sys.exit(0 if ok else 1)
