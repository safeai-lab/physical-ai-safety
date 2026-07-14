# Physical AI Safety

**The Book and CMU Course by Ding Zhao**
*Physical AI Safety: The Gateway to Deploying AI in the Real World*

This is the long-term home for the book's website and the companion course
materials (slides, exercises, notebooks, code), maintained by the
[Safe AI Lab](https://safeai-lab.github.io/) at Carnegie Mellon University.

## Addresses

| Address | Role |
|---|---|
| https://physical-ai-safety.org/ | Public brand domain — **live**, use this everywhere |
| https://safeai-lab.github.io/physical-ai-safety/ | GitHub Pages hosting address (redirects to the .org) |
| https://github.com/safeai-lab/physical-ai-safety | This repository |

## Branches

- **`main`** — deployed to GitHub Pages. Currently the launch placeholder.
- **`book`** — the full site (hero, chapter guide, course schedule,
  materials, citation, usage). Merge `book` → `main` to publish it.

## Domain configuration (done 2026-07-14)

`physical-ai-safety.org` is registered at GoDaddy and connected:

- Apex `A` records → `185.199.108.153`, `185.199.109.153`,
  `185.199.110.153`, `185.199.111.153` (GitHub Pages)
- `www` `CNAME` → `safeai-lab.github.io`
- Custom domain attached to this repo's Pages site; HTTPS enforced.

If DNS ever needs to be rebuilt, recreate exactly the records above at the
registrar, then:

```bash
gh api -X PUT repos/safeai-lab/physical-ai-safety/pages \
  -f cname=physical-ai-safety.org
gh api -X PUT repos/safeai-lab/physical-ai-safety/pages \
  -F https_enforced=true
```

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
