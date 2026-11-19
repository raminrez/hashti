# Plan 016: Tabs — the line variant with a moving indicator

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat f4445bd..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/015-toast (DONE)
- **Category**: migration (component build-out, cycle 16)
- **Planned at**: commit `f4445bd`, 2026-11-20

## Why this matters

Tabs introduce the selection-indicator recipe — a marker that measures the
selected tab and follows it. The segmented-control family reuses it.

## Current state

- `packages/react/src/toast/toast.tsx` — the wrapper exemplar (ToastRegion
  and Toast took className, so they were wrapped — apply the same check to
  the Tabs roots).
- `packages/styles/src/toast.css` — the newest stylesheet exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "avatar", "button", "checkbox", "dialog", "field", "input", "label", "popover", "radio", "select", "separator", "switch", "textarea", "toast", "tooltip"]`.

### ui-sdk Tabs facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/tabs.md`)

- Import: `import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"`.
- Composition: `Tabs` → (`TabsList` → `TabsTab`+, `TabsPanel`+). Tab and
  panel share a unique `value`; `defaultValue` picks the initial tab.
- `TabsIndicator` measures the selected tab and exposes CSS variables
  `--active-tab-top/left/width/height`; position it inside a relative list.
  Skip transitions while `data-activation-direction="none"` (first
  placement).
- States: `data-selected` on tab and panel; `data-orientation`;
  `data-disabled`; panels get `data-starting-style`/`data-ending-style`.
- `data-activation-direction` (`left`/`right`) tells which way the selection
  moved — panels can slide from that side (deferred; we fade).

### Design rules that bite (from `design/DESIGN.md`, `design/extraction/` — line variant)

- **List**: `display: flex; gap: 0.25rem; position: relative;
  border-block-end: 1px solid var(--hashti-border-subtle-00);`
- **Tab**: quiet action — `padding: 0.5rem 0.75rem;
  min-block-size: 2.75rem; border: none; background: transparent;
  border-radius: var(--hashti-control-radius) var(--hashti-control-radius) 0 0;`
  (top corners only — the line runs along the bottom), font
  0.875rem/500, ink `var(--hashti-text-secondary)`; `[data-selected]` → ink
  `var(--hashti-text-primary)`; hover background `var(--hashti-background-hover)`
  inside `(hover: hover)`, guarded `:not([data-selected]):not([data-disabled])`;
  `[data-disabled]` → ink `var(--hashti-text-disabled)`, cursor not-allowed.
- **Indicator**: the moving line — `position: absolute; block-size: 2px;
  background: var(--hashti-focus); border-radius: 9999px;` positioned from
  the ui-sdk variables; transition
  `top/left/width/height var(--hashti-duration-moderate-01)
  cubic-bezier(0.16, 1, 0.3, 1)`; `[data-activation-direction="none"]` →
  `transition: none`.
- **Panel**: `padding-block: 0.75rem;` ink default; fade via
  `data-starting-style`/`data-ending-style` → `opacity: 0` with
  `transition: opacity var(--hashti-duration-fast-01) cubic-bezier(0.16, 1, 0.3, 1)`.
- **Focus ring**: tabs are action controls — 2px `var(--hashti-focus)`,
  3px offset, on the tab, `:focus-visible` only.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/tabs/tabs.tsx` — create
- `packages/react/src/tabs/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/tabs.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/tabs-demo.tsx` — create
- `apps/docs/content/docs/tabs.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"tabs"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Vertical orientation styling, tab icons (`TabsTabIcon`), keep-mounted
  panels, manual activation, slide-by-direction panels — deferred
- Segmented control — its own cycle (reuses the indicator recipe)
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/016-tabs`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Tabs wrappers in `@hashti/react`

`packages/react/src/tabs/tabs.tsx` — the `join` helper pattern; parts and
classes (apply the direct-re-export check to roots that take no className):

| Part | Class |
| --- | --- |
| `Tabs` | `hashti-tabs` (or direct re-export) |
| `TabsList` | `hashti-tabs-list` |
| `TabsTab` | `hashti-tabs-tab` |
| `TabsIndicator` | `hashti-tabs-indicator` |
| `TabsPanel` | `hashti-tabs-panel` |

Export all five from `./tabs` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/tabs.css` — write the rules from the design-rules
section above: list, tab (+ selected/hover/disabled), indicator (moving
line with the ladder transition and the `none` skip), panel (+ fade).

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/tabs.css` → no matches; `grep -c "data-" packages/styles/src/tabs.css` → ≥ 6.

### Step 3: Docs demo component and page

`apps/docs/src/components/tabs-demo.tsx`:

```tsx
"use client"

import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@hashti/react"

export function TabsDemo() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTab value="overview">Overview</TabsTab>
        <TabsTab value="activity">Activity</TabsTab>
        <TabsTab value="settings">Settings</TabsTab>
        <TabsIndicator />
      </TabsList>
      <TabsPanel value="overview">The project at a glance.</TabsPanel>
      <TabsPanel value="activity">Recent changes and comments.</TabsPanel>
      <TabsPanel value="settings">Notifications, access and integrations.</TabsPanel>
    </Tabs>
  )
}
```

`apps/docs/content/docs/tabs.mdx`:

```mdx
---
title: Tabs
description: Switches between panels of related content.
---

import { TabsDemo } from '../../src/components/tabs-demo'

## Usage

<TabsDemo client:load />

## Parts

| Part | Purpose |
| --- | --- |
| `Tabs` | Owns the selected value and arrow-key movement. |
| `TabsList` | The tab row; give it an accessible name. |
| `TabsTab` | One tab; shares its `value` with its panel. |
| `TabsIndicator` | The line that follows the selection. |
| `TabsPanel` | The content a tab reveals. |

Styling lives in `@hashti/styles` under `.hashti-tabs-*` — the line variant: a subtle rule under the row and a focus-blue indicator that follows the selection.
```

`apps/docs/content/docs/meta.json` — `pages` becomes
`["index", "avatar", "button", "checkbox", "dialog", "field", "input", "label", "popover", "radio", "select", "separator", "switch", "tabs", "textarea", "toast", "tooltip"]`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(line under the row, indicator follows selection with motion, selected ink,
arrow keys move, disabled tab deferred-not-needed, panels swap).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-tabs" packages/react/src packages/styles/src` shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/tabs.css` returns nothing
- [ ] `grep -n "tabs" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the five parts is not exported from `@ui-sdk/react/tabs` — quote
  the error.
- The indicator variables (`--active-tab-*`) do not resolve — quote what you
  found.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The indicator recipe is the template for segmented control.
- Vertical tabs and icons land later; the list's `data-has-icons` lane is
  reserved.
