---
title: LLM Observatory
description: See every model call and action of an AI run in the LLM Observatory, with tokens, latency and estimated cost per run, step and model.
---

The LLM Observatory shows what the agents did: each model call and each action of a run, with tokens, time and estimated cost. A token is a small piece of text, roughly four characters. Hosted providers bill by the token.

Connect to a server and open **LLM Observatory** from the Start Menu or the Command Palette (Ctrl+K). New runs appear as they happen.

## What the Observatory shows

A **trace** is one run, such as one AI Agent question. A **span** is one step inside it.

The bar at the top totals the traces in memory: **Traces**, **Spans**, **Tokens**, **Cost**, **Avg Latency** and the top three **Models**.

Below it, the trace list shows **Name**, **Trigger**, **Spans**, **Tokens**, **Cost**, **Latency** and **Time**. You can filter by trigger, such as `ui-agent` or `investigation-agent` (the AI Agent), and by status: `OK`, `ERROR` or `RUNNING`.

## Read a trace

Click a trace to see its spans as a tree, with timing bars. Each span has a kind:

| Kind | What it is |
| --- | --- |
| `AGENT` | The whole run |
| `CHAIN` | A group of steps, such as planning |
| `LLM` | One model call, with its model, tokens and cost |
| `TOOL` | One action or tool, with its input and output |

Click a span for details, in three tabs: **Inputs / Outputs**, **Attributes** and **JSON**.

On a small local model, the **Attributes** tab helps explain a cut-off run. In an AI Agent trace, each model call shows `contextUsed` and `contextWindow`, which tell you how full the [context window](/docs/ai/setup#context-window-and-small-models) was, and `finishReason`.

## Cost tracking

**Cost** is an estimate: tokens multiplied by a price table built into the app. It doesn't allow for prompt caching or for special rates on very long prompts, and the table can go out of date. Your provider's bill is the real figure.

Local Ollama models show $0.00.

:::caution
Known gaps in version 0.3.2:

- AI Agent runs on Claude show $0.00, because the price table for those traces lacks the current Claude models. UI Agent runs on Claude are priced.
- Parsing calls aren't traced, so a model reading command output that no parser could read isn't counted here.
:::

The totals cover only the traces in memory, so they reset when the app restarts.

## Where traces are stored

The Observatory keeps the latest 200 traces in memory. Each finished trace is also saved as a JSON file in `~/.headlessos/observatory/traces/`. Files are kept for 30 days, up to 10,000 files.

After a restart, the list starts empty, because the app doesn't load saved traces back. The trash button clears the list in memory but leaves the files on disk.

These files hold your requests, action results and model replies. They stay on your computer, but treat them as sensitive. Action results are [redacted](/docs/ai/safety#secrets-removed-from-output) first, which catches common secret formats, not all secrets.
