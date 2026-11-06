---
title: How parsing works
description: How HeadlessOS turns Linux command output into UI, with an output cache, deterministic parsers, an optional LLM fallback and Zod validation.
---

Linux commands print text for people. HeadlessOS has to turn that text into typed data before it can draw a chart or a table. This page covers the classic apps. Views a model builds take a different route, described in [UI Agent](/docs/ai/ui-agent).

## The pipeline

`server/src/parsers/pipeline.ts` handles a command's raw output like this:

```text
raw output
    |
    v
same output seen recently? ---- yes ---> return cached result
    | no
    v
strip ANSI codes
    |
    v
parser works, Zod accepts? ---- yes ---> cache and return
    | no
    v
provider set up? ---- no ---> error
    | yes
    v
ask the LLM, check with Zod ---> cache and return
```

ANSI codes are the escape sequences terminals use for color and cursor movement.

The orchestrator in `server/src/orchestrator/orchestrator.ts` drives this. It runs the steps of a plan, in parallel where the plan allows, and tries each step's fallback commands in order. The Dashboard, for example, tries `ip -brief addr`, then `ip addr show`, then `ifconfig`.

## Which apps use it

| App | How output becomes data |
| --- | --- |
| Dashboard, Fleet, Task Manager's main view | The pipeline above |
| Services, Server Admin, other Task Manager pages | Parser functions called directly. No LLM. |
| Docker | Commands that print JSON, such as `docker ps -a --format '{{json .}}'` |
| File Explorer | SFTP, which returns structured data |

## The output cache

`server/src/cache/output-cache.ts` keeps parsed results in memory. The key is the server ID, the command and a SHA-256 hash of the raw output. If a poll returns the same output as before, nothing is parsed again and no LLM is called.

Entries last 60 seconds, and the cache holds 500 at most. When it fills, the oldest 10% are dropped. Output that changes on every poll, such as CPU counters, misses the cache.

## Deterministic parsers

A deterministic parser is plain code, usually regular expressions and string splitting. It runs on your computer, costs nothing and gives the same result every time.

```ts
interface DeterministicParser<T> {
  name: string;
  commands: string[]; // the commands this parser handles
  parse(rawOutput: string): T;
}
```

Parsers are registered in the `allParsers` array in `server/src/parsers/deterministic/index.ts`. Lookup works in two steps:

1. An exact match on the command string wins.
2. Otherwise the first registered key that is a prefix of the command is used, so the order of `allParsers` matters.

If a parser throws, or its result fails the schema, the pipeline logs a warning and moves on to the LLM step.

## The LLM fallback

The LLM step runs only when a provider is set up: an OpenAI key, a Claude key or an Ollama model chosen in Settings → AI, or `OPENAI_API_KEY` in `.env` on a source run. Without one, no output goes to a model, and a command with no working parser ends in an error. See [AI setup](/docs/ai/setup).

Every main command in the pipeline's plans has a parser. So the fallback normally runs in two cases:

- A parser fails on unusual output.
- A fallback command has no parser, such as `ifconfig` on a server without `ip`.

The prompt holds the command and its output, with ANSI codes and common secrets removed. Nothing asks you first.

:::caution
Secrets are removed by pattern matching, so one in an unusual format can get through. If you set up a hosted provider, the rest of the output goes to it. See [What leaves your computer](/docs/concepts/security#what-leaves-your-computer).
:::

Each provider is asked for JSON that fits the schema, built from the Zod schema by `server/src/llm/json-schema.ts`. OpenAI uses strict structured output when the schema allows it, Claude gets a JSON rule in the system prompt, and Ollama gets the schema in the request's `format` field.

## Zod validation

Every result in the pipeline passes a Zod schema, from a parser or from a model. A model's reply can still be malformed, and Zod is what catches that. If the check fails, the step fails.

Schemas for parsed output are in `server/src/parsers/schemas/`. Schemas that cross between server and client are in `shared/schemas/`.

A schema checks shape, not truth. A model can return well-formed JSON with wrong values. This is why parsers come first and the LLM is the fallback.

## Tracking LLM use

Each LLM parse records its tokens, latency and estimated cost. `GET /api/stats/llm` returns totals by model and by command, plus cache hit rates. The numbers reset on restart. For agent runs, use the [Observatory](/docs/ai/observatory).

## Add a parser

1. Add a file in `server/src/parsers/deterministic/` that exports a `DeterministicParser`.
2. Add it to `allParsers`. Put it before any shorter key that is a prefix of its command.
3. Use or add a Zod schema in `server/src/parsers/schemas/`.
4. Add a test in `server/tests/parsers/`, with raw command output as an inline template string.

A parser for a command with no parser yet is a good first change. See [Contributing](/docs/contributing).
