# Plan 027: HoverCard — rich preview on pause

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 24d0f24..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW (Popover's surface recipe at hover timing)
- **Depends on**: plans/026-scroll-area (DONE)
- **Category**: migration (component build-out, cycle 27 — S batch)
- **Planned at**: commit `24d0f24`, 2026-11-20

## Why this matters

HoverCard is the link preview — Popover's anchored surface opened by
pointer pause instead of a press. Completes the anchored-overlay family.

## Current state

- `packages/react/src/popover/popover.tsx` — the wrapper exemplar (root
  direct-re-export check applies).
- `packages/styles/src/popover.css` — the surface/motion exemplar; copy it
  with the hover-card's `max-inline-size` and richer padding.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "button", "checkbox", "collapsible", "dialog", "field", "input", "kbd", "label", "listbox", "menu", "meter", "popover", "progress", "radio", "scroll-area", "select", "separator", "slider", "switch", "tabs", "textarea", "toast", "toggle", "tooltip"]`.

### ui-sdk HoverCard facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/hover-card.md`)

- Import: `import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/react/hover-card"` (arrow deferred — verify exact exports).
- Composition: `HoverCard` → (`HoverCardTrigger` — an `<a>` with `href`;
  `HoverCardContent` — the preview). Arrow optional (deferred).
- Content states: `data-open`/`data-closed`,
  `data-starting-style`/`data-ending-style`, `data-side`, `data-align`.
- Opens on pointer pause; closes on leave. Touch/screen-reader users may
  never see it — content must be reachable from the link target (a
  content rule, not styling).

### Design rules that bite (from `design/DESIGN.md`, popover.css)

- **Surface**: copy popover.css's content recipe — background
  `var(--hashti-layer-01)`, border `1px solid
var(--hashti-border-subtle-00)`, `border-radius:
var(--hashti-popover-radius)`, shadow `0 8px 24px
var(--hashti-shadow)`, `padding: 0.75rem`, `max-inline-size: 18rem`
  (cards are wider than popovers' 16rem but not dialog-wide).
- **Motion**: starting/ending → `opacity: 0; scale(0.98)`,
  `transform-origin: var(--transform-origin)`, transition
  `var(--hashti-duration-fast-01) cubic-bezier(0.16, 1, 0.3, 1)`,
  reduced-motion → opacity only.
- **Trigger**: NO styling — it wraps the consumer's link (`<a href>`).
  Give the class but no rule (same as tooltip trigger).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/hover-card/hover-card.tsx` — create
- `packages/react/src/hover-card/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/hover-card.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/hover-card-demo.tsx` — create
- `apps/docs/content/docs/hover-card.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"hover-card"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- `HoverCardArrow` styling — deferred with the arrow recipes
- One-card-for-many-links, controlled, container — behavior exists; recipes
  documented later
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/027-hover-card`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the HoverCard wrappers in `@hashti/react`

`packages/react/src/hover-card/hover-card.tsx` — the `join` helper pattern
(direct-re-export check on the root):

| Part               | Class                                        |
| ------------------ | -------------------------------------------- |
| `HoverCard`        | `hashti-hover-card` (or direct re-export)    |
| `HoverCardTrigger` | `hashti-hover-card-trigger` (class, no rule) |
| `HoverCardContent` | `hashti-hover-card-content`                  |

Export all three from `./hover-card` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/hover-card.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/hover-card.css`
→ no matches; `grep -c "data-" packages/styles/src/hover-card.css` → ≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/hover-card-demo.tsx`:

```tsx
"use client";

import { Avatar } from "@hashti/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@hashti/react";

export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger href="#profile">Hollis Vance</HoverCardTrigger>
      <HoverCardContent>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Avatar initials="HV" />
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
              Hollis Vance
            </div>
            <div
              style={{
                fontSize: "0.8125rem",
                color: "var(--hashti-text-secondary)",
              }}
            >
              Design systems lead
            </div>
          </div>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "0.8125rem",
            color: "var(--hashti-text-secondary)",
          }}
        >
          Builds the component library and the tokens behind it.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}
```

(If Avatar's compound-part contract fights the demo (AvatarImage inside
Avatar needs its root context), use a plain styled div circle with the
initials instead and note it.)

`apps/docs/content/docs/hover-card.mdx`:

```mdx
---
title: HoverCard
description: Previews a link's target on pause.
---

import { HoverCardDemo } from "../../src/components/hover-card-demo";

## Usage

<HoverCardDemo client:load />

## Parts

| Part               | Purpose                         |
| ------------------ | ------------------------------- |
| `HoverCard`        | Owns the open state and delays. |
| `HoverCardTrigger` | The link (an `<a href>`).       |
| `HoverCardContent` | The preview surface.            |

Styling lives in `@hashti/styles` under `.hashti-hover-card-content` — the popover surface at hover timing. Keep the content reachable from the link target: touch users may never see it.
```

`apps/docs/content/docs/meta.json` — insert `"hover-card"` after
`"history"`… use the alphabetical spot between `"hover-card"` neighbors:
after `"field"`'s neighbor `"input"`? No — insert between `"field"` and
`"input"` is wrong; the list is alphabetical: insert `"hover-card"` after
`"field"` and before `"input"`… verify against the live list and insert in
alphabetical position (between "field" and "input" is "hover-card" — yes:
field, hover-card, input).

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(opens on pause, surface recipe correct, closes on leave, Escape dismisses,
motion from the trigger).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-hover-card" packages/react/src packages/styles/src`
      shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/hover-card.css`
      returns nothing
- [ ] `grep -n "hover-card" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the three parts is not exported from `@ui-sdk/react/hover-card` —
  quote the error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The arrow recipe lands with the arrow-recipes cycle (Menu's note too).
- Hover delays are ui-sdk behavior; document them in the MDX when asked.
