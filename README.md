# Physical AI Safety

**The Book and CMU Course by Ding Zhao**
*Physical AI Safety: The Gateway to Deploying AI in the Real World*

This is the long-term home for the book's website and the companion course
materials (slides, exercises, notebooks, code), maintained by the
[Safe AI Lab](https://safeai-lab.github.io/) at Carnegie Mellon University.

## Addresses

| Address | Role |
|---|---|
| https://physical-ai-safety.org/ | Public brand domain (pending DNS setup — see below) |
| https://safeai-lab.github.io/physical-ai-safety/ | GitHub Pages hosting address |
| https://github.com/safeai-lab/physical-ai-safety | This repository |

## Branches

- **`main`** — deployed to GitHub Pages. Currently the launch placeholder.
- **`book`** — the full site (hero, chapter guide, course schedule,
  materials, citation, usage). Merge `book` → `main` to publish it.

## Connecting physical-ai-safety.org (two manual steps)

1. **Register** `physical-ai-safety.org` at any registrar.
2. **DNS records** at the registrar:
   - Apex `physical-ai-safety.org`: four `A` records →
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     (plus `AAAA` records `2606:50c0:8000::153` … `8003::153` if supported)
   - `www`: `CNAME` → `safeai-lab.github.io`

Then attach the domain to this repo (either in Settings → Pages, or):

```bash
gh api -X PUT repos/safeai-lab/physical-ai-safety/pages \
  -f cname=physical-ai-safety.org
```

Wait for the DNS check to pass, then enable **Enforce HTTPS** in
Settings → Pages. Do **not** add a `CNAME` file before the domain is
registered — GitHub would redirect the working `.github.io` URL to a
dead domain.

## Coming here as the course runs (Summer 2026)

```
physical-ai-safety/
├── syllabus.md
├── slides/
├── exercises/
├── notebooks/
├── examples/
├── CITATION.cff
├── LICENSES.md
└── CHANGELOG.md
```

## License

Website content © 2026 Ding Zhao. Licenses for slides, exercises, and code
will be stated per directory as materials are released.
