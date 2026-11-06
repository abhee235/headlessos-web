---
title: Contributing
description: How to set up HeadlessOS for development, run it, run the tests and typechecks, and propose a change through a pull request.
---

Bug reports, parsers, fixes and docs are all welcome. HeadlessOS is MIT licensed, and by contributing you agree to license your work the same way.

[`AGENTS.md`](https://github.com/abhee235/headlessos/blob/main/AGENTS.md) in the repository has the full rules for code, security and the UI.

## Set up

You need Node.js 20 or later and npm 9 or later. Docker is optional and gives you a test server.

Fork the [repository](https://github.com/abhee235/headlessos), then:

```bash
git clone https://github.com/<your-user>/headlessos.git
cd headlessos
npm install                        # also installs the commit-message hook
cp .env.example .env               # needed even without a key
npm run build --workspace=shared   # once, before the first typecheck
```

`.env` lives at the repository root. The dev server loads it with `--env-file`, and Node stops if the file is missing.

## Run it

```bash
npm run dev    # backend on :3001, app on http://localhost:3000
```

For a server to connect to, start the test container:

```bash
cd dev && docker compose up -d
```

It serves SSH on `127.0.0.1:2222`, with user `testuser` and password `testpass`. On macOS you can use `dev/vm.sh start` instead, which runs a Lima VM.

You don't need an LLM key. Parsing still works with the deterministic parsers. To run the UI Agent on scripted replies, set `LLM_PROVIDER=fake` in `.env`. It only takes effect when no provider is set up.

To try the desktop app, run `npm install` once in `electron/`, then:

```bash
npm run test:prod          # build the client, bundle the server, launch Electron
npm run build:dist:win     # package it; also build:dist:mac and build:dist:linux
```

## Project layout

| Folder | Holds |
| --- | --- |
| `server/` | Fastify backend in TypeScript |
| `client/` | React and Vite frontend |
| `shared/` | Types and Zod schemas used by both |
| `electron/` | Desktop app, with its own install |
| `dev/` | Local test server |
| `docs/` | Phase specs, decisions, task tracker |

See [Architecture](/docs/concepts/architecture).

## Test and typecheck

```bash
npm test                 # server suite, then client suite
npm run test:server      # one suite on its own
npm run test:client

cd server && npx vitest run tests/config/session-store.test.ts -t "permissions"
```

`npm test` joins the suites with `&&`, so a server failure skips the client suite.

Vitest strips types without checking them, so run the typechecks too:

```bash
npx tsc --noEmit -p server
npx tsc --noEmit -p client
```

These fail with TS6305 until you have built `shared` once. No linter or formatter is set up.

:::note
On Windows, `session-store.test.ts > saved file has 0o600 permissions` fails, because Windows has no POSIX mode bits.
:::

## Propose a change

The project is documentation-first:

1. **Start with an issue.** Open one in the [issue tracker](https://github.com/abhee235/headlessos/issues), even for a small fix. We'll find or add its task.
2. **Spec first.** A change starts in a phase doc in `docs/phases/`, with a task ID and a row in `docs/PROGRESS.md`.
3. **Decisions.** An architectural decision gets an entry in `docs/DECISIONS.md` before the code.
4. **Code and tests.** Every change has tests.
5. **The record.** Add an "as built" section to the phase doc, update the `docs/PROGRESS.md` row, and add an entry to `docs/TRACEABILITY.md`.

## Commit format

A hook checks the first line of each commit message:

```text
<type>(<task-id>): <description>
```

- **Types:** `feat`, `fix`, `refactor`, `docs`, `test`, `chore`.
- **Task ID:** one per commit, as listed in `docs/PROGRESS.md`. The hook accepts forms like `M<number>.<number>` and `EX<number>.<number>`.

Merge commits are exempt.

## Before you open a pull request

Run what CI runs: the two typechecks and both test suites. CI uses Node 20 on Ubuntu and runs `npm ci` first. It runs on every pull request and on pushes to `main`.

For a UI change, say what you checked in the browser and how, including sizes, spacing, and light and dark themes.

## Rules reviews hold to

- **TypeScript.** Strict mode, no `any` unless it can't be avoided, and async/await.
- **Boundaries.** Data that crosses a boundary has a Zod schema.
- **Frontend.** Functional React components, Zustand for state, Tailwind for styles.
- **Shell commands.** Never put user input or model output into a shell command. Agents call typed actions, and the runner builds and quotes the command.
- **Server output** is data, never HTML. React renders it, and terminals go through xterm.js.
- **Secrets** never go into code, tests, docs or commits. Use obvious fakes in tests.

To report a vulnerability, follow [Security model](/docs/concepts/security#report-a-vulnerability). Please don't open a public issue.

## Where to add things

| Adding | What it takes |
| --- | --- |
| A parser | See [Add a parser](/docs/concepts/parsing#add-a-parser) |
| A capability that touches a server for agents | A new action in `server/src/agent/actions/catalog/`, plus a row in `server/tests/agent/actions/catalog.test.ts` |
| A desktop app | An entry in `client/src/lib/apps.ts`, a case in `WindowManager.tsx`, and a route plugin registered in `server/src/index.ts` |
| A per-server route prefix | Also add it to `dataRoutePattern` in `server/src/index.ts`, so auto-reconnect covers it |

A good first change is a deterministic parser for a Linux command that doesn't have one yet.
