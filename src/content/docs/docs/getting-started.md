---
title: Quick Start
description: Get HeadlessOS running locally and connect your first server in under a minute.
---

This guide gets you from zero to a connected server in three commands.

## Prerequisites

- **Node.js** 20 or later
- **npm** 10 or later
- An SSH-accessible Linux server (any modern distro)

## 1. Clone & install

```bash
git clone https://github.com/abhee235/headlessos.git
cd headlessos
npm install
```

The repo is an npm workspace monorepo (server, client, shared). One install covers everything.

## 2. Configure environment

Copy the example env file:

```bash
cp .env.example .env
```

If you want LLM-powered parsing for unknown commands, add your API key:

```bash
# .env
OPENAI_API_KEY=sk-...
```

> **Note:** The LLM is only used as a fallback. Most common commands have deterministic parsers and never hit the API.

## 3. Start the app

```bash
npm run dev
```

This boots both the backend (`:3001`) and the frontend (`:3000`).

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 4. Add a server

1. Click **Add Server** in the sidebar.
2. Enter your connection details:
   - **Host** — `your-vps.example.com` or an IP
   - **Port** — `22` by default
   - **Username** — typically `root` or your user
   - **Auth method** — SSH key (recommended) or password
3. Click **Connect**.

That's it. You'll see your server appear in the sidebar with a live dashboard.

## Local dev SSH server

Don't have a spare VPS handy? The repo ships a dev SSH server:

```bash
./dev/vm.sh start    # Lima VM (recommended — real Ubuntu + Docker)
# or
cd dev && docker compose up -d   # Lightweight Docker container
```

Then connect to `127.0.0.1:2222` with `testuser` / `testpass`.

## Next steps

- [Architecture](/docs/concepts/architecture) — how the parsing pipeline works
- [Security](/docs/concepts/security) — what we do (and don't) execute
- [Apps](/docs/apps/dashboard) — what each built-in app can do
