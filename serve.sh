#!/bin/bash
# Serve the site locally. file:// URLs show raw directory listings because
# they have no index.html resolution; this serves the site the way GitHub
# Pages does. Usage: ./serve.sh [port]   (default 8400)
cd "$(dirname "$0")"
PORT="${1:-8400}"
echo "Serving on http://localhost:${PORT}/  —  open http://localhost:${PORT}/read/ for the reader"
python3 -m http.server "${PORT}"
