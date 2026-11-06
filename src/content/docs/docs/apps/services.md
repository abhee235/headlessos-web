---
title: Services
description: Start, stop, restart, enable and disable systemd services on a Linux server from HeadlessOS, and read each service's status and journal logs.
---

The Services app lists the systemd services on your server and lets you control them. systemd is the program that starts and manages background services on most Linux servers. The app needs `systemctl` on the server.

Open it from the launcher, or right-click the desktop and choose **Services**.

## Find a service

Each row shows the service name, its **State**, its **Sub-state** and a description.

- Use **All**, **Active**, **Inactive** and **Failed** to filter by state. Each shows a count.
- Type in **Filter…** to search names and descriptions.

The list refreshes with your **Auto-Refresh Interval** from [Settings](/docs/guides/settings), at most every 10 seconds. It pauses while a menu is open.

## Start, stop or restart a service

Right-click a service. Actions run as soon as you click them.

| Action | When it shows | What it does |
|---|---|---|
| **Stop**, **Restart** | The service is active | Runs `sudo systemctl stop` or `restart` |
| **Start** | The service isn't active | Runs `sudo systemctl start` |
| **Enable** | Always | Starts the service at boot |
| **Disable** | Always | Stops it starting at boot |

:::caution
Your SSH user must be root or able to run `sudo` without a password, because there's nowhere to type one.

There's no confirmation here. Stopping `ssh` can cut the connection HeadlessOS uses, and you may not be able to reconnect until it's started on the server itself.
:::

For a confirmation step, use the **Services** page in [Task Manager](/docs/apps/task-manager). It asks first and warns you about `ssh`.

## Read a service's status and logs

Right-click a service and choose:

- **View Status** for the output of `systemctl status`.
- **View Logs** for its last 150 journal lines from `journalctl`.

The output opens in a panel below the list. It doesn't update by itself, so choose the action again for fresh output. Close it with the **X** button.

## Servers without systemd

Without systemd, this app shows **systemd not available**. Open the **Services** page in [Task Manager](/docs/apps/task-manager) instead. It falls back to the older `service` command on servers that use SysV init scripts.
