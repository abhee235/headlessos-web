---
applyTo: "src/styles/**/*.css"
---

# Styling Instructions

## TailwindCSS 4 Config

This project uses TailwindCSS v4 with CSS-first configuration:
- Import: `@import "tailwindcss"` in `global.css`
- Plugins: `@plugin "@tailwindcss/typography"` (NOT in a JS config file)
- Tokens: `@theme { ... }` block (NOT `tailwind.config.js`)
- Vite plugin: `@tailwindcss/vite` in `astro.config.mjs`

## Design Token Categories

All in `src/styles/global.css` → `@theme`:

| Category | Variables | Examples |
|----------|----------|---------|
| Brand | `--color-brand-{50-900}` | `--color-brand-500: #00d4ff` |
| Accent | `--color-accent-{500,600}` | `--color-accent-500: #7c3aed` |
| Surfaces | `--color-bg`, `--color-bg-elevated`, `--color-surface`, `--color-surface-2` | Dark backgrounds |
| Borders | `--color-border`, `--color-border-strong` | RGBA white values |
| Text | `--color-fg`, `--color-fg-muted`, `--color-fg-subtle` | Foreground colors |
| Fonts | `--font-sans`, `--font-mono` | Inter, JetBrains Mono |
| Radii | `--radius-sm` through `--radius-2xl` | 6px to 28px |

## Utility Classes

Defined in `global.css`:
- `.glass` / `.glass-strong` — frosted glass with backdrop-filter
- `.gradient-text` — brand gradient on text
- `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-ghost` — button styles
- `.chip` — small label/badge
- `.bg-mesh` — animated gradient background
- `.bg-grid` — subtle grid overlay
- `.float-slow` — slow floating animation

## Starlight Overrides

`src/styles/starlight.css` forces dark mode and maps Starlight's `--sl-color-*` variables to match the marketing site aesthetic. Both `:root` and `[data-theme="light"]` are overridden to always show dark.

## Rules

- NEVER hardcode hex colors in components — use `var(--color-*)` tokens
- NEVER create `tailwind.config.js` — use `@theme` in CSS
- NEVER use CSS-in-JS or inline `style` attributes
