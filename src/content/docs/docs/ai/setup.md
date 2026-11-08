---
title: Set up AI
head:
  - tag: title
    content: "Set up AI with OpenAI, Claude or Ollama | HeadlessOS Docs"
description: Turn on AI in HeadlessOS with OpenAI, Claude or a local Ollama model. What each needs, where API keys are stored, and how to choose a provider.
---

HeadlessOS works without AI. To use the [AI Agent](/docs/ai/agent) and [UI Agent](/docs/ai/ui-agent), you choose a provider, the service that runs the model. A model is the AI program that reads a prompt and writes a reply.

## What works without AI

With the provider set to **None (deterministic only)**:

- All the classic apps work, from Dashboard to Server Admin. They read command output with built-in [parsers](/docs/concepts/parsing).
- If no parser can read a command's output, that read fails. With a provider set, the model reads it instead.
- AI Agent and UI Agent say that no provider is configured.

## Turn on AI

1. Open **Settings** and choose **AI / LLM**.
2. Under **Provider**, choose **OpenAI**, **Anthropic (Claude)** or **Ollama**.
3. Fill in that provider's fields, described below.
4. Click **Save Configuration**. **Status** changes to **Active**, with no restart.

## Use OpenAI

You need an API key from your OpenAI account. An API key is a secret that lets the app use your account, at your cost.

Paste it into **API Key** and pick a model. **GPT-6 Luna** is the default. The key isn't tested when you save, so a wrong key shows up later as an error.

Your model serves parsing and the AI Agent. The UI Agent uses fixed models: `gpt-5.4` to plan and review, and `gpt-4.1` to build the view.

If you run from source, `OPENAI_API_KEY` in `.env` also works, but a key saved in Settings wins.

## Use Claude

You need an API key from your Anthropic account. Paste it, then pick **Claude Haiku 5.5** (the default), **Claude Sonnet 5.5** or **Claude Opus 5.5**. That model serves everything, including the UI Agent.

HeadlessOS tests the key against the model before saving. If the test fails, nothing changes. Claude keys come from Settings only, not `.env`.

## Use a local model with Ollama

[Ollama](https://ollama.com) runs models on your own hardware, with no key and no per-token bill.

1. Install Ollama and download a model:

   ```bash
   ollama pull qwen3:8b
   ```

2. Choose **Ollama**. The URL defaults to `http://127.0.0.1:11434`.
3. Pick an installed model that supports tool calling, which the agents rely on.
4. Leave **Context window** on **Auto**, or pick a size.

That model serves everything. For an Ollama on another machine, enter its URL and turn on the switch below it. Prompts and server output then go to that machine.

### Context window and small models

A context window is how much text a model can hold at once, counted in tokens. A token is roughly four characters.

**Auto** uses up to 64K tokens, never more than the model supports. You can also pick 8K to 128K. A bigger window needs more memory. If you see **Part of the model runs on the CPU**, choose a smaller window or a smaller model.

Small windows work, but the agents get less: 8 read actions at 8K against 40 at 64K, and shorter results.

## Where your API key is stored

Keys saved in Settings go in `~/.headlessos/llm.json`, encrypted with AES-256-GCM. On Windows, `~` is your user folder. The app never sends a key back to the browser, and a key goes only to its own provider.

Switching providers keeps the other keys. Saving **None** deletes all saved keys and provider settings.

:::note
Encryption stops casual reading. It doesn't stop someone who can run code as your user, because the decryption key is on the same computer. A key in `.env` is plain text, and it returns at the next start even after you save **None**.
:::

## Choose a provider

| | OpenAI | Claude | Ollama |
| --- | --- | --- | --- |
| **Cost per 1M tokens, in / out** | GPT-6 Luna: $0.10 / $0.50 | Haiku: $0.10 / $0.50. Sonnet: $2 / $10. Opus: $4 / $20 | None. You supply the hardware |
| **Prompts and server output** | Sent to OpenAI | Sent to Anthropic | Stay on hardware you control |
| **Quality** | Depends on the model | Haiku is fastest, Opus is most capable | Depends on the model. Small models make more mistakes |

Prices are as listed in version 0.2.1. Check your provider for current ones.

For the lowest cost on both agents, start with Claude Haiku 5.5, since GPT-6 Luna's price doesn't apply to the UI Agent. If server output must not leave your hardware, use Ollama.

See [what reaches a provider](/docs/ai/safety#what-reaches-the-model-provider) and [how to track costs](/docs/ai/observatory#cost-tracking).
