---
title: Installation
description: Detailed installation options for HeadlessOS — source, Electron app, and Docker.
---

HeadlessOS can run in three ways, depending on your preference.

## Option 1 — From source (recommended for now)

Best for development and trying out the latest features.

```bash
git clone https://github.com/abhee235/headlessos.git
cd headlessos
npm install
npm run dev
```

See the [Quick Start](/docs/getting-started) for details.

## Option 2 — Electron desktop app

A standalone macOS app wrapper is included in the repo at `electron/`. Build it yourself:

```bash
cd electron
npm install
npm run build
```

The packaged app starts both the backend and the UI bundled together — no terminal needed.

## Option 3 — Docker (coming soon)

A pre-built Docker image is on the roadmap. Subscribe to the [GitHub repo](https://github.com/abhee235/headlessos) for release notifications.

## System requirements

| | Minimum | Recommended |
| --- | --- | --- |
| OS | macOS 12 / Linux / Windows 10+ | latest |
| Node.js | 20.x | 22.x LTS |
| RAM | 512 MB | 1 GB |
| Disk | 200 MB | 500 MB |

Note: these are for **your local machine only** — the remote server has no requirements beyond a working `sshd`.
