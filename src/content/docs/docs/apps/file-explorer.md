---
title: File Explorer
description: A Finder-like interface for browsing files on remote Linux servers.
---

Browse, upload, download, rename, and delete files on any connected server — backed by SFTP, no shell commands needed.

## Features

- Tree-style sidebar with quick access to `/`, `/home`, `/etc`, `/var/log`, etc.
- Detail view with name, size, modified date, owner, group, permissions.
- Drag-and-drop upload (multi-file support).
- Download with progress.
- Right-click context menu: Open, Rename, Delete, Copy path, Properties.
- Keyboard navigation.

## Why SFTP, not shell?

File operations go through the SSH SFTP subsystem — never `exec('cat ...')`, `exec('rm ...')`, or similar. This means:

- **Safer.** No shell escaping bugs. No accidental glob expansion.
- **Faster.** SFTP is a binary protocol; no parsing terminal output.
- **More reliable.** Atomic operations where the protocol supports them.

## Limits

- Files larger than ~100 MB stream rather than buffer.
- Hidden directories (e.g., `.git`) are shown by default; toggle in settings.
