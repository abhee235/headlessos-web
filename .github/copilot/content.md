---
applyTo: "src/content/**/*.md,src/content/**/*.mdx,src/content.config.ts,astro.config.mjs"
---

# Content & Docs Instructions

## Docs (Starlight)

- Files: `src/content/docs/` — plain Markdown (`.md`)
- Add new docs to `astro.config.mjs` → `starlight.sidebar` array
- Frontmatter: `title` (required), `description` (recommended)
- Starlight handles nav, search (Pagefind), TOC, and dark theme automatically

### Sidebar Structure

Defined in `astro.config.mjs`:
```
Getting Started → Introduction, Quick Start, Installation
Concepts → Architecture, Parsing, Security
Apps → Dashboard, File Explorer, Docker, Terminal, Server Admin
Contributing → Contribute, Roadmap
```

## Blog

- Files: `src/content/blog/` — Markdown (`.md`) or MDX (`.mdx`)
- Schema defined in `src/content.config.ts`
- Required frontmatter: `title`, `description`, `pubDate`
- Optional: `author` (default "HeadlessOS Team"), `tags` (string[]), `draft` (boolean), `updatedDate`
- Blog listing: `src/pages/blog/index.astro`
- Blog post template: `src/pages/blog/[...slug].astro`

## Content Collections

Both `docs` and `blog` are defined in `src/content.config.ts`:
- `docs` uses `docsLoader()` + `docsSchema()` from Starlight
- `blog` uses `glob()` loader with a custom Zod schema
