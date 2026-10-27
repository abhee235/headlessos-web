---
title: Dashboard
description: At-a-glance system metrics for any connected server.
---

The Dashboard app shows live metrics for the active server — CPU, memory, disk, network, uptime, and container counts — in a clean grid of cards.

## What it shows

- **CPU usage** — percentage utilization, with per-core breakdown on hover.
- **Memory** — used / total, with swap stats.
- **Disk** — usage per filesystem (parsed from `df -h`).
- **Network** — RX/TX rate per interface.
- **Uptime** — current uptime and load averages.
- **Containers** — running container count if Docker is available.

## How it works

Behind the scenes, the dashboard issues a single multi-command execution plan that runs all the queries in parallel over separate SSH `exec()` channels. The orchestrator collects results, parses each, and returns a typed payload.

## Refresh

Auto-refreshes every 30 seconds. The output cache means an unchanged result costs essentially nothing to re-fetch.

## Customization (planned)

Per-server widget selection, alert thresholds, and historical charts are on the roadmap.
