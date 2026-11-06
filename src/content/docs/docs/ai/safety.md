---
title: AI safety and privacy
description: How HeadlessOS keeps AI agents safe with typed actions, approvals, an audit log and secret redaction, and exactly what reaches a model provider.
---

A model can be wrong, and text on your server can try to mislead it. So HeadlessOS limits what the agents can do, whatever a model replies. For the app as a whole, see [Security](/docs/concepts/security).

## Typed actions, not shell commands

Agents never send command text. They choose from a fixed catalog of actions built into the app, such as `disk_usage` or `service_restart`, and fill in typed parameters.

HeadlessOS checks the parameters, then builds, quotes and runs the command. Inside an agent run, it refuses any command that step didn't build.

File-reading actions work only under a short list of folders. They refuse files that often hold secrets, such as `.env`, `.ssh` folders, private keys and `/etc/shadow`.

## Approvals for changes

Every action is either read or change. Read actions run at once. A change action waits for you:

- **AI Agent:** a run can propose changes only if you turned on **Allow changes (asks first)**.
- **UI Agent:** a run only reads. A change can come only from a button you click in a view.

The approval card shows the exact command, the server, the login user and a reason. You choose **Allow once** or **Deny**. There is no "always allow". Stopping a run, or 10 minutes without an answer, counts as deny.

## Audit log

Every change that asks for approval is recorded in `~/.headlessos/audit/actions.jsonl` on your computer, as JSON lines:

- `asked`: the command and the reason
- `answered`: the decision, and whether it came from you, a stop or a timeout
- `ran`: the exit code and how long it took

```bash
tail -n 20 ~/.headlessos/audit/actions.jsonl
```

The app only adds lines, and past 10 MB it starts a new file. There is no viewer in the app, and a plain file isn't tamper-proof. Read actions aren't logged here. The [LLM Observatory](/docs/ai/observatory) shows those.

## Secrets removed from output

Before an action's output reaches the model or your step view, HeadlessOS removes values that match common secret formats:

- private key blocks and password hashes
- passwords in connection strings, bearer tokens and JSON Web Tokens
- AWS, GitHub, GitLab and Slack keys, and keys starting with `sk-`
- values after names such as `password`, `secret`, `token` or `api_key`

This is pattern matching, not a guarantee. A secret in an unusual format, or under a name like `DB_PASS`, gets through.

## Server output is treated as data

A log line could hold text written to trick a model. Action output reaches the model marked as server data, and the agents' instructions say never to follow it. That lowers the risk, but a model can still be misled, so read each approval card.

## What reaches the model provider

| Data | Sent to the model? |
| --- | --- |
| Your request, the app's instructions and the action list | Yes |
| Action output, redacted and cut to size | Yes. It can hold host names, IP addresses, user names, paths and log lines |
| The view, on a follow-up (as an outline) or a review pass | Yes |
| Command output no parser could read | Yes, with colour codes and secrets removed |
| SSH passwords and private keys | No |
| Terminal sessions and files you open in File Explorer | No |
| Audit log, traces, saved apps and sessions | No |

Where it goes depends on your provider:

- **OpenAI:** `api.openai.com`
- **Anthropic:** `api.anthropic.com`, with prompt caching that lasts five minutes
- **Ollama on this computer:** nothing leaves your machine
- **Ollama on another machine:** that machine, after you turn on the switch for it

A hosted provider's own terms decide how it stores what it receives. A local Ollama model keeps everything on hardware you control.

## No telemetry

The app has no analytics, crash reporting or usage tracking. With no provider chosen, its only traffic is SSH to your servers and the Home hub's weather: the city name you type and the chosen city's coordinates go to Open-Meteo.

## Limits

- Actions run as your SSH login user, with that user's access.
- Widgets in a generated view can carry a command that refreshes their data. It runs on a timer, outside the catalog, so it can only read. Anything that would change a server, or write to a file, is refused.
- The agent's reason on a card can be wrong. Check the command yourself.
