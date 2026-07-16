#!/usr/bin/env python3
"""Site gate: encrypt every deployable HTML page into a self-decrypting stub.

Implements Option A3 of docs/plans/2026-07-16-site-gate-plan.md:
AES-256-GCM per file (fresh nonce), key = PBKDF2-SHA256(passcode, site salt,
600k iterations). Output is a complete deployable site in --out: encrypted
stubs for HTML, plaintext copies of figures/CSS/JS, gate.html with an
embedded canary ciphertext, 404.html redirect, robots.txt.

The passcode is never written anywhere; only ciphertext and the (public by
design) salt. Plaintext sources stay untouched — rollback = rebuild without
this step.

Usage:
  python3 scripts/gate_encrypt.py --passcode 'SECRET' [--out deploy]
"""

import argparse
import base64
import json
import os
import re
import shutil
import sys
from pathlib import Path

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

ROOT = Path(__file__).resolve().parent.parent
ITERATIONS = 600_000
SALT_FILE = ROOT / "scripts" / "gate_salt.json"
CANARY_PLAINTEXT = b"pas-gate-ok"

# HTML files that become encrypted stubs (relative to repo root).
ENCRYPT_GLOBS = ["index.html", "index.zh.html", "read/index.html", "html/*.html"]
# Never encrypt these (the gate itself must stay plaintext).
ENCRYPT_EXCLUDE = {"gate.html", "404.html"}

# Plaintext files/dirs copied verbatim (figures/CSS/JS reveal nothing;
# July-prototype decision).
COPY_PATHS = [
    "assets",
    "read/reader.css",
    "read/reader.js",
    "read/chapters.js",
    "html/assets",
    "html/chapter.css",
    ".nojekyll",
    "gate.js",
]

STUB_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>{title}</title>
<meta property="og:title" content="Physical AI Safety">
<meta property="og:description" content="The Gateway to Deploying AI in the Real World">
<meta property="og:image" content="https://physical-ai-safety.org/assets/favicon-512.png">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="icon" type="image/png" sizes="512x512" href="/assets/favicon-512.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
</head>
<body style="margin:0;background:#faf9f7">
<script>window.__PAS_PAYLOAD={payload};</script>
<script src="/gate.js"></script>
<noscript><p style="font-family:sans-serif;padding:2rem">This page requires
JavaScript. / 本页面需要启用 JavaScript。</p></noscript>
</body>
</html>
"""

NOT_FOUND = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>Physical AI Safety — A textbook written by Prof. Ding Zhao at CMU</title>
<meta property="og:title" content="Physical AI Safety">
<meta property="og:description" content="The Gateway to Deploying AI in the Real World">
<meta property="og:image" content="https://physical-ai-safety.org/assets/favicon-512.png">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="icon" type="image/png" sizes="512x512" href="/assets/favicon-512.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<style>body{font-family:sans-serif;background:#faf9f7;color:#1a1a1a;
display:flex;min-height:100vh;align-items:center;justify-content:center}
a{color:#C41230}</style></head><body>
<p id="nf" hidden>Page not found. <a href="/">Back to the homepage</a></p>
<script>
/* Locked visitors go to the gate; unlocked visitors get a plain 404
   (unconditional bouncing would loop: 404 -> gate -> auto-return -> 404). */
var k = null;
try { k = sessionStorage.getItem("pas-key") || localStorage.getItem("pas-key"); } catch (e) {}
if (k) { document.getElementById("nf").hidden = false; }
else {
  location.replace("/gate.html?return=" +
    encodeURIComponent(location.pathname + location.search + location.hash));
}
</script></body></html>
"""

ROBOTS = "User-agent: *\nDisallow: /\n"


def b64(data: bytes) -> str:
    return base64.b64encode(data).decode("ascii")


def load_salt() -> bytes:
    """Site-wide salt, persisted so re-encryption keeps stored keys valid."""
    if SALT_FILE.exists():
        return base64.b64decode(json.loads(SALT_FILE.read_text())["salt"])
    salt = os.urandom(16)
    SALT_FILE.write_text(json.dumps({"salt": b64(salt), "iterations": ITERATIONS}) + "\n")
    print(f"generated new site salt -> {SALT_FILE.relative_to(ROOT)}")
    return salt


