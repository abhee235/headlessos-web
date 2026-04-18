---
title: Terminal
description: A real interactive shell, in your browser, over WebSocket.
---

A full-fidelity terminal powered by [xterm.js](https://xtermjs.org) — the same library VS Code uses.

## How it works

The frontend opens a WebSocket to the backend, which allocates a real PTY on the remote server using SSH's `shell()` channel. Bytes flow both ways with no transformation. Color, cursor positioning, alt-screen apps (vim, htop, tmux) — everything works.

## Features

- **Persistent sessions** — switch tabs and the shell keeps running.
- **Resize handling** — we send `SIGWINCH` to the PTY when the window resizes.
- **Configurable** — font size, cursor style, scrollback length.
- **Copy-paste** — works as you'd expect with `Cmd/Ctrl+C` and `Cmd/Ctrl+V`.

## Single instance per server

The terminal is a "single-instance" tab. Opening it twice for the same server reuses the existing session.
