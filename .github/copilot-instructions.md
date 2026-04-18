# GitHub Copilot Custom Instructions for HeadlessOS Web

> These instructions apply to ALL Copilot interactions in this project.
> For the full ruleset, see `AGENTS.md` in the project root.

## What Is This Project

Marketing website + docs for [HeadlessOS](https://github.com/abhee235/headlessos), built with Astro 6 + Starlight + TailwindCSS 4, deployed to Cloudflare Workers. Static-only, zero client JS.

## Tech Stack

- **Astro 6** — static SSG, zero JS by default
- **Starlight 0.38** — docs framework (Pagefind search, sidebar)
- **TailwindCSS 4** — via `@tailwindcss/vite`, config in `src/styles/global.css` using `@theme {}`
- **MDX** — for blog posts
- **Cloudflare Workers** — deployment via Wrangler 3
- **TypeScript strict** — `@/*` path alias → `src/*`
- **Prettier** + `prettier-plugin-astro`

## Commands

```bash
npm run dev          # Dev server at localhost:4321
npm run build        # Static build → ./dist
npm run preview      # Preview production build
npm run deploy       # Build + deploy to Cloudflare Workers
npm run format       # Prettier format
```

## Critical Rules

1. **Astro components only** for marketing pages — no React/Vue/Svelte
2. **Dark-only theme** — background `#07070b`, no light mode
3. **CSS variable tokens** — always `var(--color-*)` from `global.css`, never hardcode colors
4. **TailwindCSS 4 syntax** — `@theme {}` in CSS, no `tailwind.config.js`
5. **Integration order** in `astro.config.mjs`: `sitemap()` → `starlight()` → `mdx()` (build breaks otherwise)
6. **Starlight 0.38 social** — uses array format: `[{ icon, label, href }]`
7. **Zero client JS** — no `client:*` directives on marketing pages
8. **`@/*` imports** — `@/components/...`, `@/layouts/...`, `@/styles/...`
9. **SEO** — BaseLayout provides OG, Twitter, JSON-LD defaults
10. **No inline styles** — use Tailwind utilities or CSS variable classes (`.glass`, `.btn-*`, `.gradient-text`)

## Design System

- Brand gradient: Cyan `#00d4ff` → Violet `#7c3aed`
- Glass: `.glass`, `.glass-strong`
- Gradient text: `.gradient-text`
- Buttons: `.btn-primary` (gradient), `.btn-secondary` (border), `.btn-ghost`
- Fonts: Inter (`--font-sans`), JetBrains Mono (`--font-mono`)
- All tokens in `src/styles/global.css` → `@theme` block

## Content

- **Docs**: `src/content/docs/` — add to `starlight.sidebar` in `astro.config.mjs`
- **Blog**: `src/content/blog/` — frontmatter: `title`, `description`, `pubDate` (required), `author`, `tags`, `draft` (optional)
- **Blog schema** defined in `src/content.config.ts`

## File Guide

| Task | Location |
|------|----------|
| Landing page | `src/pages/index.astro` |
| Marketing sections | `src/components/` |
| Docs content | `src/content/docs/` |
| Blog posts | `src/content/blog/` |
| Design tokens | `src/styles/global.css` |
| Starlight overrides | `src/styles/starlight.css` |
| SEO/meta defaults | `src/layouts/BaseLayout.astro` |
| Docs sidebar | `astro.config.mjs` → `starlight.sidebar` |
| Deployment | `wrangler.jsonc`, `.github/workflows/deploy.yml` |
| Security headers | `public/_headers` |
