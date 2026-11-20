# Plan 050: Command — the command palette

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 21cedb0..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW (menu items + filter input, in a modal shell)
- **Depends on**: plans/049-autocomplete (DONE)
- **Category**: migration (component build-out, cycle 50 — L batch)
- **Planned at**: commit `21cedb0`, 2026-11-20

## Why this matters

Command is the command palette (⌘K) — a filtered action list in a dialog
shell. Milestone cycle: the 50th.

## Current state

- `packages/styles/src/autocomplete.css` — the item/highlight recipes;
  the command item is the menu item again.
- `packages/styles/src/dialog.css` — the modal shell (scrim, surface,
  motion); the palette is a dialog hosting a list.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "alert-dialog", "avatar", "badge", "button", "carousel", "checkbox", "collapsible", "combobox", "date-input", "dialog", "drawer", "field", "file-input", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "menubar", "meter", "number-input", "pagination", "password-input", "popover", "progress", "radio", "rating", "resizable", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "time-input", "timeline", "toast", "toolbar", "toggle", "tooltip", "trigger-menu"]`.

### ui-sdk Command facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/command.md`)

- Import: `import { Command, CommandEmpty, CommandGroup, CommandGroupLabel, CommandInput, CommandItem, CommandList, CommandSeparator } from "@ui-sdk/react/command"` (verify exact exports).
- Composition: `Command` (root; `onAction` runs the chosen command's
  value) → (`CommandInput`, `CommandEmpty`, `CommandList` →
  `CommandItem`+; `CommandGroup` → `CommandGroupLabel`, `CommandSeparator`).
- Item states: `data-highlighted` (focus stays in the field; Enter runs
  it), `data-disabled`, `data-pending`, `data-has-icon`. ItemText:
  `data-matched` (marks the matched substring).
- Root: `data-loading`. The docs' Dialog section shows it hosted in a
  dialog (⌘K).

### Design rules that bite (menu items in a dialog shell)

- **Root `hashti-command`**: a static panel (this cycle renders it INLINE
  in the docs demo, NOT in a dialog — dialog hosting is the consumer's
  composition): `background: var(--hashti-layer-01); border: 1px solid
var(--hashti-border-subtle-00); border-radius:
var(--hashti-popover-radius); box-shadow: 0 8px 24px
var(--hashti-shadow); overflow: hidden; display: flex; flex-direction:
column; inline-size: 100%; max-inline-size: 28rem;`
- **Input `hashti-command-input`**: `block-size: 3rem; padding: 0
0.875rem; border: none; border-block-end: 1px solid
var(--hashti-border-subtle-00); background: transparent; color:
var(--hashti-text-primary); font-size: 0.875rem;` `::placeholder`
  secondary; outline none (the panel carries the ring in a dialog).
- **List `hashti-command-list`**: `overflow-y: auto; max-block-size:
16rem; padding: 0.25rem;` (the scrollable region).
- **Items `hashti-command-item`**: full-bleed menu item recipe — 40px,
  `0 0.625rem`, `border-radius: var(--hashti-border-radius-08);`
  highlighted → background-hover, `outline: none;` disabled ink.
  - `[data-pending]` → ink secondary + `cursor: progress;`
- **ItemText**: `[data-matched]` marks the match — `mark`-style is
  deferred; plain text this cycle.
- **Group label**: helper typography (0.8125rem), secondary ink,
  `0.375rem 0.625rem 0.25rem`.
- **Separator**: 1px, subtle, `margin: 0.25rem 0.5rem`.
- **Empty**: helper typography, secondary, `0.5rem 0.75rem`.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/command/command.tsx` — create
- `packages/react/src/command/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/command.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/command-demo.tsx` — create
- `apps/docs/content/docs/command.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"command"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Dialog hosting recipe (⌘K wiring) — documented behavior; the demo keeps
  it inline
- Pages, items-as-data, async results, pending-action styling — deferred
- Item icons, `data-matched` mark styling — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/050-command`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Command wrappers in `@hashti/react`

`packages/react/src/command/command.tsx` — the `join` helper pattern
(direct-re-export checks per part; data-slot keying where a class cannot
land — the date-input lesson):

| Part                | Class                         |
| ------------------- | ----------------------------- |
| `Command`           | `hashti-command`              |
| `CommandInput`      | `hashti-command-input`        |
| `CommandList`       | `hashti-command-list`         |
| `CommandItem`       | `hashti-command-item`         |
| `CommandGroup`      | `hashti-command-group`        |
| `CommandGroupLabel` | `hashti-command__group-label` |
| `CommandSeparator`  | `hashti-command-separator`    |
| `CommandEmpty`      | `hashti-command-empty`        |

Export all from `./command` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/command.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/command.css`
→ no matches; `grep -c "data-" packages/styles/src/command.css` → ≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/command-demo.tsx`:

```tsx
"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@hashti/react";

export function CommandDemo() {
  return (
    <Command onAction={(v) => console.log(v)} style={{ maxWidth: 448 }}>
      <CommandInput
        placeholder="Type a command or search…"
        aria-label="Command palette"
      />
      <CommandList>
        <CommandGroup>
          <CommandGroupLabel>File</CommandGroupLabel>
          <CommandItem value="new-file">New file</CommandItem>
          <CommandItem value="open">Open recent</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup>
          <CommandGroupLabel>Edit</CommandGroupLabel>
          <CommandItem value="undo">Undo</CommandItem>
          <CommandItem value="disabled-one" disabled>
            Redo
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <CommandEmpty>No commands found.</CommandEmpty>
    </Command>
  );
}
```

(If Empty must be inside List/Content per the docs, adapt and note it.)

`apps/docs/content/docs/command.mdx`:

```mdx
---
title: Command
description: Runs commands from a filtered list.
---

import { CommandDemo } from "../../src/components/command-demo";

## Usage

<CommandDemo client:load />

## Parts

| Part                                                      | Purpose                                          |
| --------------------------------------------------------- | ------------------------------------------------ |
| `Command`                                                 | The palette panel; `onAction` runs the choice.   |
| `CommandInput`                                            | The filter field.                                |
| `CommandList`                                             | The scrollable region.                           |
| `CommandItem`                                             | One command; `data-highlighted`, `data-pending`. |
| `CommandGroup` / `CommandGroupLabel` / `CommandSeparator` | Named sets.                                      |
| `CommandEmpty`                                            | Shows when nothing matches.                      |

Styling lives in `@hashti/styles` under `.hashti-command*` — a floating panel with a search bar on top and full-bleed menu items below.
```

`apps/docs/content/docs/meta.json` — insert `"command"` after
`"collapsible"` (alphabetical check against the live list).

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(filter narrows, arrows highlight, Enter runs onAction, disabled skips,
group labels/separator, empty state, scroll region).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-command" packages/react/src packages/styles/src`
      shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/command.css`
      returns nothing
- [ ] `grep -n "command" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any part is not exported from `@ui-sdk/react/command` — quote the
  error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Dialog hosting (⌘K wiring) is a docs recipe for a future forms/advanced
  guide cycle.
- Pages and async results are the follow-up command cycles.
