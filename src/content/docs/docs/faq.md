---
title: FAQ
description: Common questions about HeadlessOS, including cost, changes to your server, sudo, SSH config, 2FA, AI keys, your data and updates.
---

## About HeadlessOS

### Is HeadlessOS free?

Yes. It's free and open source under the MIT licence. The source is on [GitHub](https://github.com/abhee235/headlessos).

### Is it ready for production servers?

Treat it with care. **Settings → About** labels version 0.3.1 Alpha, and the app runs real commands on real servers. Try it on a test server first, and keep your own backups.

### Which systems does it run on?

The app runs on Windows, macOS and Linux. It manages Linux servers only.

### Which Linux distributions work on the server?

Any distribution with SSH and the standard tools should connect. Debian and Ubuntu get the most from it, because some **Server Admin** sections use `apt` and `ufw`. See [what your server needs](/docs/connect-a-server#what-your-server-needs).

### Can I run it in a browser?

Yes, if you [run it from source](/docs/installation#run-from-source). The desktop app is the same app in its own window, with the backend included.

### Can I use it from another computer or a phone?

No. The backend listens only on `127.0.0.1` and refuses requests that aren't for localhost. Install the app on each computer you use.

### Do I need an AI key?

No. The apps work with the built-in parsers alone. You only need a provider for the AI Agent and the UI Agent, or to read output that no parser handles. See [Set up AI](/docs/ai/setup).

### Can I use a local model instead of a cloud service?

Yes. Choose Ollama in **Settings → AI / LLM**, and your prompts stay with your own Ollama server.

## Servers and SSH

### Does it install anything on my server?

It installs no agent or daemon, and opens no port. A few things can change the server, but only when you ask:

- **Install Docker** in the Docker app runs the official script from `get.docker.com`.
- **Server Admin** can install and remove packages and change settings.
- **Sandbox Mode** in the UI Agent is off by default. When you turn it on, discovery commands run in an isolated Docker container on the server.
- AI agents can ask to change the server, and each change waits for your approval.

### Do I need root?

No. You can sign in as a normal user. Docker needs a user in the `docker` group. Many changes, such as service and firewall actions, run through `sudo` with no way to type a password, so they need root or passwordless sudo.

### Does it use my ~/.ssh/config?

No. Host aliases and per-host options don't apply, so enter the real address, port and username. HeadlessOS only looks in `~/.ssh` for key files named `id_*`, and only if you choose **Auto-Detect**.

### Can I connect through a jump host?

Not directly. You can use an SSH tunnel instead. This forwards local port 2222 to an internal server, through a jump host:

```bash
ssh -N -L 2222:192.168.1.20:22 pi@example.com
```

Then add a server with Host `127.0.0.1` and Port `2222`.

### Does it support two-factor login?

No. HeadlessOS doesn't do keyboard-interactive logins, so it can't answer a prompt for a code.

### Does it check the server's host key?

No. It doesn't read `known_hosts`, and it doesn't show you a fingerprint. It accepts the key the server presents, so on a network you don't trust, connect through a VPN or a tunnel.

### Can I connect to several servers at once?

Yes. Each server is its own session. See [Sessions and Fleet](/docs/guides/sessions-and-fleet).

## Privacy and security

### What leaves my computer?

- **SSH traffic** to your servers.
- **Weather requests**, if you set a city on the Home hub. The city name you type and the chosen city's coordinates go to Open-Meteo.
- **AI requests**, if you choose a provider. Prompts and redacted command output go to `api.openai.com`, `api.anthropic.com` or your Ollama server.

The app has no telemetry and doesn't check for updates. Links such as **Help → Documentation** open in your browser.

### Where does it keep my data?

Your servers, credentials and history stay on your computer, in `~/.headlessos/`:

| What | Where |
| --- | --- |
| Servers and credentials | `servers.json` |
| AI provider keys | `llm.json` |
| Agent actions and your answers | `audit/actions.jsonl` |
| App log | `logs/headlessos.log` |
| Traces and sessions | `observatory/`, `sessions/` |

### How are my passwords and keys stored?

SSH passwords and AI provider keys are encrypted with AES-256-GCM. Anyone who can run code as your user could still reach them, because the encryption key is on the same computer.

SSH private keys, and any passphrase you typed in the Add Server form, are encrypted the same way. See [Connect with an SSH key](/docs/connect-a-server#connect-with-an-ssh-key).

### Can an AI agent change my server without asking?

No. Agents pick typed actions from a fixed list and never send shell text. An action that changes a server waits for your approval, and is written to the audit log. See [Safety and approvals](/docs/ai/safety).

## Install and update

### Why does my computer warn me about the app?

The builds aren't code-signed. [Installation](/docs/installation) shows how to get past the warning on each system. Download them only from the [download page](/download) or the project's GitHub releases.

### How do I update?

Download the new version and install it over the old one. The app doesn't update itself. See [Update HeadlessOS](/docs/installation#update-headlessos).

### How do I move to a new computer?

Install the app there and add your servers again. Saved passwords and API keys don't move, because their encryption key depends on this install and this computer.

### Where can I get help?

Start with [Troubleshooting](/docs/troubleshooting). To report a bug or ask for a feature, open an [issue on GitHub](https://github.com/abhee235/headlessos/issues). To help build it, see [Contribute](/docs/contributing).
