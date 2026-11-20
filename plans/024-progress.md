# Plan 024: Progress — track, indicator, label, value

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 9ad6806..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/023-collapsible (DONE)
- **Category**: migration (component build-out, cycle 24 — S batch)
- **Planned at**: commit `9ad6806`, 2026-11-20

## Why this matters

Progress is the determinate task bar with the indeterminate state. Meter
reuses its track/indicator recipe next cycle.

## Current state

- `packages/styles/src/collapsible.css` — the newest stylesheet exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "button", "checkbox", "collapsible", "dialog", "field", "input", "kbd", "label", "listbox", "menu", "popover", "radio", "select", "separator", "slider", "switch", "tabs", "textarea", "toast", "toggle", "tooltip"]`.

### ui-sdk Progress facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/progress.md`)

- Import: `import { Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue } from "@ui-sdk/react/progress"`.
- Composition: `Progress` (holds value + range; `aria-label` or
  `ProgressLabel`) → (`ProgressLabel`, `ProgressValue`,
  `ProgressTrack` → `ProgressIndicator`).
- Root states: `data-indeterminate` (value null), `data-progressing`
  (below max), `data-complete` (at max) — present on every part.
- The indicator is positioned by ui-sdk with inline styles (percent) —
  give the track a size; do not fight the inline style in CSS.
- `ProgressValue` displays the formatted value; hidden from screen readers
  (the root already describes it).

### Design rules that bite (from `design/DESIGN.md`, old implementation)

- **Root**: `display: flex; flex-direction: column; gap: 0.5rem;
inline-size: 100%;`
- **Label**: helper typography (0.8125rem), ink
  `var(--hashti-text-primary)`, weight 500.
- **Track**: `block-size: 0.5rem; inline-size: 100%; background:
var(--hashti-border-subtle-00); border-radius: var(--hashti-border-radius-max);
overflow: hidden;`
- **Indicator**: `block-size: 100%; background: var(--hashti-interactive);
border-radius: var(--hashti-border-radius-max);` width transition
  `var(--hashti-duration-moderate-01) cubic-bezier(0.16, 1, 0.3, 1)` —
  but ONLY while progressing; keep the transition on the indicator
  generally (inline width changes animate; the initial paint starts at
  its natural value).
- **Indeterminate**: `[data-indeterminate]` on the track → the indicator
  gets a looping slide animation (`@keyframes` translating an
  indeterminate-length fill across the track; ~1.2s
  `cubic-bezier(0.16, 1, 0.3, 1)` infinite alternate is acceptable).
  `prefers-reduced-motion` → replace with opacity pulse or static 50%
  fill — pick static 50% (simplest, honest).
- **Value**: helper typography (0.8125rem), ink
  `var(--hashti-text-secondary)`, `font-variant-numeric: tabular-nums`.
- **Complete**: `[data-complete]` on the indicator → background
  `var(--hashti-support-success)` (the status vocabulary: done is green).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/progress/progress.tsx` — create
- `packages/react/src/progress/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/progress.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/progress-demo.tsx` — create
- `apps/docs/content/docs/progress.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"progress"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Value label custom formatting, locale recipes — consumer recipes
- Meter — its own cycle (next)
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/024-progress`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Progress wrappers in `@hashti/react`

`packages/react/src/progress/progress.tsx` — the `join` helper pattern
(direct-re-export check on the root):

| Part                | Class                       |
| ------------------- | --------------------------- |
| `Progress`          | `hashti-progress`           |
| `ProgressLabel`     | `hashti-progress__label`    |
| `ProgressValue`     | `hashti-progress__value`    |
| `ProgressTrack`     | `hashti-progress-track`     |
| `ProgressIndicator` | `hashti-progress-indicator` |

Export all five from `./progress` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/progress.css` — the design-rules section above
(root, label, value, track, indicator, indeterminate keyframes +
reduced-motion, complete).

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/progress.css`
→ no matches; `grep -c "data-" packages/styles/src/progress.css` → ≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/progress-demo.tsx`:

```tsx
"use client";

import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@hashti/react";

export function ProgressDemo() {
  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 360 }}>
      <Progress value={65} aria-label="Uploading">
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <Progress value={65}>
        <ProgressLabel>Uploading</ProgressLabel>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
        <ProgressValue />
      </Progress>
      <Progress aria-label="Scanning">
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <Progress value={100} aria-label="Finished">
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}
```

`apps/docs/content/docs/progress.mdx`:

```mdx
---
title: Progress
description: Shows how far a task has gone.
---

import { ProgressDemo } from "../../src/components/progress-demo";

## Usage

<ProgressDemo client:load />

## Parts

| Part                | Purpose                         |
| ------------------- | ------------------------------- |
| `Progress`          | Holds the value and range.      |
| `ProgressLabel`     | Visible name (or `aria-label`). |
| `ProgressValue`     | The formatted value.            |
| `ProgressTrack`     | The bar's size.                 |
| `ProgressIndicator` | The fill.                       |

Styling lives in `@hashti/styles` under `.hashti-progress*` — a 8px rounded track, interactive-blue fill, an indeterminate slide, and green when complete.
```

`apps/docs/content/docs/meta.json` — insert `"progress"` after `"popover"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(track/indicator geometry, 65% fill, indeterminate slide (or reduced-motion
static), complete green, label/value typography).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-progress" packages/react/src packages/styles/src`
      shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/progress.css`
      returns nothing
- [ ] `grep -n "progress" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the five parts is not exported from `@ui-sdk/react/progress` —
  quote the error.
- The indicator is NOT positioned by inline styles (the plan assumes it) —
  report the actual mechanism.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Meter reuses the track/indicator recipe with segments and status tones.
- The indeterminate keyframes may be shared with skeleton/loading recipes
  later.
