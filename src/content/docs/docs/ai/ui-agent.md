---
title: UI Agent
head:
  - tag: title
    content: "UI Agent: build server views by asking | HeadlessOS Docs"
description: Ask the UI Agent for a custom view of your server. It builds the window widget by widget, refines it with follow-ups and asks when a request is unclear.
---

The UI Agent turns a plain-language request into a view: a desktop window of tables, charts and cards built from your server's data.

You need a provider first. See [Set up AI](/docs/ai/setup).

## Ask for a view

1. Connect to a server and open **UI Agent** from its desktop icon or the Command Palette (Ctrl+K).
2. Describe what you want, such as "Show me disk usage with a bar chart", and press Enter. You can also pick a tile under **Quick prompts**, such as **System Overview** or **Network Ports**.

**Recent runs** lists earlier requests for this server. Click one to run it again.

## How a view gets built

A new window opens right away and fills in while the agent works:

1. The agent plans the view and creates its sections, which appear as a sidebar in the window.
2. For each section, it runs read-only [actions](/docs/ai/safety#typed-actions-not-shell-commands).
3. It adds widgets one at a time, and you see each one appear.
4. Some views get a review pass, which can send the agent back to fix problems.

The UI Agent window lists each step. To end a run, click the stop button.

The model chooses the widgets and points each one at an action's result. HeadlessOS then fills in the rows, numbers and log lines itself, so the model doesn't retype them. A table shows 20 rows and a log shows 30 lines unless the agent asks for more.

A finished run shows **View Generated**. A run has up to 30 steps. If it stops early, you see **View Partly Generated**, with the reason and any empty sections, and you keep what was built.

A view is a snapshot. It shows the values from when it was built and doesn't update by itself. It closes when the server's session hibernates or ends. For fresh data, run the request again.

## Refine the open view

After a view finishes, the input shows **Refining "title"**. Type a change, such as "add a memory chart". The agent edits the same window and keeps what still fits. If you closed that window, the result opens in a new one.

To start over, click **New view** above the input, or **New** at the top.

## When the agent asks a question

If a request names nothing to show, such as "help" or "fix it", the agent doesn't guess. It shows **The agent asks** with one question, and no new window stays open. Type your answer. HeadlessOS adds it to your first request and starts the run.

## Buttons in a view

The agent only reads while it builds, so a run can't change your server. It can add buttons to table rows, and each button names an action from the same fixed list. A read action runs when you click. An action that changes the server shows the **Allow this change?** card first, with the exact command. See [approvals](/docs/ai/safety#approvals-for-changes).

## Save a view as an app

A saved app is a reusable view with a name, an icon and a CLI tool name, plus an optional description and tags. Saved apps are stored in `~/.headlessos/user-apps/`. They appear under **My Apps** in the Start Menu and in the Command Palette. Opening one shows the view as it was saved.

:::caution
In version 0.3.0, the window that shows a UI Agent view has no **Save as App** button, so you can't save these views yet. To get a view back, click **New** and run it again from **Recent runs**.
:::

:::note
The **Sandbox Mode** switch above the input has no effect in version 0.3.0. No container is created, on or off.
:::

## The UI Agent can be wrong

It's an AI. HeadlessOS fills the widgets that point at action results, but the model picks what to show, and it writes titles, notes and alerts itself. It can choose the wrong data or describe it badly, and a widget it fills by hand can hold a wrong value. Check anything important in the [Terminal](/docs/apps/terminal) or a classic app before you act on it.
