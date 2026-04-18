---
applyTo: "src/components/**/*.astro,src/pages/**/*.astro,src/layouts/**/*.astro"
---

# Astro Component Instructions

## Patterns

- All marketing components are **`.astro` files** — no client-side frameworks
- Zero JS shipped: never use `client:*` directives on marketing pages
- Components receive data via `Astro.props` with a typed `Props` interface
- Use `@/*` import alias: `import Header from "@/components/Header.astro"`

## Styling

- **TailwindCSS 4** utilities in `class` attributes
- CSS variable tokens: `var(--color-brand-500)`, `var(--color-fg-muted)`, etc.
- Utility classes from `global.css`: `.glass`, `.glass-strong`, `.gradient-text`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.chip`, `.bg-mesh`, `.bg-grid`
- **NEVER** hardcode hex colors — always use design tokens
- **NEVER** use inline `style` attributes — use Tailwind or utility classes

## Layout

- `BaseLayout.astro` wraps marketing pages (SEO head, Header, Footer)
- Starlight handles its own layout for `/docs/*` pages
- Landing page (`index.astro`) composes sections: Hero → Features → Screenshots → GetStarted → FAQ → OpenSourceCTA

## SEO

- `BaseLayout` provides default OG, Twitter, JSON-LD meta
- Override with props: `<BaseLayout title="..." description="...">`
- Every page needs a meaningful `title` and `description`
