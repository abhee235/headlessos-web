---
title: Troubleshooting
description: Fix HeadlessOS problems. Find the log, and solve backend errors, first-launch blocks, failed SSH connections and macOS local network access.
---

Search this page for the exact message you see. If nothing fits, the log usually says why.

## Find the log

The desktop app writes its log to `~/.headlessos/logs/headlessos.log` on your computer. On Windows that's `C:\Users\<you>\.headlessos\logs\headlessos.log`. When the file reaches 5 MB, it becomes `headlessos.1.log` and a new one starts.

| Where you are | How to open it |
| --- | --- |
| Sign-in screen, no server needed | **Global Settings → Open log** |
| Desktop | **Settings → About → Open log** |
| macOS menu bar | **Help → Open Logs** |
| Backend-stopped dialog | **Open Log** |

Each of these shows the file in Explorer, Finder or your file manager.

Running from source, there is no log file. The same output goes to the terminal running `npm run dev`.

For errors in the window itself, open DevTools. Press Ctrl+Shift+I on Windows, or choose **View → Toggle Developer Tools** on macOS.

:::caution
Secrets, your computer's name and your home path are masked, and nothing is sent anywhere. The log can still name your servers and file paths, so read it before you paste it into an issue.
:::

:::note
**Server Admin → Logs** shows your server's logs, not the app's.
:::

## Backend errors

The backend is the part of HeadlessOS that holds your SSH connections. It runs on your computer, so these errors aren't about your server.

### "HeadlessOS can't reach its own backend"

The full message is:

> HeadlessOS can't reach its own backend, so nothing was sent to your server. Restart the app. If it keeps happening, open the log from Global Settings.

The window got no answer from the backend, and your server wasn't touched. Quit and reopen the app. If it happens again, [report it](#report-a-bug) with the last lines of the log.

Running from source, the message is:

> HeadlessOS can't reach its backend, so nothing was sent to your server. Check that the server from npm run dev is running.

Check the terminal running `npm run dev`, and start it again if it stopped. If it stops with `.env: not found`, run `cp .env.example .env` in the repository root.

### "Couldn't load your saved servers. Retrying…"

The **Sessions** tab shows this when the backend doesn't answer. Your servers aren't lost. The app tries again every 3 seconds, and you can click **Retry**. If the message stays, restart the app.

### "The HeadlessOS backend stopped."

This dialog, titled "HeadlessOS — Backend Stopped", means the backend quit while the app was running. It has three buttons:

- **Restart** starts the backend and reloads the window. Sign in to your server again.
- **Open Log** shows the log and leaves the dialog open.
- **Quit** closes the app.

