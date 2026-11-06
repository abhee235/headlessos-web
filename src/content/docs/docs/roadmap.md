---
title: Roadmap
description: What HeadlessOS can do today, from desktop apps and SSH sessions to AI agents, and what is planned next for the project.
---

This page lists what has shipped and what is planned. The detailed task tracker is [`docs/PROGRESS.md`](https://github.com/abhee235/headlessos/blob/main/docs/PROGRESS.md) in the repository, and release notes are in the [changelog](/docs/changelog).

## Shipped

### Desktop and apps

- Multi-server SSH connection management
- Desktop with movable, snapping windows, dock, launcher, Quick Settings, notifications and a Home hub
- Dashboard with live system metrics
- File Explorer over SFTP, with a code editor, uploads and split panes
- Interactive terminal, using xterm.js over WebSocket
- Docker app: containers, images, logs, files and shells inside containers, and installing Docker on a server
- Services app
- Task Manager: processes, performance, app history, startup apps, users and services
- Server Admin: network, firewall, security, web server, packages, cron, logs and storage
- Command palette (`Ctrl+K`)

### Sessions

- One persistent session per server, with its own windows and preference overrides
- Session hibernation, so you can pick up where you left off
- Fleet overview of all your servers

### Parsing

- Deterministic parsers first, with an optional LLM fallback
- Zod schemas that validate parsed output and describe it to models
- Output cache keyed on a hash of the raw output
- LLM usage tracking, with tokens and estimated cost

### AI

- Provider choice in Settings → AI / LLM: OpenAI, Claude or a local model through Ollama
- AI Agent: a ReAct-style agent that investigates a question over several steps
- UI Agent: builds a view from a plain-language request, widget by widget
- Follow-up requests that refine the open view
- Dynamic UI engine with a template library
- Smart layout engine with responsive widget grids
- Saved apps from generated views
- LLM Observatory: traces of every model and tool call
- Typed action catalog, approval for changes, an audit log and secret redaction for agents
- Context handling sized to each model's real window, including small local models

### Desktop app and project

- Desktop app for macOS and Windows, with Linux packages (AppImage and `.deb`) from version 0.2.1
- A log file with secrets masked, and a dialog when the backend stops
- Per-install API token, Host and WebSocket-origin checks, and a per-install encryption secret
- MIT license, public repository, `SECURITY.md` and `CONTRIBUTING.md`

## Planned

- Pre-built Docker image for self-hosting
- Hosted version at `app.headlessos.com` (free for individual use)
- Plugin marketplace for community-built apps
- Mobile-friendly responsive UI
- SAML / OIDC auth for hosted version

## Influence the roadmap

Open an [issue](https://github.com/abhee235/headlessos/issues) to suggest a feature or comment on an existing one.
