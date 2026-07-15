#!/usr/bin/env python3
"""Split the book PDF into per-chapter PDFs for the online reader.

Usage:
    python3 scripts/split-chapters.py /path/to/neutral-edition.pdf [outdir]

Reads the source PDF's top-level bookmarks (via qpdf --json) to find chapter
boundaries, then writes into outdir (default: pdf/):

    physical-ai-safety-front-matter.pdf   (start .. Chapter 1)
    physical-ai-safety-ch1.pdf .. -ch7.pdf
    physical-ai-safety-back-matter.pdf    (appendix .. end)
    physical-ai-safety.pdf                (full copy)

IMPORTANT: run this only on the neutral-cover public edition. The MIT
Press-styled draft must never be published; pdf/*.pdf is gitignored as a
guard, so publishing requires deliberately committing with `git add -f`
once the neutral edition exists.
"""

import json
import re
import shutil
import subprocess
import sys
from pathlib import Path


def top_level_outline(pdf: Path):
    out = subprocess.run(
        ["qpdf", "--json", "--json-key=outlines", str(pdf)],
        capture_output=True, text=True, check=True,
    )
    data = json.loads(out.stdout)
    return [
        (item.get("title", ""), item.get("destpageposfrom1"))
        for item in data.get("outlines", [])
        if item.get("destpageposfrom1")
    ]


def page_count(pdf: Path) -> int:
    out = subprocess.run(
        ["qpdf", "--show-npages", str(pdf)], capture_output=True, text=True, check=True
    )
    return int(out.stdout.strip())


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src = Path(sys.argv[1]).expanduser()
    outdir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(__file__).parent.parent / "pdf"
    outdir.mkdir(parents=True, exist_ok=True)

    outline = top_level_outline(src)
    npages = page_count(src)

    chapter_starts = {}   # chapter number -> start page
    appendix_start = None
    for title, page in outline:
        m = re.match(r"^(\d+)\s", title)
        if m:
            chapter_starts[int(m.group(1))] = page
        elif re.match(r"^[A-Z]\s", title) and appendix_start is None and chapter_starts:
            appendix_start = page  # first appendix after the chapters

    if not chapter_starts:
        sys.exit("No numbered chapter bookmarks found — is this the right PDF?")

    nums = sorted(chapter_starts)
    pieces = []
    pieces.append(("front-matter", 1, chapter_starts[nums[0]] - 1))
    for i, n in enumerate(nums):
        start = chapter_starts[n]
        end = (chapter_starts[nums[i + 1]] - 1) if i + 1 < len(nums) \
            else ((appendix_start - 1) if appendix_start else npages)
        pieces.append((f"ch{n}", start, end))
    if appendix_start:
        pieces.append(("back-matter", appendix_start, npages))

    for name, start, end in pieces:
        dest = outdir / f"physical-ai-safety-{name}.pdf"
        subprocess.run(
            ["qpdf", str(src), "--pages", str(src), f"{start}-{end}", "--", str(dest)],
            check=True,
        )
        print(f"{dest.name}: pages {start}-{end}")

    full = outdir / "physical-ai-safety.pdf"
    shutil.copyfile(src, full)
    print(f"{full.name}: full copy ({npages} pages)")
    print("\nNow flip `available: true` for the released pieces in read/chapters.js")
    print("and commit the PDFs deliberately with: git add -f pdf/*.pdf")


if __name__ == "__main__":
    main()
