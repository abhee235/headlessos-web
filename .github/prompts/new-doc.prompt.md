---
mode: agent
description: "Add a new documentation page to the Starlight docs"
---

Add a new documentation page for HeadlessOS.

## Context
- Read `astro.config.mjs` for the current sidebar structure
- Read `src/content.config.ts` for the docs collection schema
- Check `src/content/docs/` for existing docs as format reference

## Instructions
1. Create `src/content/docs/{category}/{slug}.md` with frontmatter (`title`, `description`)
2. Add the page to `astro.config.mjs` → `starlight.sidebar` under the correct category
3. Follow the writing style of existing docs (explain what HeadlessOS does, not how to modify its code)
4. Run `npm run build` to verify no errors
