---
title: Installation
description: Install HeadlessOS on Windows, macOS or Linux, get past first-launch warnings, run it from source, and update or uninstall it.
---

HeadlessOS runs on your computer, not on your server. You can install the desktop app, or run it from source in a browser. Your server needs nothing beyond SSH, though some apps use tools you may already have. See [what your server needs](/docs/connect-a-server#what-your-server-needs).

## Download the desktop app

Get the latest version from the [download page](/download). These are the files for version 0.2.1:

| System | File | Notes |
| --- | --- | --- |
| Windows | `HeadlessOS Setup 0.2.1.exe` | Installer |
| Windows | `HeadlessOS 0.2.1.exe` | Portable, no install needed |
| macOS | `HeadlessOS-0.2.1-universal.dmg` | Apple silicon and Intel |
| macOS | `HeadlessOS-0.2.1-universal-mac.zip` | Apple silicon and Intel |
| Linux | `HeadlessOS-0.2.1.AppImage` | Most distributions |
| Linux | `headlessos-desktop_0.2.1_amd64.deb` | Debian and Ubuntu |

You need 64-bit Windows 10 or 11, macOS 11 or later, or a 64-bit Linux desktop.

The builds are unsigned, so Windows and macOS warn you on first launch. Download them only from the download page or the project's [GitHub releases](https://github.com/abhee235/headlessos/releases).

### Install on Windows

1. Run the installer, or run the portable `.exe`.
2. If SmartScreen shows "Windows protected your PC", choose **More info**, then **Run anyway**.

### Install on macOS

1. Open the `.dmg` and drag HeadlessOS to Applications, or unzip the `.zip` and move the app there.
2. Open the app once. macOS blocks it.
3. Go to **System Settings → Privacy & Security** and choose **Open Anyway**.

If macOS says the app is damaged, run this in Terminal and open it again:

```bash
xattr -cr /Applications/HeadlessOS.app
```

To reach a device on your local network, the app also needs [local network access](/docs/troubleshooting#local-network-access-on-macos).

### Install on Linux

Make the AppImage executable and run it:

```bash
chmod +x HeadlessOS-0.2.1.AppImage
./HeadlessOS-0.2.1.AppImage
```

Or install the `.deb` with your package manager:

```bash
sudo apt install ./headlessos-desktop_0.2.1_amd64.deb
```

## Run from source

This runs the same app in your browser at localhost. You need Git, Node.js 20 or later and npm 9 or later.

```bash
git clone https://github.com/abhee235/headlessos.git
cd headlessos
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `npm run dev` starts the backend on port 3001 and the web app on port 3000.

- **Clone with Git.** Don't use a ZIP download: `npm install` runs a `git config` step that needs a Git checkout.
- **Keep the `.env` file.** `npm run dev` won't start without it. It lives in the repository root. In Windows Command Prompt, use `copy .env.example .env`.
- **An API key is optional.** You can leave the placeholder in `.env` and add a key later in **Settings → AI / LLM**.
- **Logs go to your terminal.** The browser version has no log file and no **Open log** button.

## Build the desktop app yourself

From the repository root:

```bash
npm install
npm run build --workspace=shared
npm run build:dist:win
```

Use `build:dist:mac` or `build:dist:linux` for the other systems. The files appear in `electron/dist/`.

## Update HeadlessOS

The app doesn't update itself. Download the new version from the [download page](/download) and install it over the old one, or replace the portable file or AppImage. Your saved servers stay, because they're kept in your home folder, not with the app.

The [changelog](/docs/changelog) lists what changed in each version.

## Uninstall HeadlessOS

| System | How |
| --- | --- |
| Windows | Remove it in Windows Settings, or delete the portable `.exe` |
| macOS | Delete HeadlessOS from Applications |
| Linux | Delete the AppImage, or run `sudo apt remove headlessos-desktop` |

Uninstalling leaves your data in `~/.headlessos/`, which is `C:\Users\<you>\.headlessos` on Windows. Delete that folder to remove your saved servers, passwords, API keys, traces and logs. Your servers aren't affected.