def derive_key(passcode: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=ITERATIONS)
    return kdf.derive(passcode.encode("utf-8"))


def encrypt_payload(key: bytes, plaintext: bytes) -> dict:
    nonce = os.urandom(12)
    ct = AESGCM(key).encrypt(nonce, plaintext, None)
    return {"v": 1, "iv": b64(nonce), "data": b64(ct)}


def extract_title(html: str) -> str:
    """Generic title for every stub: even chapter names stay behind the gate
    (author decision: entire site, no public surface). The real <title>
    returns the moment the page decrypts."""
    return "Physical AI Safety — A textbook written by Prof. Ding Zhao at CMU"


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--passcode", default=os.environ.get("PAS_GATE_PASSCODE"),
                    help="gate passcode (or env PAS_GATE_PASSCODE); never stored")
    ap.add_argument("--out", default="deploy", help="staging dir (default: deploy)")
    args = ap.parse_args()
    if not args.passcode:
        ap.error("--passcode (or PAS_GATE_PASSCODE) is required")

    out = (ROOT / args.out).resolve()
    if ROOT not in out.parents:
        sys.exit(f"refusing to write outside the repo (or at its root): {out}")
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    salt = load_salt()
    key = derive_key(args.passcode, salt)

    # 1. Encrypted stubs.
    n_enc = 0
    for pattern in ENCRYPT_GLOBS:
        for src in sorted(ROOT.glob(pattern)):
            rel = src.relative_to(ROOT)
            if src.name in ENCRYPT_EXCLUDE or args.out in rel.parts:
                continue
            html = src.read_text(encoding="utf-8")
            payload = encrypt_payload(key, html.encode("utf-8"))
            stub = STUB_TEMPLATE.format(title=extract_title(html),
                                        payload=json.dumps(payload, separators=(",", ":")))
            dest = out / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(stub, encoding="utf-8")
            n_enc += 1
    print(f"encrypted {n_enc} HTML pages")

    # 2. Plaintext assets.
    for rel in COPY_PATHS:
        src = ROOT / rel
        if not src.exists():
            print(f"  (skip missing {rel})")
            continue
        dest = out / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        if src.is_dir():
            shutil.copytree(src, dest)
        else:
            shutil.copy2(src, dest)

    # 2b. Encrypted binaries: each PDF ships as <name>.pdf.enc
    #     (12-byte GCM nonce ‖ ciphertext); assets/pas-pdf.js decrypts.
    n_pdf = 0
    for d in ("pdf", "slides"):
        src_dir = ROOT / d
        if not src_dir.exists():
            continue
        for src in sorted(src_dir.glob("*.pdf")):
            if src.stat().st_size > 95 * 1024 * 1024:
                print(f"  SKIP {src.relative_to(ROOT)} (exceeds GitHub's 100MB file limit)")
                continue
            nonce = os.urandom(12)
            ct = AESGCM(key).encrypt(nonce, src.read_bytes(), None)
            dest = out / d / (src.name + ".enc")
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(nonce + ct)
            n_pdf += 1
    print(f"encrypted {n_pdf} PDFs")

    # 3. Gate page: fill canary + KDF parameters into the template.
    gate_src = (ROOT / "gate.html").read_text(encoding="utf-8")
    canary = encrypt_payload(key, CANARY_PLAINTEXT)
    gate = (gate_src
            .replace("__PAS_SALT__", b64(salt))
            .replace("__PAS_ITER__", str(ITERATIONS))
            .replace("__PAS_CANARY_IV__", canary["iv"])
            .replace("__PAS_CANARY_DATA__", canary["data"]))
    (out / "gate.html").write_text(gate, encoding="utf-8")

    # 4. Default-deny extras.
    (out / "404.html").write_text(NOT_FOUND, encoding="utf-8")
    (out / "robots.txt").write_text(ROBOTS, encoding="utf-8")

    print(f"staged gated site -> {out.relative_to(ROOT)}/")
    print("preview:  cd", out.relative_to(ROOT), "&& python3 -m http.server 8402")


if __name__ == "__main__":
    main()
