# AI Coding Assistant Rules for HeadlessOS Web

> Master ruleset for any AI assistant working on the HeadlessOS marketing website and documentation.

---

## 1. Project Overview

**HeadlessOS Web** is the marketing website + documentation for [HeadlessOS](https://github.com/abhee235/headlessos). It is a **separate repository** — not part of the main HeadlessOS app.

- **Live site**: [https://headlessos.com](https://headlessos.com)
- **Purpose**: Marketing landing page, product docs (Starlight), blog, SEO
- **Hosting**: Cloudflare Workers (free tier)
- **Content**: Static-only, zero JS shipped by default (Astro)

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 6 (static SSG, zero JS by default) |
| Docs | @astrojs/starlight 0.38 (Pagefind search, sidebar, dark mode) |
| Styling | TailwindCSS 4 via `@tailwindcss/vite` plugin |
| Typography | `@tailwindcss/typography` for blog prose |
| Blog | MDX via `@astrojs/mdx` |
| SEO | `@astrojs/sitemap`, JSON-LD, Open Graph, canonical URLs |
| Deploy | Cloudflare Workers via Wrangler 3 |
| CI/CD | GitHub Actions (`cloudflare/wrangler-action@v3`) |
| Formatting | Prettier + `prettier-plugin-astro` |
| TypeScript | Strict mode, `@/*` path alias → `src/*` |
| Fonts | Inter + JetBrains Mono (Google Fonts) |

---

## 3. Quick Start Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:4321
npm run build        # Static build → ./dist (17 pages + Pagefind index)
npm run preview      # Preview production build locally
npm run deploy       # Build + deploy to Cloudflare Workers
npm run format       # Prettier format all files
```

---

## 4. Project Structure

```
headlessOS-Web/
├── astro.config.mjs              # Astro + integrations config
├── wrangler.jsonc                # Cloudflare Workers deployment
├── src/
│   ├── assets/                   # Logos (logo-mark.svg, logo-wordmark.svg)
│   ├── components/               # Astro components (marketing sections)
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Features.astro
│   │   ├── Screenshots.astro
│   │   ├── GetStarted.astro
│   │   ├── FAQ.astro
│   │   └── OpenSourceCTA.astro
│   ├── content/
│   │   ├── docs/                 # Starlight docs (Markdown)
│   │   └── blog/                 # Blog posts (Markdown/MDX)
│   ├── layouts/
│   │   └── BaseLayout.astro      # Marketing layout (SEO head, fonts, header/footer)
│   ├── pages/
│   │   ├── index.astro           # Landing page (composes all marketing sections)
│   │   ├── blog/                 # Blog listing + [slug] pages
│   │   └── 404.astro
│   └── styles/
│       ├── global.css            # TailwindCSS 4 + design tokens + utility classes
│       └── starlight.css         # Starlight theme overrides (dark-only)
├── public/
│   ├── favicon.svg
│   ├── _headers                  # Cloudflare security headers
│   └── robots.txt
└── .github/workflows/deploy.yml  # CI/CD: build + deploy on push to main
```

---

## 5. Critical Patterns

### Integration Order in `astro.config.mjs`

**MUST be**: `sitemap()` → `starlight()` → `mdx()`.
Starlight bundles `astro-expressive-code` which must load BEFORE `mdx()`. Changing this order breaks the build.

### Starlight Social Config

Starlight 0.38 uses **array format** for social links:
```js
social: [{ icon: "github", label: "GitHub", href: "https://..." }]
```
NOT the older object format `social: { github: "..." }`.

### Content Collections

Defined in `src/content.config.ts`:
- **`docs`** — uses Starlight's `docsLoader()` + `docsSchema()`, files in `src/content/docs/`
- **`blog`** — uses Astro's `glob()` loader, files in `src/content/blog/`, custom Zod schema with `title`, `description`, `pubDate`, `author`, `tags`, `draft`

### TailwindCSS 4 Syntax

Uses the new v4 CSS-first config:
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@theme { --color-brand-500: #00d4ff; /* ... */ }
```
**No `tailwind.config.js`** — all tokens are in `src/styles/global.css` under `@theme`.

### Design System

- **Dark-only** — no light mode. Background: `#07070b`, surfaces: `#0d0d14`, `#12121c`
- **Brand gradient**: Cyan `#00d4ff` → Violet `#7c3aed`
- **Glass effect**: `.glass`, `.glass-strong` classes (backdrop-filter blur)
- **Text gradient**: `.gradient-text` class
- **Buttons**: `.btn-primary` (gradient), `.btn-secondary` (ghost border), `.btn-ghost`
- **CSS variables**: Always use `var(--color-*)` tokens — NEVER hardcode colors
- **Fonts**: `var(--font-sans)` (Inter), `var(--font-mono)` (JetBrains Mono)

### Component Pattern

All marketing components are `.astro` files (no client-side JS). They compose via slots in `BaseLayout.astro`:
```astro
---
// frontmatter: imports, data fetching, props
---
<section class="...">
  <!-- HTML + Tailwind classes using CSS variable tokens -->
</section>
```

---

## 6. Adding Content

### New Doc Page
1. Create `src/content/docs/{category}/{slug}.md`
2. Add frontmatter: `title`, `description`
3. Add to sidebar in `astro.config.mjs` → `starlight.sidebar`

### New Blog Post
1. Create `src/content/blog/{slug}.md` (or `.mdx`)
2. Required frontmatter: `title`, `description`, `pubDate`
3. Optional: `author`, `tags`, `draft`, `updatedDate`

### New Marketing Section
1. Create `src/components/{Name}.astro`
2. Add to `src/pages/index.astro` in the compose order

---

## 7. Deployment

- **Cloudflare Workers** (free tier: 100K req/day, unlimited bandwidth)
- Config in `wrangler.jsonc`: name `headlessos-web`, serves `./dist`
- CI/CD in `.github/workflows/deploy.yml`:
  - Push to `main` → deploy to production
  - PR → deploy preview via `wrangler versions upload`
- Secrets required: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

---

## 8. Rules

1. **Zero JS by default** — Astro ships no client JS unless you add `client:*` directives. Keep it that way for marketing pages.
2. **CSS variable tokens** — always use `var(--color-*)` from `global.css`, never hardcode hex values
3. **Dark-only** — no light mode support. Starlight is forced dark via `starlight.css` overrides.
4. **Astro components** for marketing — no React, no Vue, no Svelte. Pure `.astro` files.
5. **Starlight for docs** — don't build custom doc layouts. Use Starlight's built-in pages.
6. **TailwindCSS 4 syntax** — `@theme {}` in CSS, not `tailwind.config.js`
7. **`@/*` import alias** — use `@/components/...`, `@/layouts/...`, `@/styles/...`
8. **Security headers** in `public/_headers` (CSP, HSTS, X-Frame-Options)
9. **SEO**: every page needs `<title>`, `<meta description>`, OG tags. BaseLayout handles defaults.
10. **No inline styles** — use Tailwind utilities or CSS variable classes (`.glass`, `.btn-*`, `.gradient-text`)

---

## 9. File Location Guide

| I need to... | Look in... |
|-------------|-----------|
| Edit the landing page | `src/pages/index.astro` |
| Add a marketing section | `src/components/` → compose in `index.astro` |
| Edit docs | `src/content/docs/` |
| Add a blog post | `src/content/blog/` |
| Change design tokens | `src/styles/global.css` → `@theme` block |
| Override Starlight theme | `src/styles/starlight.css` |
| Edit SEO/meta defaults | `src/layouts/BaseLayout.astro` |
| Edit navigation | `src/components/Header.astro` |
| Edit footer links | `src/components/Footer.astro` |
| Change docs sidebar | `astro.config.mjs` → `starlight.sidebar` |
| Configure deployment | `wrangler.jsonc` |
| Edit CI/CD | `.github/workflows/deploy.yml` |
| Change security headers | `public/_headers` |
| Edit logos | `src/assets/logo-mark.svg`, `logo-wordmark.svg` |

---

## 10. Related Project

The main HeadlessOS application lives in a **separate repo**: [github.com/abhee235/headlessos](https://github.com/abhee235/headlessos). This website documents that product. When writing docs, reference the main project's architecture and features but don't duplicate its code here.
