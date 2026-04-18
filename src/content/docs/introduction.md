---
title: Introduction
description: What HeadlessOS is, and why it exists.
---

**HeadlessOS** is a localhost web application that turns any headless Linux server into a familiar desktop experience — file explorer, Docker dashboard, system monitor, and more — **without installing anything on the server**.

## How it works

```
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│  Browser (React)    │  HTTP   │  Backend (Fastify)  │   SSH   │   Your Linux VPS    │
│  localhost:3000     │ ───────►│  localhost:3001     │ ───────►│   (unchanged)       │
└─────────────────────┘   WS    └─────────────────────┘         └─────────────────────┘
```

1. The backend connects to your server with **standard SSH** using `ssh2`.
2. It runs commands like `df -h`, `docker ps`, `ls -la` over `exec()` channels.
3. Output is **stripped of ANSI codes**, fed through a **deterministic parser** (or an **LLM fallback**), validated against a **Zod schema**, and returned as typed JSON.
4. The React frontend renders the JSON as desktop-class UI.

Your server runs nothing new. No agent. No daemon. No port to open.

## Why we built it

Existing server-management tools (Cockpit, Webmin, Portainer, etc.) all ask you to install an agent on every server. That works — but it adds maintenance, attack surface, and a chunk of RAM to every box you own.

We wanted the opposite: a **client-only** tool that uses the SSH access you already have, talks to commands you already trust, and renders the result as a UI you'd actually enjoy using.

## What's next

- Read the [Quick Start](/docs/getting-started) to install and connect your first server.
- See the [Architecture](/docs/concepts/architecture) doc for a deeper dive.
- Check the [GitHub repo](https://github.com/abhee235/headlessos) and consider starring it.
