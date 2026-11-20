# Plan 025: Meter — a reading against a range

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 2785abf..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW (reuses the Progress track/indicator recipe)
- **Depends on**: plans/024-progress (DONE)
- **Category**: migration (component build-out, cycle 25 — S batch)
- **Planned at**: commit `2785abf`, 2026-11-20

## Why this matters

Meter is the static reading (storage, quota, score) — Progress's sibling
with a `meter` role, a `--meter-value` variable, and tone-by-threshold
semantics.

## Current state

- `packages/styles/src/progress.css` — the track/indicator exemplar; copy
  the geometry (0.5rem track, max radius, overflow hidden) and the fill
  transition.
- `packages/react/src/progress/progress.tsx` — the wrapper exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "button", "checkbox", "collapsible", "dialog", "field", "input", "kbd", "label", "listbox", "menu", "popover", "progress", "radio", "select", "separator", "slider", "switch", "tabs", "textarea", "toast", "toggle", "tooltip"]`.

### ui-sdk Meter facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/meter.md`)

- Import: `import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from "@ui-sdk/react/meter"`.
- Composition: `Meter` (value always present; no indeterminate) →
  (`MeterLabel`, `MeterValue`, `MeterTrack` → `MeterIndicator`).
- The root exposes `--meter-value` (the percent, like `40%`) for
  positioning content alongside the reading.
- The indicator width is set by ui-sdk (same inline positioning as
  Progress). A value above max clamps the fill.
- `format`, `locale`, `getValueLabel` — behavior props, no styling.
- Parts receive `value` and `percent` in state/class hooks.

### Design rules that bite (from `design/DESIGN.md`, old implementation, status vocabulary)

- **Root**: `display: flex; flex-direction: column; gap: 0.5rem;
inline-size: 100%;`
- **Label**: helper typography (0.8125rem), ink
  `var(--hashti-text-primary)`, weight 500.
- **Value**: helper typography (0.8125rem), ink
  `var(--hashti-text-secondary)`, `font-variant-numeric: tabular-nums`.
  Label and value share a row when both present — wrap them naturally
  (root column gap handles the rows; label/value can sit in one row via
  the consumer's layout, no special CSS this cycle).
- **Track**: `block-size: 0.5rem; inline-size: 100%; background:
var(--hashti-border-subtle-00); border-radius: var(--hashti-border-radius-max);
overflow: hidden;`
- **Indicator**: `block-size: 100%; border-radius:
var(--hashti-border-radius-max); background: var(--hashti-interactive);`
  width transition `var(--hashti-duration-moderate-01)
cubic-bezier(0.16, 1, 0.3, 1)`.
- **Tones by threshold** (the meter's semantic core — plain CSS, no JS):
  - Neutral (default): `var(--hashti-interactive)`.
  - `[data-theme]`-safe success/neutral/warning/danger come from the
    CONSUMER via a `data-tone` attribute on the root? NO — ui-sdk does not
    ship tone. Ship a `hashti-meter` modifier contract instead:
    `.hashti-meter[data-tone="success"] .hashti-meter-indicator →
var(--hashti-support-success)`, `warning → var(--hashti-support-warning)`,
    `danger → var(--hashti-support-error)`, documented in the MDX page.
    The wrapper passes `data-tone` through from props (it is a plain
    attribute spread — allowed; class contract unchanged).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/meter/meter.tsx` — create
- `packages/react/src/meter/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/meter.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/meter-demo.tsx` — create
- `apps/docs/content/docs/meter.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"meter"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Custom formatting, locale, getValueLabel recipes — consumer recipes
- Segmented meter fills (multi-segment bars) — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/025-meter`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Meter wrappers in `@hashti/react`

`packages/react/src/meter/meter.tsx` — the `join` helper pattern
(direct-re-export check on the root). The root wrapper also forwards
`data-tone` (it is just a spread — no computed class logic):

| Part             | Class                    |
| ---------------- | ------------------------ |
| `Meter`          | `hashti-meter`           |
| `MeterLabel`     | `hashti-meter__label`    |
| `MeterValue`     | `hashti-meter__value`    |
| `MeterTrack`     | `hashti-meter-track`     |
| `MeterIndicator` | `hashti-meter-indicator` |

Export all five from `./meter` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/meter.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/meter.css` →
no matches; `grep -c "data-" packages/styles/src/meter.css` → ≥ 4 (tone
selectors count).

### Step 3: Docs demo component and page

`apps/docs/src/components/meter-demo.tsx`:

```tsx
"use client";

import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "@hashti/react";

export function MeterDemo() {
  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 360 }}>
      <Meter value={40}>
        <MeterLabel>Storage</MeterLabel>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
        <MeterValue />
      </Meter>
      <Meter value={92} data-tone="warning" aria-label="CPU">
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
      <Meter value={98} data-tone="danger" aria-label="Quota">
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  );
}
```

`apps/docs/content/docs/meter.mdx`:

```mdx
---
title: Meter
description: Shows a reading against a range.
---

import { MeterDemo } from "../../src/components/meter-demo";

## Usage

<MeterDemo client:load />

## Parts

| Part             | Purpose                                         |
| ---------------- | ----------------------------------------------- |
| `Meter`          | Holds the value and range; accepts `data-tone`. |
| `MeterLabel`     | Visible name (or `aria-label`).                 |
| `MeterValue`     | The formatted value.                            |
| `MeterTrack`     | The bar's size.                                 |
| `MeterIndicator` | The fill.                                       |

Pass `data-tone="success" | "warning" | "danger"` for status ink; the default fill is interactive blue.
```

`apps/docs/content/docs/meta.json` — insert `"meter"` after `"menu"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(40% fill exact, tones swap ink, label/value typography, clamp above max).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-meter" packages/react/src packages/styles/src` shows
      the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/meter.css` returns
      nothing
- [ ] `grep -n "meter" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the five parts is not exported from `@ui-sdk/react/meter` — quote
  the error.
- The root does not expose `--meter-value` as documented — quote what you
  found.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Segmented fills (multi-segment bars) land when a use-case asks.
- The tone contract (`data-tone` on the root) is the pattern for other
  Hashti-owned status variants.
