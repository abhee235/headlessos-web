---
title: AI Agent
head:
  - tag: title
    content: "AI agent for Linux server troubleshooting | HeadlessOS Docs"
description: Ask the AI Agent why a server is slow or a disk is full. It runs checks over SSH and answers with evidence. How to use it and what it can't do.
---

The AI Agent investigates a question about one server. It runs checks over SSH, reads the results and writes a diagnosis with the evidence it found. Its window is titled **AI Investigation Agent**.

You need a provider first. See [Set up AI](/docs/ai/setup).

## Ask a question

1. Connect to a server and open **AI Agent** from its desktop icon, the Start Menu or the Command Palette (Ctrl+K).
2. Type a question and press Enter, or pick a tile under **Quick investigations**, such as **Why is disk full?**, **Slow server** or **Service down?**.
3. Watch **Investigation Steps** fill in. Open a step to see the exact command and its output.
4. Read the answer under **Diagnosis**, with the steps, time and tokens used.

Specific questions work best. "Why did nginx stop this morning?" gives the agent more to go on than "check the server".

To end a run early, click the stop button. The run stops after the current step.

Each question is a new run. The agent doesn't remember earlier ones, so include any detail it needs.

## What the AI Agent can do

By default a run is read-only. The agent chooses from a fixed list of [actions](/docs/ai/safety#typed-actions-not-shell-commands), which cover:

- system facts, CPU, memory, disks and processes
- network interfaces, ports, DNS, ping and HTTP checks
- services, service logs and the system journal
- Docker containers, images, logs and disk use
- packages, nginx, TLS certificates, fail2ban, users and cron
- files and folders under `/etc`, `/var/log`, `/home`, `/root`, `/opt`, `/srv`, `/var/www`, `/tmp` and `/usr/share/doc`

A run has up to 10 turns, and one turn can run several actions. When turns run out, the agent gives its best answer from what it has, and the result shows **Max Steps**.

### Let the agent make changes

Turn on **Allow changes (asks first)** before you start a run. The agent can then propose these changes:

- start, stop, restart or reload a service
- start, stop or restart a Docker container
- reload nginx
- send a signal to a process owned by the login user
- install one package with `apt-get`, or refresh the package lists

Each change pauses the run and shows an **Allow this change?** card with the exact command, the server, the user it runs as and the agent's reason. Choose **Allow once** (Enter) or **Deny** (Esc). There is no "always allow".

If you deny a change, the agent is told not to retry it and explains what it would have done. If nobody answers within 10 minutes, the change isn't made. Stopping the run denies anything still waiting.

## What the AI Agent can't do

- Run a command of its own. It can only choose actions from the list.
- Edit or delete files, reboot the server, or manage users and firewall rules.
- Read files that often hold secrets, such as `.env`, `/etc/shadow`, `.ssh` folders and private keys.
- Enter a sudo password. Actions that need sudo use `sudo -n`, so they fail if the login user has to type a password.
- Work across several servers in one run.

## The AI Agent can be wrong

It's an AI. It can misread output, miss the real cause or sound sure about a guess, and small local models make more mistakes. Treat the diagnosis as a lead. Read the steps, and check important findings yourself in the [Terminal](/docs/apps/terminal) before you act on them.

To see each model call and action of a run, open the [LLM Observatory](/docs/ai/observatory). To see how the limits above are enforced, read [AI safety and privacy](/docs/ai/safety).
