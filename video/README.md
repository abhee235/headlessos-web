# HeadlessOS launch video

A 57-second motion graphics video of HeadlessOS, made with [Remotion](https://www.remotion.dev): React
components rendered frame by frame into an MP4. It is its own npm project, separate from the website.

## Commands

```console
npm i                    # once
npm run dev              # Remotion Studio at http://localhost:3600: preview, scrub, edit timings
npm run render           # out/headlessos-launch.mp4: 1920x1080, 30 fps, H.264, for YouTube and social
npm run render:readme    # out/headlessos-launch-readme.mp4: 1280x720, small enough for a GitHub README
```

GitHub plays a video in a README only when it is uploaded through github.com (drag it into the editor),
and only up to 10 MB on a free account. That is what the README cut is for.

## The scenes

| Scene | File | What it shows |
| --- | --- | --- |
| 1 | `src/scenes/WallOfText.tsx` | "Stop reading output." over terminal output that speeds up, then collapses to a point |
| 2 | `src/scenes/LogoReveal.tsx` | The mark draws itself, the wordmark opens: "Look at your server." |
| 3 | `src/scenes/DesktopFor.tsx` | "A desktop for your VPS / cloud server / home lab / Raspberry Pi." beside the Home hub |
| 4 | `src/scenes/AppsTour.tsx` | A camera flight over six app windows, one line each, then all of them at once |
| 5 | `src/scenes/HowItWorks.tsx` | Your computer, SSH, your server: nothing installed |
| 6 | `src/scenes/AskAI.tsx` | The website's AI example, step by step, ending on Approve |
| 7 | `src/scenes/Facts.tsx` | Free and open source, no account, three platforms, AI optional |
| 8 | `src/scenes/Outro.tsx` | "Give every server a desktop." and headlessos.com |

`src/Launch.tsx` strings them together; each is also its own composition in Studio, under Scenes.

## What it is made of

- **Backgrounds** are the app's own wallpapers (`public/wallpapers/`, copied from the app repo's
  `server/assets/wallpapers/system/`), one per chapter: Graphite, Bloom, Celestial, Ocean, Amethyst, Mesh,
  Golden Hour.
- **Screens** are the website's screenshots (`public/screens/`, from `src/assets/screens/`), captured from
  a demo server. Everything in the video follows the website's rule: never a real hostname, address or
  user name. The terminal output in scene 1 uses `web-01.example.com` and `192.0.2.24`.
- **Words** come from the website and the docs, so the video claims nothing the site doesn't.
- **Type** is the website's: Manrope, Geist for the wordmark, Geist Mono for code, loaded from Google
  Fonts at render time.

## Remotion's license

Remotion is free for individuals and for companies of up to three people. A larger company needs a
[company license](https://www.remotion.pro/license).
