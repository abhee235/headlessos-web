---
title: Server Admin
description: A unified UI for users, groups, firewall, services, packages, logs, network, and cron.
---

Eight sections covering the things you'd normally SSH in to manage by hand.

## Sections

- **Users** — list, create, modify, delete (`getent passwd`, `useradd`, etc.)
- **Groups** — list, modify membership.
- **Firewall** — view rules for `ufw`, `firewalld`, or raw `iptables`.
- **Services** — `systemctl` status, start/stop/restart, view journal logs.
- **Packages** — installed packages, available updates (apt/dnf/pacman/apk).
- **Logs** — tail and search journald + common log files.
- **Network** — interfaces, IPs, routes, DNS config.
- **Cron** — view and edit user crontabs.

## Distro support

Each section uses deterministic parsers when possible, with the LLM as a fallback for distro-specific output formats. Tested against:

- Ubuntu 22.04 / 24.04
- Debian 12
- Fedora 40+
- Alpine 3.19+
- Arch (rolling)

Found an unsupported distro? Open an issue with sample output.
