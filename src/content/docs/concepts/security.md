---
title: Security Model
description: How HeadlessOS protects your servers and your credentials.
---

HeadlessOS sits between you and your servers. We take that seriously.

## What HeadlessOS does

- Connects to your server using **standard SSH** (`ssh2` library).
- Runs commands on your behalf — the same commands you'd run by hand.
- Reads/writes files via **SFTP**.
- Caches output locally to reduce server load.

## What HeadlessOS does *not* do

- ❌ It does **not** install anything on your server.
- ❌ It does **not** open inbound ports on your server.
- ❌ It does **not** send your credentials anywhere except the SSH connection.
- ❌ It does **not** expose the backend to the internet — it binds to `127.0.0.1` only.
- ❌ It does **not** send your terminal output to the LLM unless a parser doesn't exist for that command (and even then, only after stripping ANSI codes).

## Threat model

| Threat | Mitigation |
| --- | --- |
| **Command injection** via user input | All paths, IDs, and names are validated against allowlists before being interpolated. We never construct commands from raw user strings. |
| **Path traversal** in file operations | `validatePath()` rejects `..`, requires absolute paths, and SFTP is used for all file I/O. |
| **XSS via terminal output** | Output goes through `xterm.js` (which handles ANSI safely). Never `dangerouslySetInnerHTML`. |
| **Credential leakage** | SSH credentials are kept in memory, optionally encrypted on disk via system keychain. Never sent to the LLM. |
| **Rogue LLM commands** | LLM responses are constrained by Zod schemas. We never `exec()` a command that the LLM suggests without an allowlist check. |

## SSH channel discipline

- `exec()` channels for one-shot commands. Always have timeouts. Always closed when done.
- `shell()` channels only for the interactive terminal. One per session.
- `sftp()` for files. Reused. Never replaced with `exec('cat')` or `exec('rm')`.

## Where data lives

- **Connection details** — your SSH host, port, username — are stored locally on your machine. Optional credential storage uses your OS keychain.
- **Parsed output** — cached in memory only. Cleared on server disconnect.
- **LLM logs** — token counts and latencies are tracked locally. The actual prompts/completions are not persisted by default.

## Auditing

The repo is open source. Read `server/src/security/`, `server/src/ssh/`, and the `ARCHITECTURE.md` doc. Find something concerning? Open an issue or email the maintainers.
