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
| Framework | Astro 6 (static SSG; small vanilla scripts only where a section needs them) |
| Docs | @astrojs/starlight 0.38 (Pagefind search, sidebar, dark mode) |
| Styling | TailwindCSS 4 via `@tailwindcss/vite` plugin |
| Typography | `@tailwindcss/typography` for blog prose |
| Blog | MDX via `@astrojs/mdx` |
| SEO | `@astrojs/sitemap`, JSON-LD, Open Graph, canonical URLs |
| Deploy | Cloudflare Workers via Wrangler 3 |
| CI/CD | GitHub Actions (`cloudflare/wrangler-action@v3`) |
| Formatting | Prettier + `prettier-plugin-astro` |
| TypeScript | Strict mode, `@/*` path alias → `src/*` |
| Fonts | Geist + Geist Mono (Google Fonts) |

---

## 3. Quick Start Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:4321
npm run build        # Static build → ./dist (pages, docs, redirects + Pagefind index)
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
│   ├── assets/
│   │   ├── logo-mark.svg, logo-wordmark.svg
│   │   └── screens/              # App screenshots (WebP, 3200×2000) + the video poster
│   ├── components/               # Astro components (marketing sections)
│   │   ├── Header.astro, Footer.astro, Logo.astro
│   │   ├── Hero.astro            # Rotating headline ("Your VPS / cloud server / …") + the demo video
│   │   ├── BeforeAfter.astro     # The commands you'd type vs the Dashboard
│   │   ├── AppsShowcase.astro    # Tabbed screenshot gallery (auto-advances)
│   │   ├── HowItWorks.astro      # Runs on your computer, not the server (and isn't an OS): computer → SSH → server
│   │   ├── Features.astro        # Bento grid
│   │   ├── GetStarted.astro, FAQ.astro, OpenSourceCTA.astro
│   ├── content/
│   │   ├── docs/docs/            # Starlight docs (Markdown), served under /docs/…
│   │   └── blog/                 # Blog posts (Markdown/MDX)
│   ├── lib/platform.ts           # OS detection for the download buttons
│   ├── layouts/
│   │   └── BaseLayout.astro      # Marketing layout (SEO head, fonts, header/footer)
│   ├── pages/
│   │   ├── index.astro           # Landing page (composes all marketing sections)
│   │   ├── download.astro        # Per-OS downloads, filled from the latest GitHub release
│   │   ├── blog/                 # Blog listing + [slug] pages
│   │   └── 404.astro
│   └── styles/
│       ├── global.css            # TailwindCSS 4 + design tokens + utility classes
│       └── starlight.css         # Starlight palette for both themes
├── scripts/import-screens.mjs    # 2× PNG captures → src/assets/screens/*.webp
├── public/
│   ├── media/                    # headlessos-demo.mp4 / .webm (hero video)
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
- **`docs`** — uses Starlight's `docsLoader()` + `docsSchema()`, files in `src/content/docs/docs/` so every page lives under `/docs/…`. The old top-level URLs (`/introduction` etc.) redirect via `redirects` in `astro.config.mjs`.
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

- **Light by default, dark on request.** `html[data-theme]` is `light` or `dark`. The header toggle stores the choice under Starlight's `starlight-theme` key, so the docs follow it (`""` = follow the system; nothing stored = light). Light values live in `@theme`, dark values in `html[data-theme="dark"]` in `global.css`.
- **Colours that must work in both themes**: use the tokens, or `ink` for translucent layers (`bg-ink/5`, `border-ink/20`, `rgb(var(--ink) / 0.05)`) and `--paper` for the page colour. Never `white/…` or `rgba(255,255,255,…)`, which vanish on light. Terminal snippets (`.term`) and anything drawn on them stay dark in both themes.
- **Brand gradient**: Cyan `#00d4ff` → Violet `#7c3aed` (logo, glows, `.gradient-text`)
- **Type**: `.display` (hero), `.h2` (section titles, `.dim` for the muted half), `.lede` (intro paragraphs), `.eyebrow` (mono label above a title)
- **Surfaces**: `.card` (bordered panel), `.frame` (bezel around screenshots and the video), `.term` (terminal snippet, use a `<pre>`), `.icon-tile` (set `--tile` for its colour), `.glass`, `.glass-strong`
- **Buttons**: `.btn-primary` (white), `.btn-secondary` (outlined), `.btn-ghost`; sizes `.btn-sm`, `.btn-lg`
- **Scroll reveal**: add `.rv` (and `[--d:.1s]` for a stagger delay). Content shows without JS; `BaseLayout` adds `.in` on scroll.
- **CSS layers**: shared classes live in `@layer components` so Tailwind utilities can override them. Keep new shared classes there.
- **Tokens**: Tailwind utilities from `@theme` (`text-fg-muted`, `bg-surface`, `border-border`) or `var(--color-*)` — never hardcode colours
- **Fonts**: `var(--font-sans)` (Geist), `var(--font-mono)` (Geist Mono)

