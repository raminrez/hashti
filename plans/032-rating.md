# Plan 032: Rating — star score with fill vocabulary

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat ce69659..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/031-timeline (DONE)
- **Category**: migration (component build-out, cycle 32 — S batch)
- **Planned at**: commit `ce69659`, 2026-11-20

## Why this matters

Rating is the star score input. Its fill vocabulary (`--rating-fill`,
`data-filled`/`data-partial`/`data-highlighted`) is ui-sdk's; Hashti only
paints it.

## Current state

- `packages/react/src/timeline/timeline.tsx` — the newest wrapper exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "badge", "button", "checkbox", "collapsible", "dialog", "field", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "popover", "progress", "radio", "scroll-area", "select", "separator", "slider", "switch", "tabs", "textarea", "timeline", "toast", "toggle", "tooltip"]`.

### ui-sdk Rating facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/rating.md`)

- Import: `import { Rating, RatingItem } from "@ui-sdk/react/rating"`.
- Composition: `Rating` (aria-label or Field label; radios over the icons)
  → one `RatingItem` child (rendered once per star; icon inside).
- Item states: `data-filled` (whole star covered), `data-partial` (score
  ends partway), `data-checked`, `data-disabled`, `data-readonly`,
  `data-highlighted` (pointer preview up to the hovered score).
- Fill variable: `--rating-fill` (0 → 1 per item) — for half stars/
  averages paint the icon up to `calc(var(--rating-fill) * 100%)` (e.g.
  gradient behind a star-shaped mask). `step={0.5}` halves stars.
- Keyboard: radios; Tab enters at the first star.

### Design rules that bite (derived; DESIGN.md vocabulary)

- **Root**: `display: inline-flex; gap: 0.25rem;`
- **Item (icon lane)**: `inline-size: 1.5rem; block-size: 1.5rem;
  display: inline-flex; align-items: center; justify-content: center;`
  ink `var(--hashti-border-strong-01)` (the empty star's gray), cursor
  pointer.
  - `[data-filled]` → ink `var(--hashti-icon-selected, var(--hashti-focus))`
    — use the selection blue (read tokens.css: `--hashti-icon-interactive`
    #0f62fe exists; prefer `var(--hashti-focus)` if no icon-selected token;
    check and use what exists).
  - `[data-partial]` → the fill paints up to
    `calc(var(--rating-fill) * 100%)` via a background gradient with the
    icon clipped as a mask is the general recipe; SIMPLEST correct
    approach this cycle: `[data-partial]` ink stays gray (the partial
    star reads as empty) and the demo uses whole stars only — note the
    half-star recipe as deferred. (Half-star masking is its own cycle.)
  - `[data-highlighted]` → ink `var(--hashti-focus)` (preview stars light
    up to the pointer's score).
  - `[data-readonly]` → cursor default.
  - `[data-disabled]` → ink `var(--hashti-text-disabled)`, cursor
    not-allowed.
- **Focus**: the radios sit over the icons; style the ring on the
  `.hashti-rating-item :focus-visible` (the radio itself — check how
  ui-sdk renders the radio; if the radio is a visually-hidden input, ring
  the item with `:has(:focus-visible)`, same pattern as Slider's thumb).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/rating/rating.tsx` — create
- `packages/react/src/rating/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/rating.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/rating-demo.tsx` — create
- `apps/docs/content/docs/rating.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"rating"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Half-star mask painting, average displays — deferred
- Size variants — the icon lane is 1.5rem only this cycle
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/032-rating`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Rating wrappers in `@hashti/react`

`packages/react/src/rating/rating.tsx` — the `join` helper pattern
(direct-re-export check on the root):

| Part | Class |
| --- | --- |
| `Rating` | `hashti-rating` |
| `RatingItem` | `hashti-rating-item` |

Export both from `./rating` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/rating.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/rating.css`
→ no matches; `grep -c "data-" packages/styles/src/rating.css` → ≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/rating-demo.tsx` — inline SVG star (no icon
dependency), read-only + interactive:

```tsx
"use client"

import { Rating, RatingItem } from "@hashti/react"

function Star() {
  return (
    <svg viewBox="0 0 16 16" width="24" height="24" aria-hidden="true">
      <path d="M8 1.5 10 6l4.5.5-3.3 3 .9 4.5L8 11.6 3.9 14l.9-4.5-3.3-3L6 6Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  )
}

export function RatingDemo() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Rating aria-label="Your rating" defaultValue={3}>
        <RatingItem><Star /></RatingItem>
      </Rating>
      <Rating aria-label="Average rating" defaultValue={4} readOnly>
        <RatingItem><Star /></RatingItem>
      </Rating>
    </div>
  )
}
```

(If `readOnly` is not the prop name, use the docs' Read-Only section's
name and note it.)

`apps/docs/content/docs/rating.mdx`:

```mdx
---
title: Rating
description: Picks a star score.
---

import { RatingDemo } from '../../src/components/rating-demo'

## Usage

<RatingDemo client:load />

## Parts

| Part | Purpose |
| --- | --- |
| `Rating` | Holds the score; radios over the stars. |
| `RatingItem` | One star; `data-filled`/`data-partial`/`data-highlighted` paint it. |

Styling lives in `@hashti/styles` under `.hashti-rating*` — gray empty stars, selection-blue filled and previewed. Half-star masking is a later recipe.
```

`apps/docs/content/docs/meta.json` — insert `"rating"` after `"radio"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(3 of 5 filled, click sets a score, pointer preview lights stars to the
hover, readonly not clickable, focus ring via :has, disabled ink).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-rating" packages/react/src packages/styles/src`
  shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/rating.css` returns
  nothing
- [ ] `grep -n "rating" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Either part is not exported from `@ui-sdk/react/rating` — quote the
  error.
- The radio is NOT a visually-hidden element inside the item (the `:has`
  focus pattern assumes it) — report the actual DOM.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Half-star masking (`--rating-fill` gradient + icon mask) is the
  follow-up recipe.
- The `:has(:focus-visible)` pattern is shared with Slider's thumb.
