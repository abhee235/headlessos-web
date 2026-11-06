---
title: Connect a server
description: Add a Linux server to HeadlessOS with a password, SSH key or SSH agent. See what a server needs, and how to reconnect or remove one.
---

You add a server once, then sign in to it from the **Sessions** tab of the Control Center.

## Before you start

Check that you can log in from a terminal on the same computer:

```bash
ssh pi@192.168.1.20
```

Note the address, port and username that worked. HeadlessOS doesn't read `~/.ssh/config`, so enter the real values, not a host alias.

## What your server needs

Any Linux server with SSH can connect. Some apps use more:

| App | Needs on the server |
| --- | --- |
| Terminal | Nothing extra |
| Dashboard, Task Manager | Standard Linux tools such as `df`, `free`, `ip` and `ps` |
| File Explorer | SFTP, which is on by default on most servers |
| Docker | `docker`, run as root or a member of the `docker` group. If it's missing, the app offers **Install Docker** |
| Services | `systemctl`. Without systemd, it reads `service --status-all` instead |
| Server Admin | Standard Linux tools. **Packages** needs `apt`, **Firewall** needs `ufw`, **Web server** needs `nginx` |

Many actions, such as stopping a service or adding a firewall rule, run through `sudo`, and HeadlessOS can't type a sudo password for you. For those, sign in as `root` or use passwordless sudo. In the [Terminal](/docs/apps/terminal) app, `sudo` works as usual.

## Add the server

1. On the **Sessions** tab, click **Add Server**. From the desktop, press Ctrl+Shift+Space (Cmd+Shift+Space on a Mac) to get back there.
2. Fill in the form:

   | Field | What to enter |
   | --- | --- |
   | Display Name | Any name, such as Home Pi |
   | Host | An IP address or hostname, such as `192.168.1.20` or `example.com` |
   | Port | The SSH port. It starts at `22` |
   | Username | The login user. It starts at `root` |
   | Authentication | **Password**, **SSH Key** or **Agent**, as described below |

3. Click **Add Server**.

The server appears as a tile. Adding it doesn't connect or test anything.

## Connect with a password

Choose **Password** and type it. HeadlessOS encrypts the password and saves it on this computer, so it can reconnect for you.

You can also leave the field empty and type the password each time you sign in. It's then not saved, and HeadlessOS can't reconnect on its own.

## Connect with an SSH key

Choose **SSH Key**, then a **Key Source**:

- **Auto-Detect** looks in `~/.ssh` on this computer for private keys named `id_*`. It selects the first one. Use **Detected Keys (~/.ssh)** to pick another.
- **Upload File** lets you choose a private key file from anywhere.
- **Paste Key** takes the text of the key, including the `-----BEGIN` line.

If the key has a passphrase, type it in **Passphrase (optional)**, or leave that empty and type it at each sign-in.

The server must already have the matching public key. To add it from your computer:

```bash
ssh-copy-id pi@192.168.1.20
```

:::caution
HeadlessOS saves the text of the key in `~/.headlessos/servers.json`, along with any passphrase you typed in the form. Both are encrypted like a password, and they stay in the app's backend. If you'd rather not save a key at all, use **Agent**.
:::

## Connect with an SSH agent

Choose **Agent** and enter nothing else. The form shows "Will use your local SSH agent (SSH_AUTH_SOCK)".

The agent must be running with your key loaded, and `SSH_AUTH_SOCK` must be set where the app starts. It usually isn't on Windows, so use **Password** or **SSH Key** there. On macOS or Linux, try starting the app from a terminal where `ssh-add -l` lists your key.

## Sign in

Click the server's tile. Type the password or key passphrase if you didn't save it, then press Enter or click the arrow. With **Agent**, click **Sign in**.

A wrong password fails straight away. A network problem can take close to a minute, because HeadlessOS tries up to four times. Either way, the screen shows the reason. See [Troubleshooting](/docs/troubleshooting#a-server-wont-connect).

On a Mac, a server on your local network also needs [local network access](/docs/troubleshooting#local-network-access-on-macos).

## If the connection drops

When an app needs data and the connection has gone, HeadlessOS reconnects with your saved credentials. If that can't work, the app shows **Server disconnected**. Click **Reconnect**, or **Back to login** to sign in again.

## Change or remove a server

There is no edit form. To change a server's details, remove it and add it again.

On the **Sessions** tab, hover over the tile and click the red button, or right-click the tile and choose **Remove server…**. Then click **Remove**. Nothing changes on the server itself.

## Next steps

- [The desktop](/docs/guides/desktop): find your way around.
- [Sessions and Fleet](/docs/guides/sessions-and-fleet): add more servers and switch between them.