### Component Pattern

All marketing components are `.astro` files. Interactivity (the gallery tabs, OS-aware download buttons, the video toggle, copy buttons) is a small `<script>` in the component, never a framework. They compose via slots in `BaseLayout.astro`:
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
1. Create `src/content/docs/docs/{category}/{slug}.md` (it is served at `/docs/{category}/{slug}`)
2. Add frontmatter: `title`, `description`
3. Add to sidebar in `astro.config.mjs` → `starlight.sidebar` with `slug: "docs/{category}/{slug}"`

### New Blog Post
1. Create `src/content/blog/{slug}.md` (or `.mdx`)
2. Required frontmatter: `title`, `description`, `pubDate`
3. Optional: `author`, `tags`, `draft`, `updatedDate`

### New Marketing Section
1. Create `src/components/{Name}.astro`
2. Add to `src/pages/index.astro` in the compose order

### Screenshots and the demo video
- **Capture from a demo server, never a real one.** Screens must not show real hostnames, IPs, user names or the capturing PC's account name (the Home hub greets the local OS user; blank it for captures).
- **Only show screens that match the current app design.** Skip any view that still has an older look (for now: the Control Center's Fleet tab).
- **Stills**: 1600×1000 CSS px at device scale 2, saved as PNG, then `node scripts/import-screens.mjs <folder> [names…]` writes `src/assets/screens/<name>.webp`. `AppsShowcase.astro` imports them by name.
- **Video**: `public/media/headlessos-demo.mp4` (H.264, 30 fps, faststart) and `.webm` (VP9), 1600×1000, muted, looping. It must start and end on the same screen so the loop is seamless. `src/assets/screens/demo-poster.webp` is a frame from it. It opens by adding a server (a documentation-range host such as `web-01.example.com`), so visitors see the first step.
- **Copy**: say "VPS", "cloud server", "home lab", not only "Linux server"; lead with what the visitor gets, and keep the "isn't an operating system" clarification out of the hero.

---

## 7. Deployment

- **Cloudflare Workers** (free tier: 100K req/day, unlimited bandwidth)
- Config in `wrangler.jsonc`: name `headlessos-web`, serves `./dist`
- CI/CD in `.github/workflows/deploy.yml`:
  - Push to `main` → deploy to production
  - PR → deploy preview via `wrangler versions upload`
- Secrets required: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Until both are set on the repository, the workflow's deploy step fails and the site is deployed by hand with `npm run deploy` (needs `npx wrangler login` once).

---

## 8. Rules

1. **Minimal JS** — no frameworks and no `client:*` islands on marketing pages. A component may carry a small vanilla `<script>` for behaviour CSS can't do, and the page must still read correctly without it.
2. **CSS variable tokens** — always use `var(--color-*)` from `global.css`, never hardcode hex values
3. **Both themes** — check every change in light and dark. Starlight's ThemeProvider is overridden (`src/components/docs/ThemeProvider.astro`) so a first visit is light there too.
4. **Astro components** for marketing — no React, no Vue, no Svelte. Pure `.astro` files.
5. **Starlight for docs** — don't build custom doc layouts. Use Starlight's built-in pages.
6. **TailwindCSS 4 syntax** — `@theme {}` in CSS, not `tailwind.config.js`
7. **`@/*` import alias** — use `@/components/...`, `@/layouts/...`, `@/styles/...`
8. **Security headers** in `public/_headers` (CSP, HSTS, X-Frame-Options)
9. **SEO**: every page needs `<title>`, `<meta description>`, OG tags. BaseLayout handles defaults.
10. **No inline styles** — use Tailwind utilities or the shared classes. The one exception is a CSS variable set per item in a loop (`style={`--d:${i * 0.06}s`}`), which Tailwind can't generate.

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
