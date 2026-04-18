---
mode: agent
description: "Create a new marketing section component for the landing page"
---

Create a new Astro component for a marketing section on the HeadlessOS landing page.

## Context
- Read `src/styles/global.css` for available design tokens and utility classes
- Read `src/components/Hero.astro` and `src/components/Features.astro` as pattern references
- Read `src/pages/index.astro` to see the current section composition order

## Instructions
1. Create `src/components/{Name}.astro` using the pattern from existing sections
2. Use `.astro` file format — NO client-side JS, NO `client:*` directives
3. Use CSS variable tokens (`var(--color-*)`) — NEVER hardcode colors
4. Use utility classes: `.glass`, `.gradient-text`, `.btn-primary`, etc.
5. Add the component to `src/pages/index.astro` in the appropriate position
6. Run `npm run build` to verify no errors
