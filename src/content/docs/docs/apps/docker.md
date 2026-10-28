---
title: Docker
description: Manage containers, images, volumes, and networks visually — without Docker Desktop.
---

The Docker app gives you a Portainer-style view of any server running the Docker Engine, without needing Docker Desktop or installing an agent.

## Sections

- **Containers** — list, start/stop/restart, view logs, exec into a shell, remove.
- **Images** — list, pull new, remove, prune unused.
- **Volumes** — list, create, remove.
- **Networks** — list, inspect, create, remove.
- **System** — disk usage breakdown (`docker system df`).

## How it works

All Docker data is fetched by running standard `docker` CLI commands over SSH and parsing the output:

- `docker ps --format ...` for containers
- `docker images --format ...` for images
- `docker volume ls`, `docker network ls`, etc.

We use `--format` with a controlled template so output is easy to parse deterministically.

## Requirements

- Docker Engine installed on the remote server.
- Your SSH user must be in the `docker` group (or you must connect as root).
