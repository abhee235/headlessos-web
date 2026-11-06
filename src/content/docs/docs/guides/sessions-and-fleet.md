---
title: Sessions and Fleet
description: Run one HeadlessOS session per Linux server. Switch between them, hibernate and wake, use Control Center and Fleet, and export or import a session.
---

Each saved server has its own session: its windows, their layout and its file clipboard. Windows from one session stay hidden while you work in another. Layouts are saved on your computer in `~/.headlessos/sessions/`.

## Switch between servers

Move the pointer to the top edge of the screen to reveal the session bar. Each tile shows a server's name, status and window count. Click a tile to switch. Click the pin to keep the bar visible. A thin coloured strip at the top marks the active session.

You can also press Ctrl+1 to Ctrl+9, or Ctrl+Tab and Ctrl+Shift+Tab. Sessions you leave stay connected in the background.

To move a window to another live session, right-click its title bar and choose **Move to session**.

## Hibernate a session

Hibernating saves the layout, closes the SSH connection and clears the windows. Use it for servers you aren't working on. Press Ctrl+Shift+H, or right-click a tile and choose **Hibernate**.

To hibernate idle sessions automatically, set **Auto-Hibernate Inactive Sessions** in [Settings](/docs/guides/settings) under **General**. The active session is never hibernated this way.

To wake a session, click its tile. Your windows come back, and their apps reconnect with your saved credentials. If one can't, it shows **Reconnect**. Terminal windows start a new shell.

Right-click a tile for the other actions:

| Action | What it does |
|---|---|
| **Disconnect** | Closes SSH and keeps the windows |
| **Export Session…** | Saves the session to a file |
| **Lock on hibernate** | Asks you to confirm before waking, which helps protect production servers |
| **Terminate Session…** | Deletes the saved layout and agent history, and keeps the server entry |

## Use Control Center

Control Center has three tabs: **Sessions**, **Fleet** and **Global Settings**. It appears after the lock screen when you start the app. To open it from the desktop, press Ctrl+Shift+Space or click **+** on the session bar.

**Sessions** shows a round icon for each server. Click a connected server to return to its desktop, or a disconnected one to sign in. **Add Server** adds another, as described in [Connect a server](/docs/connect-a-server). To remove one, right-click it and choose **Remove server…**. This only makes HeadlessOS forget it.

## Watch all servers in the Fleet overview

**Fleet** starts with a summary: **Servers online**, a chip for each server, and dials for CPU, memory and disk across the fleet. Each server then gets a card with:

- A status light, its address, and **Online**, **Connecting**, **Error** or **Offline**.
- Dials for CPU, memory and disk.
- The OS, uptime and latency, or a **Connect** button.

| Light | Meaning |
|---|---|
| Green | Its busiest dial is under 75% |
| Amber | Its busiest dial is at 75% or more |
| Red | Its busiest dial is at 90% or more, or the server has an error |
| Off | Not connected |

Only connected servers report numbers. A CPU dial stays empty until a second reading arrives. The disk dial covers `/` and mounts under `/home` and `/data`.

Click a card to open that server's Dashboard. Fleet refreshes with your **Auto-Refresh Interval**, at most every 30 seconds, or when you click **Refresh**.

## Export and import a session

To export, right-click a tile and choose **Export Session…**. You get a JSON file with the window layout, per-session settings, agent history and file clipboard. It holds no passwords or keys.

To import, open **Global Settings** in Control Center, find **Import session from JSON** and click **Import…**. The session arrives hibernated.

:::caution
A session file is tied to the server entry it came from. If you removed and re-added that server, or you import on another computer, the entry has a new internal ID and the session won't appear.
:::