If it keeps happening, [report it](#report-a-bug) with the log.

### "The backend server could not start"

This dialog, titled "HeadlessOS — Server Error", appears at startup. It gives a reason, such as "Server failed to start within 20 seconds", and the path to the log. The app then quits. Open the log at that path and [report it](#report-a-bug).

### "The app UI could not be loaded."

This dialog, titled "HeadlessOS — Failed to Load", means the app's own files are missing or damaged. Reinstall the app.

## The app won't open the first time

The builds are unsigned, so Windows and macOS stop them on first launch.

### Windows: "Windows protected your PC"

Choose **More info**, then **Run anyway**.

### macOS: the app is blocked

Open the app once, so that macOS blocks it. Then go to **System Settings → Privacy & Security** and choose **Open Anyway**.

### macOS: the app "is damaged"

Run this in Terminal, then open the app again:

```bash
xattr -cr /Applications/HeadlessOS.app
```

### Linux: the AppImage won't start

Make it executable with `chmod +x HeadlessOS-0.2.1.AppImage`, then run it. On Debian or Ubuntu, you can install the `.deb` instead.

## A server won't connect

### What the error means

The sign-in screen shows why the connection failed. A wrong password fails straight away. A network problem can take close to a minute, because HeadlessOS tries up to four times first.

| What you see | What it means | Go to |
| --- | --- | --- |
| `The server refused this login` | The server turned down the login | [Login rejected](#login-rejected) |
| `connect ECONNREFUSED` | Nothing is listening on that port | [Connection refused](#connection-refused) |
| `Timed out while waiting for handshake` | No answer within 10 seconds | [Connection timed out](#connection-timed-out) |
| `getaddrinfo ENOTFOUND` | The hostname doesn't resolve | [Host not found](#host-not-found) |
| `connect EHOSTUNREACH` | No route to the host | [Local network access on macOS](#local-network-access-on-macos) |
| `Cannot parse privateKey` | The key can't be read | [SSH key problems](#ssh-key-problems) |

To compare, try the same login from a terminal on the same computer: `ssh -p 22 pi@192.168.1.20`.

If `ssh` works but the app doesn't, compare the host, port and username you used. HeadlessOS doesn't read `~/.ssh/config`, so a host alias won't work.

### Login rejected

The server refused the username, password or key. Check these:

- **Username.** The form starts at `root`, and many servers don't allow root logins.
- **Password.** If you left it out of the form and left the sign-in field empty, no password was sent.
- **Key.** Auto-Detect selects the first key in `~/.ssh`, which may not be the one the server knows.
- **Agent.** `SSH_AUTH_SOCK` must be set where the app starts. See [Connect with an SSH agent](/docs/connect-a-server#connect-with-an-ssh-agent).
- **Server settings.** With `PasswordAuthentication no` in `sshd_config`, password logins fail. HeadlessOS also doesn't do keyboard-interactive logins, so a server that needs one, or a 2FA code, turns it down.
- **fail2ban.** Repeated failed sign-ins can get your address blocked. A ban often looks like a refused or timed-out connection, and `ssh` from the same computer fails too.

### Connection refused

The log says `connect ECONNREFUSED`. The machine answered, but nothing is listening on that port.

- Check the **Port**. To change it, [remove the server and add it again](/docs/connect-a-server#change-or-remove-a-server).
- On the server, check that SSH is running with `systemctl status ssh`. On some distributions the service is called `sshd`.

### Connection timed out

The log says `Timed out while waiting for handshake`. Nothing answered within 10 seconds.

- Check the address. A home server's address can change.
- Check the firewall on the server, and your cloud provider's firewall or security group. Port 22, or your own SSH port, must be open to your address.
- If the server needs a VPN, connect to it first.
- Check whether fail2ban has blocked your address.

### Host not found

The log says `getaddrinfo ENOTFOUND`. Your computer can't turn that hostname into an address. Check the spelling, or use the IP address instead.

### SSH key problems

| Message | What to do |
| --- | --- |
| `Cannot parse privateKey` in the log, with `no passphrase given` | The key has a passphrase. Type it at sign-in |
| `Cannot parse privateKey` in the log, with `Bad passphrase?` | The passphrase is wrong |
| "File does not appear to be a valid SSH private key" | You chose a file that isn't a private key, such as a `.pub` file. A PuTTY `.ppk` file is also refused here |
| "No SSH keys found in ~/.ssh — try uploading or pasting a key" | Your key isn't named `id_*`, or it's in another folder. Use **Upload File** or **Paste Key** |

### Local network access on macOS

Since macOS 15, an app needs your permission to reach a device on your local network. Tools run from Terminal are exempt, so `ssh` can work while HeadlessOS fails. A public server isn't affected.

The log shows `connect EHOSTUNREACH`. If you click **Reconnect** on the **Server disconnected** panel, the error there adds this hint:

> macOS may be keeping HeadlessOS off your local network. Allow it in System Settings → Privacy & Security → Local Network, then try again.

To allow it:

1. Open **System Settings → Privacy & Security → Local Network**.
2. Turn on HeadlessOS.
3. Sign in again.

The hint says "may" because a device that's switched off gives the same error, so check that it's on too. If HeadlessOS isn't in the list, or turning it on doesn't help, [report it](#report-a-bug). Running [from source](/docs/installation#run-from-source) in Terminal avoids the permission, since tools run from Terminal are exempt.

### "Server disconnected"

Apps show this when the SSH connection has gone, for example after a server restart or a network drop. Click **Reconnect**, which shows the real error if it fails. It needs saved credentials, so if you typed your password at sign-in, click **Back to login** instead.

## An app says something is missing

### "Docker is not installed"

Click **Install Docker** to run the official script from `get.docker.com` on the server. This needs sudo. You can follow it, and type your sudo password, in the terminal panel that opens.

### Docker shows a permission error

HeadlessOS runs `docker` as the user you signed in with. If that user can't reach the Docker socket, add it to the `docker` group, then sign out and in again:

```bash
sudo usermod -aG docker pi
```

### "UFW is not installed", but it is

The same goes for "fail2ban is not installed". HeadlessOS checks for these through `sudo`, and it can't type a sudo password. If `sudo` asks for one, the check comes back empty. Sign in as `root`, or give the user passwordless sudo.

### "apt package manager not found (non-Debian system?)"

**Server Admin → Packages** uses `apt`, so it works only on Debian, Ubuntu and similar systems.

## Report a bug

Open an issue at [github.com/abhee235/headlessos/issues](https://github.com/abhee235/headlessos/issues). On macOS, **Help → Report Issue** goes to the same page. Include:

- The version, from **Settings → About** or the file you downloaded.
- Your operating system, and how you run the app: installer, portable, AppImage, `.deb` or source.
- The server's Linux distribution.
- What you did, what you expected and what happened.
- The exact error text.
- The relevant lines of [the log](#find-the-log). Read them first, and replace any server names or paths you want to keep private.

For a security problem, don't open a public issue. Use the repository's **Security** tab and choose **Report a vulnerability**.
