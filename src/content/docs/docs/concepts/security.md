---
title: Security model
description: What HeadlessOS stores and how it is encrypted, what reaches your server, the local API token, the command policy, and reporting a vulnerability.
---

HeadlessOS holds your credentials and runs commands over SSH. This page says what it does and where each protection stops. The formal policy is [`SECURITY.md`](https://github.com/abhee235/headlessos/blob/main/SECURITY.md).

## What reaches your server

HeadlessOS connects over standard SSH with the full rights of the user you log in as. It installs no agent and opens no ports. The server receives commands, SFTP requests and whatever you type in a terminal.

A few features leave something behind:

- The Docker app can install Docker when you ask, using the script from `get.docker.com`.
- Files moved to trash go to `/tmp/.headlessos-trash` on the server.
- Saving a form in a generated view keeps a `.bak` copy of the file.

:::caution
**Host keys are not verified.** HeadlessOS has no `known_hosts` check, so it can't detect a machine posing as your server. A password sent to that machine would be exposed. Connect over networks you trust.
:::

## What is stored, and how

Everything stays in `~/.headlessos/` on your computer. The folder is created `0700` and files with secrets `0600`. Windows ignores those modes.

| What | File | Protection |
| --- | --- | --- |
| SSH passwords | `servers.json` | AES-256-GCM |
| SSH private keys, passphrases | `servers.json` | AES-256-GCM, never returned to the UI |
| OpenAI and Anthropic keys | `llm.json` | AES-256-GCM, never returned to the UI |
| Encryption secret, API token | `enc-key`, `api-token` | Plain text |
| Agent audit log, desktop log | `audit/`, `logs/` | Plain text. The desktop log masks secrets. |
| Traces, sessions | `observatory/`, `sessions/` | Plain JSON |

:::caution
**SSH keys are copied, not referenced.** Adding a server with an SSH key puts the key's text in `servers.json`, encrypted, with any passphrase from that form. Agent authentication keeps the key out of the file.
:::

### How encryption works

The key is derived with scrypt from a random secret in `enc-key`, the computer's hostname and your OS user ID. As a result:

- Stored secrets don't move between machines. On a new computer, re-enter them.
- Renaming the computer or deleting `enc-key` makes them unreadable. Your servers stay in the list. Type the password again at sign-in. A server that used an SSH key has to be removed and added again.
- If `servers.json` itself can't be read, the app starts with an empty list and keeps the damaged file as `servers.json.broken`.
- Encryption stops casual reading of a file. It doesn't stop code running as your user, or anyone with a copy of the folder who can guess the hostname and user ID, because the key material sits beside the data.

## The local API

- **Binding.** The backend listens on `127.0.0.1` only.
- **API token.** Every API and WebSocket request must carry the random token from `api-token`, except `/health`. A web page can't read that file.
- **Host check.** A `Host` header other than `localhost`, `127.0.0.1` or `::1` is refused, which blocks DNS rebinding.
- **WebSocket origin.** Upgrades need a localhost origin, no origin, or `null`. The desktop app sends `null`, but so can a sandboxed iframe, so there the token is the real check.

These checks stop web pages, not local software: any program running as your user can read the token file. On a source run, the Vite proxy on port 3000 adds the token to each request it forwards, so treat source runs as development only.

## The command policy

Every command sent through the SSH manager's `exec()` passes `CommandPolicy`.

| Layer | Applies to | Effect |
| --- | --- | --- |
| Blocklist | Every command | Refuses patterns such as `rm -rf /`, `mkfs`, `reboot` and piping into a shell |
| Allowlist | Classic apps | By default an unlisted command runs and a warning is logged. `HEADLESS_POLICY_MODE=enforce` refuses it, but the list doesn't yet cover every app command. |
| Action grant | Agent runs | Only the command the action runner just built may run |

A terminal is a real shell, so what you type isn't checked. Outside agent runs, SFTP skips the policy, though File Explorer validates its paths. The blocklist is pattern matching, not a sandbox.

Separately, values from the UI, such as paths and container IDs, are validated and quoted before they enter a command.

## What leaves your computer

HeadlessOS has no telemetry: no analytics, crash reporting or update checks. Traffic goes only here:

| Destination | What | When |
| --- | --- | --- |
| Your servers | SSH traffic | When you connect |
| Open-Meteo | The city you search for, its coordinates | After you set a weather city |
| OpenAI or Anthropic | Prompts and command output | If you choose that provider |
| Your Ollama server | The same | If you choose it. A remote URL needs confirmation. |
| A plugin manifest URL | One request | If you enter one in Settings → Plugins |

Agents pick typed actions from a fixed catalog instead of writing commands, and changes wait for your approval. See [AI safety](/docs/ai/safety).

:::caution
**Redaction is pattern matching.** It removes common formats of passwords, tokens and keys before output reaches a model, on agent runs, the parsing fallback and Dynamic UI generation. A secret in an unusual format can get through.
:::

## Report a vulnerability

Please don't open a public issue. Use **Report a vulnerability** on the repository's [Security tab](https://github.com/abhee235/headlessos/security). Say what you found, how to reproduce it and what an attacker could do. Fixes go into the latest release.
