---
title: How Parsing Works
description: The two-stage parsing pipeline — deterministic parsers and LLM fallback.
---

HeadlessOS turns unstructured terminal output into typed JSON. Here's how.

## The pipeline

Every command's output goes through these stages:

1. **Strip ANSI codes** with `strip-ansi`. The LLM doesn't need to see escape sequences.
2. **Try a deterministic parser** — a regex- or split-based function for known commands like `df -h`, `free -m`, `docker ps`. These run in well under 1ms and cost nothing.
3. **Fall back to an LLM** if no deterministic parser is registered. We use OpenAI Structured Outputs with a Zod schema — the LLM literally cannot return invalid JSON.
4. **Validate with Zod**. `Schema.parse(result)` throws if anything is off.
5. **Cache** the result keyed by the hash of `(serverId, command, rawOutput)`. Identical output is reused.

## Why two stages?

**Speed and cost.** Deterministic parsers are essentially free. The LLM is accurate but takes 1–3 seconds and costs fractions of a cent per call.

**Progressive enhancement.** Adding a new feature? Start with the LLM — it works on day one. As the feature matures, write a deterministic parser and remove the LLM call. The Zod schema stays the same; only the producer changes.

## When the LLM is used

- Brand-new commands that don't have a parser yet.
- Unusual distro variants where regex assumptions break (e.g., `df` on Alpine vs Ubuntu).
- Commands with highly variable output that's hard to capture in regex.

## When the LLM is not used

- Standard commands with mature parsers: `df`, `free`, `docker ps`, `systemctl`, `ps aux`, `who`, `last`, `iptables -L`, etc.
- Cached output (no re-parse if the raw text is unchanged).

## Cost tracking

Every LLM call is recorded. You can see token counts, latency, and estimated cost via:

```
GET /api/stats/llm
```

Returns a breakdown by model and command, plus the cache hit rate.

## Want to add a parser?

Open `server/src/parsers/deterministic/` and add a function. Register it in the parser registry. Write tests against fixture files in `server/tests/fixtures/terminal-outputs/`. PRs welcome.
