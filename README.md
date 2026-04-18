# HeadlessOS Web

Marketing website and documentation for [HeadlessOS](https://github.com/abhee235/headlessos) — built with [Astro](https://astro.build) and deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/).

Live: [https://headlessos.com](https://headlessos.com)

## Stack

- **Astro 5** — static-first framework, ships zero JS by default
- **Starlight** — documentation framework with built-in search (Pagefind)
- **TailwindCSS 4** — utility-first styling
- **Cloudflare Workers** — free-tier hosting (100K req/day, unlimited bandwidth)
- **MDX** — for blog posts with embedded components

## Local development

```bash
npm install
npm run dev          # http://localhost:4321
```

## Build

```bash
npm run build        # outputs to ./dist
npm run preview      # preview the production build locally
```

## Deploy to Cloudflare Workers

One-time setup:

```bash
npx wrangler login
```

Deploy:

```bash
npm run deploy       # builds + wrangler deploy
```

CI/CD via GitHub Actions is configured in `.github/workflows/deploy.yml`. Set the following repository secrets:

- `CLOUDFLARE_API_TOKEN` — create with the "Edit Cloudflare Workers" template
- `CLOUDFLARE_ACCOUNT_ID` — from the Cloudflare dashboard sidebar

## Project structure

```
headlessOS-Web/
├── astro.config.mjs              # Astro + integrations config
├── wrangler.jsonc                # Cloudflare Workers deployment config
├── src/
│   ├── assets/                   # Logos, images
│   ├── components/               # Reusable Astro components
│   │   ├── marketing/            # Landing-page sections
│   │   └── ui/                   # Buttons, cards, etc.
│   ├── content/
│   │   ├── docs/                 # Starlight docs (Markdown)
│   │   └── blog/                 # Blog posts (MDX)
│   ├── layouts/
│   │   └── BaseLayout.astro      # Marketing layout (head, meta, fonts)
│   ├── pages/
│   │   ├── index.astro           # Landing page
│   │   ├── blog/                 # Blog listing + post pages
│   │   └── 404.astro
│   └── styles/
│       ├── global.css            # Tailwind + design tokens
│       └── starlight.css         # Starlight theme overrides
└── public/                       # Static assets served at /
    ├── favicon.svg
    └── _headers                  # Cloudflare security headers
```

## License

MIT

## AI Agent Instructions

AI coding assistants (Copilot, Cursor, etc.) are configured via:
- `AGENTS.md` — master ruleset (tech stack, patterns, design system, rules)
- `.github/copilot-instructions.md` — concise Copilot Chat instructions
- `.github/copilot/*.md` — scoped instructions per file type (components, content, styling)
- `.github/prompts/*.prompt.md` — reusable prompts (`/new-section`, `/new-doc`, `/new-blog-post`)
