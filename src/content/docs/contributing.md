---
title: Contributing
description: How to contribute to HeadlessOS.
---

We welcome contributions of any size — bug reports, parsers, UI improvements, docs.

## Getting set up

1. Fork the [repo](https://github.com/abhee235/headlessos).
2. Clone, install, and run the dev server:
   ```bash
   git clone https://github.com/<your-user>/headlessos.git
   cd headlessos
   npm install
   npm run dev
   ```
3. Spin up the local SSH server for testing:
   ```bash
   ./dev/vm.sh start
   ```

## Project layout

This is an npm workspace monorepo:

- `server/` — Fastify backend (TypeScript strict)
- `client/` — React 19 + Vite + TailwindCSS 4 frontend
- `shared/` — shared types and Zod schemas
- `electron/` — desktop wrapper
- `docs/` — internal architecture & decision docs

## Document-Driven Development

The project follows strict DDD. Every task starts by reading `docs/PROGRESS.md` and the relevant phase doc. See `AGENTS.md` for the full ruleset.

## Tests

Every PR must include tests for any new code. Run them with:

```bash
npm test
```

We use Vitest across both server and client.

## Code style

- TypeScript strict mode — no `any`.
- Async/await only — no callbacks.
- Zod schemas for all data crossing boundaries.
- Fastify patterns (not Express).
- Functional React components with hooks.

## Good first issues

Check the [GitHub issues](https://github.com/abhee235/headlessos/issues?q=is%3Aopen+label%3A%22good+first+issue%22) labeled `good first issue`.

A great place to start: write a deterministic parser for a Linux command we don't have one for yet.
