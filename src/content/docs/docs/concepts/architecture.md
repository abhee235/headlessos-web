---
title: Architecture
head:
  - tag: title
    content: "Architecture: the app, backend and SSH | HeadlessOS Docs"
description: How the HeadlessOS app, its local backend and your Linux server fit together, on desktop and from source, and where state is stored.
---

HeadlessOS has three parts: a user interface, a backend that runs on your own computer, and the SSH service your Linux server already has. The server gets no new software. All the logic stays on your machine.

## How the parts fit together

```text
Your computer                                     Linux server
+--------------------------------------+         +--------------+
| UI: React, in Electron or a browser  |         | sshd         |
|    |                                 |         |              |
|    | REST and WebSocket, with token  |         | commands,    |
|    v                                 |   SSH   | SFTP and     |
| Backend: Node.js and Fastify         |<------->| shells, as   |
|    listens on 127.0.0.1 only         |         | your user    |
|    keeps state in ~/.headlessos/     |         |              |
+--------------------------------------+         +--------------+
     |
     | only if you choose a provider
     v
OpenAI, Anthropic, or your Ollama server
```

- **The UI** draws the desktop and its apps. It never talks to your server. It calls the backend.
- **The backend** holds the SSH connections, runs commands, parses output and keeps state. Every request to it needs a per-install token. See [Security model](/docs/concepts/security).
- **The server** sees ordinary SSH sessions from the user you log in as.

## Desktop app and running from source

The same backend and UI code runs both ways.

| | Desktop app | From source (`npm run dev`) |
| --- | --- | --- |
| Backend | Bundled `server.mjs` in an Electron utility process | `tsx watch` on port 3001 |
| UI | Built files loaded from `file://` | Vite dev server on port 3000 |
| Backend port | A free port the OS picks at startup | 3001 |
| UI to backend | Direct to `http://localhost:<port>` | Vite proxies `/api` and `/ws` |
| API token | Handed to the page by the preload script | Added by the Vite proxy |
| Logs | `~/.headlessos/logs/headlessos.log` | The terminal running `npm run dev` |

At startup the desktop app sets `PORT=0`. The backend prints the port it got on standard output, and `electron/main.js` reads it before it opens the window. The preload script passes the port and token to the page.

The window runs with Node integration off, context isolation on and the sandbox on. If the backend stops, a dialog offers Restart, Open Log and Quit.

## Inside the backend

`server/src/index.ts` is the single wiring point. It creates the components, boots them, registers parsers and routes, and handles shutdown.

- **Service container.** Long-lived services extend `BaseService` and boot in two phases: first construct, then connect to each other. These include the config store, SSH manager, parsing pipeline, orchestrator, command policy and domain services. Other parts are plain classes, such as the output cache, usage tracker, Dynamic UI generator and agents.
- **Routes.** Each route file is a Fastify plugin that gets its dependencies through plugin options. Routes stay thin and call a domain service in `server/src/services/domain/`.
- **SSH.** `server/src/ssh/connection-manager.ts` uses the `ssh2` library directly and keeps one connection per server. Commands run on separate exec channels, at most four at a time by default. Each terminal gets its own shell channel, and file work shares one SFTP session.
- **Command policy.** Every command sent through the manager's `exec()` passes a policy check first. See [The command policy](/docs/concepts/security#the-command-policy).
- **Reconnect.** A request hook reconnects a dropped server with stored credentials before a data route runs.

## Two paths for server data

**Classic apps** (Dashboard, Files, Docker, Services, Task Manager, Server Admin) run fixed commands or use SFTP, then turn the output into typed data. See [How parsing works](/docs/concepts/parsing).

**AI features** never send command text. The [AI Agent](/docs/ai/agent) and [UI Agent](/docs/ai/ui-agent) call typed actions from a catalog in `server/src/agent/actions/catalog/`, and an action runner validates the parameters, then builds and runs the command. A view from the UI Agent is JSON, which a generic renderer in `client/src/components/DynamicUI/` draws. See [AI safety](/docs/ai/safety).

Models sit behind one `LLMProvider` interface, with OpenAI, Anthropic and Ollama implementations. You pick one in Settings → AI. See [AI setup](/docs/ai/setup). With no provider, the classic apps keep working on deterministic parsers.

## Inside the UI

The UI uses React 19, Vite, Zustand and Tailwind CSS 4. The desktop is a window manager: `store/window-store.ts` opens windows, `components/Desktop/WindowManager.tsx` maps each app to its component, and `lib/apps.ts` holds app metadata, all under `client/src/`.

Each server is a persistent session with its own windows and preference overrides. Backend calls go through `lib/api.ts`. Live data uses WebSockets under `/ws/`.

## Where state lives

Everything on disk is in `~/.headlessos/`, in your home folder. Desktop and source runs share it.

| Path | Holds |
| --- | --- |
| `servers.json` | Server list and credentials |
| `llm.json` | Chosen provider, models and API keys |
| `enc-key`, `api-token` | Per-install secrets |
| `sessions/<id>.json` | Each server's windows, preferences and agent history |
| `observatory/traces/` | Traces of model and tool calls, kept 30 days, up to 10,000 |
| `audit/actions.jsonl` | Agent actions and your answers |
| `dynamic-ui-cache/`, `user-apps/` | Generated views and saved apps |
| `wallpapers/` | Wallpapers you upload |
| `logs/` | Desktop app log |

Two things are not in that folder. The output cache is in memory, so a restart clears it. Global preferences such as the theme are in the UI's `localStorage`, so the desktop app and a browser keep separate copies.

On a clean shutdown the backend marks sessions with live connections as hibernated, denies any unanswered approvals and closes its SSH connections. You can wake those sessions on the next launch. See [Sessions and Fleet](/docs/guides/sessions-and-fleet).
