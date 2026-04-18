---
title: Architecture
description: How HeadlessOS works under the hood — the SSH pipeline, parsing, and rendering.
---

HeadlessOS is built around a single idea: **turn raw terminal output into typed JSON, then render it as UI.**

## High-level flow

```
React UI → Fastify backend → SSH (ssh2) → Linux server
                ↓
         Command output (raw text)
                ↓
         Strip ANSI codes
                ↓
         Deterministic parser  (preferred — fast, free)
                ↓ (if no parser exists)
         LLM with Zod schema   (fallback — accurate, costs $)
                ↓
         Validated typed JSON
                ↓
         React UI renders it
```

## Components

### Backend (Fastify + TypeScript)

A Node.js process listening on `localhost:3001` only. Never exposed to the internet.

Key services (all extend a `BaseService` and live in a `ServiceContainer`):

- **ConnectionManager** — manages SSH connections via `ssh2` directly. One connection per server, multiple `exec()` channels for parallel command execution, one `shell()` channel per interactive terminal, lazy-initialized `sftp()` for file operations.
- **CommandOrchestrator** — runs multi-command execution plans in parallel, retries with error context on parse failure, tries fallback commands on shell failure (e.g., `ip addr` → `ifconfig`).
- **ParsingPipeline** — strips ANSI, calls a deterministic parser if one is registered for the command, falls back to LLM otherwise, and validates the result with Zod.
- **OutputCache** — hash-based cache keyed by `(serverId, command, rawOutput)`. Identical output is parsed once and reused.
- **LLMUsageStats** — tracks tokens, cost, and latency for every LLM call so you can see exactly what the AI is costing you.

### Frontend (React 19 + Vite + Zustand)

A SPA that talks to the backend over REST + WebSocket. Built with TailwindCSS 4 and styled like a desktop OS — windows, taskbar, command palette, multiple sessions.

### Schemas (Zod)

Every piece of data crossing a boundary has a Zod schema. Schemas serve a dual purpose:

1. **Runtime validation** — `Schema.parse(data)` throws on bad data.
2. **LLM structured output** — `zodResponseFormat(Schema, 'name')` constrains what the LLM can return.

This means the LLM literally can't return malformed JSON. We validate everything.

## Security boundaries

- The backend listens on `127.0.0.1` only. Never `0.0.0.0`.
- All file operations use **SFTP** — never `exec('cat ...')` or `exec('rm ...')`.
- All user input is validated against allowlists (paths, container IDs, PIDs, service names) before being interpolated into commands.
- Frontend never sends raw HTML to the DOM — terminal output is rendered through `xterm.js` only.

See the [Security](/docs/concepts/security) page for the full threat model.
