# Plan 022: Toggle — pressed-state button and group

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 7797359..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/021-kbd (DONE)
- **Category**: migration (component build-out, cycle 22 — S batch)
- **Planned at**: commit `7797359`, 2026-11-20

## Why this matters

Toggle is the pressed-state action (bold, pin, like). Small, but it
establishes the `data-pressed` vocabulary that segmented-control and
toolbar toggle buttons reuse.

## Current state

- `packages/react/src/kbd/kbd.tsx` — the newest component exemplar.
- `packages/styles/src/button.css` — the button recipe the toggle borrows
  (control height, radius, focus ring, hover guard, disabled).
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "button", "checkbox", "dialog", "field", "input", "kbd", "label", "listbox", "menu", "popover", "radio", "select", "separator", "slider", "switch", "tabs", "textarea", "toast", "tooltip"]`.

### ui-sdk Toggle facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/toggle.md`)

- Import: `import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/react/toggle"`.
- Composition: `Toggle` (renders a native button, `aria-pressed`) →
  `ToggleIcon` (optional, aria-hidden). `ToggleGroup` → `Toggle`+ (each
  with `value`; the group's value lists the pressed ones).
- Toggle states: `data-pressed`, `data-disabled`, `data-orientation`
  (in a group), `data-has-icon`.
- ToggleGroup states: `data-orientation`, `data-disabled`.
- `ToggleIcon` has `data-mirror` (RTL flip — deferred styling).

### Design rules that bite (from `design/DESIGN.md`, button.css recipes)

- **Toggle (single)**: an action control — `display: inline-flex;
  align-items: center; justify-content: center; gap: 0.375rem;
  min-block-size: 2rem; min-inline-size: 2rem; padding: 0 0.5rem;
  border: none; border-radius: var(--hashti-control-radius);
  background: transparent; color: var(--hashti-text-primary);
  font-size: 0.875rem; font-weight: 500; cursor: pointer;`
  - hover background `var(--hashti-background-hover)` inside
    `@media (hover: hover)` guarded `:not([data-pressed]):not([data-disabled])`.
  - `[data-pressed]` → background `var(--hashti-background-selected)`,
    ink `var(--hashti-focus)` (selection blue on the light blue tint — the
    status vocabulary's selected recipe).
  - `[data-disabled]` → ink `var(--hashti-text-disabled)`, cursor
    not-allowed, background transparent (even if pressed).
- **ToggleGroup**: `display: inline-flex; gap: 0.25rem;` — no shared
  surface (each toggle is its own control; a joined segmented look is
  segmented-control's cycle, not this one).
- **ToggleIcon**: `inline-flex; inline-size: 1rem; block-size: 1rem;` ink
  inherits.
- **Focus ring**: 2px `var(--hashti-focus)`, 2px offset, `:focus-visible`
  only (button recipe).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/toggle/toggle.tsx` — create
- `packages/react/src/toggle/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/toggle.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/toggle-demo.tsx` — create
- `apps/docs/content/docs/toggle.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"toggle"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Vertical groups, `data-mirror` RTL styling — deferred
- Joined/segmented group look — segmented-control's cycle
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/022-toggle`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Toggle wrappers in `@hashti/react`

`packages/react/src/toggle/toggle.tsx` — the `join` helper pattern
(direct-re-export check on roots that take no className):

| Part | Class |
| --- | --- |
| `Toggle` | `hashti-toggle` |
| `ToggleGroup` | `hashti-toggle-group` (or direct re-export) |
| `ToggleIcon` | `hashti-toggle-icon` |

Export all three from `./toggle` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/toggle.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/toggle.css` →
no matches; `grep -c "data-" packages/styles/src/toggle.css` → ≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/toggle-demo.tsx` — three standalone toggles
(pressed/unpressed/disabled) and a two-toggle group:

```tsx
"use client"

import { useState } from "react"
import { Toggle, ToggleGroup } from "@hashti/react"

function Pin() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M8 1.5 10 6l4.5.5-3.3 3 .9 4.5L8 11.6 3.9 14l.9-4.5-3.3-3L6 6Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

export function ToggleDemo() {
  const [single, setSingle] = useState(false)
  const [pair, setPair] = useState<string[]>([])
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <Toggle pressed={single} onChange={setSingle} aria-label="Pin">
          <Pin /> Pin
        </Toggle>
        <Toggle pressed={false} aria-label="Like">Like</Toggle>
        <Toggle pressed disabled aria-label="Muted">Muted</Toggle>
      </div>
      <ToggleGroup value={pair} onChange={setPair} aria-label="Layers">
        <Toggle value="grid">Grid</Toggle>
        <Toggle value="rules">Rules</Toggle>
      </ToggleGroup>
    </div>
  )
}
```

(If the controlled props differ — `defaultPressed`, `onPressedChange`,
`onValueChange` — use what the docs' Controlled section documents and note
it.)

`apps/docs/content/docs/toggle.mdx`:

```mdx
---
title: Toggle
description: A button that stays pressed.
---

import { ToggleDemo } from '../../src/components/toggle-demo'

## Usage

<ToggleDemo client:load />

## Parts

| Part | Purpose |
| --- | --- |
| `Toggle` | A pressed-state button (`aria-pressed`). |
| `ToggleGroup` | Groups toggles; the value lists the pressed ones. |
| `ToggleIcon` | Optional icon; hidden from screen readers. |

Styling lives in `@hashti/styles` under `.hashti-toggle*` — quiet action, selected tint in background-selected with focus-blue ink.
```

`apps/docs/content/docs/meta.json` — insert `"toggle"` after `"tooltip"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(press toggles state, selected tint + blue ink, hover, disabled stays
transparent, group multi-select, keyboard space/enter, focus ring).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-toggle" packages/react/src packages/styles/src`
  shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/toggle.css` returns
  nothing
- [ ] `grep -n "toggle" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the three parts is not exported from `@ui-sdk/react/toggle` —
  quote the error.
- The controlled props do not match the demo and the docs' Controlled
  section contradicts both — quote what you found.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The `data-pressed` recipe is the template for segmented control and
  toolbar toggles.
- Vertical groups and RTL icon mirroring land with the RTL pass.
