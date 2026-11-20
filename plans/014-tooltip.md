# Plan 014: Tooltip — inverse hint surface

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 796a2b4..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/013-popover (DONE)
- **Category**: migration (component build-out, cycle 14)
- **Planned at**: commit `796a2b4`, 2026-11-20

## Why this matters

Tooltip is the inverse-ink surface — the one component whose surface is
dark in light mode. Small, but it establishes the inverse-surface recipe.

## Current state

- `packages/react/src/popover/popover.tsx` — the wrapper exemplar (check
  whether the Tooltip root takes className; re-export directly if not).
- `packages/styles/src/popover.css` — the motion exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "avatar", "button", "checkbox", "dialog", "field", "input", "label", "popover", "radio", "select", "separator", "switch", "textarea"]`.

### ui-sdk Tooltip facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/tooltip.md`)

- Import: `import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"`.
- Composition: `Tooltip` → (`TooltipTrigger`, `TooltipContent`); arrow and
  shortcut optional (deferred here).
- The content has the `tooltip` role and is in the page from the start
  (hidden) — it names or describes its trigger before focus reaches it.
- Content states: `data-open`/`data-closed`,
  `data-starting-style`/`data-ending-style`, `data-side`, `data-align`.
- Keep it to plain text — a tooltip can't be focused.

### Design rules that bite (from `design/DESIGN.md`, old implementation, `design/css-conventions.md`)

- **Inverse surface**: `var(--hashti-background-inverse)`, ink
  `var(--hashti-text-inverse)` — dark in light mode, light in dark.
- **Radius**: `var(--hashti-border-radius-08)` (0.5rem/8px — the old
  implementation's measured tooltip radius; a hint surface, not an overlay).
- **Typography**: 0.75rem/400, line-height 1.5.
- **Padding**: `0.25rem 0.5rem`.
- **Entrance**: 175ms — `var(--hashti-duration-fast-02)` (DESIGN.md motion:
  "175ms for popover and tooltip entrance"), `cubic-bezier(0.16, 1, 0.3, 1)`;
  starting/ending styles `opacity: 0` (+ `translate` 0 -0.125rem? — no:
  opacity only for tooltips; keep it minimal), reduced-motion → same (opacity
  only anyway).
- **No focus ring, no shadow token**: tooltips paint no focus ring
  (non-interactive surface) and the old shadow is dropped (a hint this size
  needs no shadow — the inverse surface carries it).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/tooltip/tooltip.tsx` — create
- `packages/react/src/tooltip/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/tooltip.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/tooltip-demo.tsx` — create
- `apps/docs/content/docs/tooltip.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"tooltip"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- `TooltipArrow`, `TooltipShortcut` styling — deferred
- Hover Card — its own cycle
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/014-tooltip`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Tooltip wrappers in `@hashti/react`

`packages/react/src/tooltip/tooltip.tsx` — the `join` helper pattern;
parts and classes:

| Part             | Class                                                                   |
| ---------------- | ----------------------------------------------------------------------- |
| `Tooltip`        | `hashti-tooltip` (or direct re-export if the root takes no className)   |
| `TooltipTrigger` | `hashti-tooltip-trigger` (no styling — it wraps the consumer's control) |
| `TooltipContent` | `hashti-tooltip-content`                                                |

Export all three from `./tooltip` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/tooltip.css`:

```css
.hashti-tooltip-content {
  max-inline-size: 16rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--hashti-border-radius-08);
  background: var(--hashti-background-inverse);
  color: var(--hashti-text-inverse);
  font-size: 0.75rem;
  line-height: 1.5;
  transition: opacity var(--hashti-duration-fast-02)
    cubic-bezier(0.16, 1, 0.3, 1);
}

.hashti-tooltip-content[data-starting-style],
.hashti-tooltip-content[data-ending-style] {
  opacity: 0;
}
```

`packages/styles/index.css` — add after the popover import:

```css
@import "./src/tooltip.css" layer(hashti.components);
```

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/tooltip.css` → no matches; `grep -c "duration-fast-02" design/tokens.css` → ≥ 1 (STOP if missing).

### Step 3: Docs demo component and page

`apps/docs/src/components/tooltip-demo.tsx`:

```tsx
"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@hashti/react";

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger>Share</TooltipTrigger>
      <TooltipContent>Anyone with the link can view</TooltipContent>
    </Tooltip>
  );
}
```

`apps/docs/content/docs/tooltip.mdx`:

```mdx
---
title: Tooltip
description: Reveals a short hint on hover and focus.
---

import { TooltipDemo } from "../../src/components/tooltip-demo";

## Usage

<TooltipDemo client:load />

## Parts

| Part             | Purpose                                           |
| ---------------- | ------------------------------------------------- |
| `Tooltip`        | Owns the open state and the trigger relationship. |
| `TooltipTrigger` | The control the hint describes.                   |
| `TooltipContent` | The inverse hint surface; plain text only.        |

Styling lives in `@hashti/styles` under `.hashti-tooltip-content` — the inverse surface, 8px radius, 175ms entrance.
```

`apps/docs/content/docs/meta.json` — `pages` becomes
`["index", "avatar", "button", "checkbox", "dialog", "field", "input", "label", "popover", "radio", "select", "separator", "switch", "textarea", "tooltip"]`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(hover and focus reveal the hint, inverse surface in both themes, entrance
opacity, dismissal on leave/Escape).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-tooltip" packages/react/src packages/styles/src` shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/tooltip.css` returns nothing
- [ ] `grep -n "tooltip" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the three parts is not exported from `@ui-sdk/react/tooltip` —
  quote the error.
- `--hashti-duration-fast-02` or `--hashti-text-inverse` is missing from
  `design/tokens.css` — quote the grep output.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The arrow and shortcut styling land with the Menu cycle.
- Hover Card is the rich-content sibling; its own cycle.
