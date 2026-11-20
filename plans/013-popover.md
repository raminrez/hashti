# Plan 013: Popover — anchored surface with title, description, close

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat e21c75b..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW (reuses the Dialog and Select recipes)
- **Depends on**: plans/012-dialog (DONE)
- **Category**: migration (component build-out, cycle 13)
- **Planned at**: commit `08f1fd2`, 2026-11-20

## Why this matters

Popover is the anchored overlay: it reuses the Dialog surface recipes at
anchor scale and adds placement (`data-side`/`data-align`). Menu, Tooltip
and Hover Card copy this shape.

## Current state

- `packages/react/src/dialog/dialog.tsx` — the wrapper exemplar (note: the
  Dialog root shipped as a direct re-export because it renders no DOM node;
  apply the same check to Popover's root).
- `packages/styles/src/dialog.css` — the surface/motion exemplar. The
  popover copies the surface recipe at the POPOVER shadow
  (`0 8px 24px var(--hashti-shadow)` — DESIGN.md's anchored-overlay shadow,
  lighter than the dialog's modal `0 16px 48px`).
- `apps/docs/src/components/dialog-demo.tsx` — the compound docs pattern.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "avatar", "button", "checkbox", "dialog", "field", "input", "label", "radio", "select", "separator", "switch", "textarea"]`.

### ui-sdk Popover facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/popover.md`)

- Import: `import { Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@ui-sdk/react/popover"`.
- Composition: `Popover` → (`PopoverTrigger`, `PopoverContent` →
  `PopoverTitle`, `PopoverDescription`, `PopoverClose`). The content has
  the dialog role. Arrow is optional (deferred here).
- Content states: `data-open`/`data-closed`,
  `data-starting-style`/`data-ending-style`, `data-side`
  (top/right/bottom/left), `data-align` (start/center/end),
  `data-presentation`.
- Content props: `side`, `align`, `sideOffset`, `alignOffset` — placement
  with flip; defaults are ui-sdk's (do not re-specify in CSS).
- Renders in the top layer; `[data-theme]` ancestry works.

### Design rules that bite (from `design/DESIGN.md`, `design/extraction/`)

- **Surface**: `var(--hashti-layer-01)` background, 1px
  `var(--hashti-border-subtle-00)` border,
  `border-radius: var(--hashti-popover-radius)` (18px), **popover shadow**
  `0 8px 24px var(--hashti-shadow)`, `padding: 0.75rem`,
  `max-inline-size: 20rem`.
- **Title**: 0.875rem/600, ink `var(--hashti-text-primary)`.
- **Description**: 0.812rem→`0.8125rem`/400 (helper size), ink
  `var(--hashti-text-secondary)`.
- **Trigger**: the quiet-action recipe from dialog.css (transparent,
  44px row, control radius, hover inside `(hover: hover)`).
- **Motion**: content starting/ending → `opacity: 0; scale(0.98)`;
  transition `var(--hashti-duration-fast-01)`
  `cubic-bezier(0.16, 1, 0.3, 1)`; reduced-motion → opacity only.
- **Close**: quiet text button; the popover is a non-interactive SURFACE —
  no focus ring on the surface; the close button takes the standard
  `:focus-visible` ring (2px/2px — it is NOT an overlay close in the
  matrix's inset sense; the inset rule is for surfaces whose close sits on
  the surface edge. Popover close is an inline row — 2px/2px).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/popover/popover.tsx` — create
- `packages/react/src/popover/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/popover.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/popover-demo.tsx` — create
- `apps/docs/content/docs/popover.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"popover"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- `PopoverArrow` styling — deferred (arrow skinning needs the side-aware
  recipe; the demo renders no arrow)
- Modal popovers, hover-open, triggers-outside with controllers — deferred
- Menu, Tooltip, Hover Card — their own cycles
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/013-popover`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Popover wrappers in `@hashti/react`

`packages/react/src/popover/popover.tsx` — the `join` helper pattern from
`packages/react/src/field/field.tsx`; parts and classes:

| Part                 | Class                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| `Popover`            | `hashti-popover` (or direct re-export if the root takes no className — same check as Select/Dialog) |
| `PopoverTrigger`     | `hashti-popover-trigger`                                                                            |
| `PopoverContent`     | `hashti-popover-content`                                                                            |
| `PopoverTitle`       | `hashti-popover__title`                                                                             |
| `PopoverDescription` | `hashti-popover__description`                                                                       |
| `PopoverClose`       | `hashti-popover-close`                                                                              |

Export all six from `./popover` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/popover.css` — write the rules from the design-rules
section above. Structure: trigger (quiet action), content (surface +
motion), title, description, close. Reuse the motion pattern from
dialog.css (starting/ending + reduced-motion override) at the popover's
fast-01 duration.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/popover.css` → no matches; `grep -c "data-" packages/styles/src/popover.css` → ≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/popover-demo.tsx`:

```tsx
"use client";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@hashti/react";

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger>Share</PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Share this document</PopoverTitle>
        <PopoverDescription>
          Anyone with the link can view it.
        </PopoverDescription>
        <PopoverClose>Done</PopoverClose>
      </PopoverContent>
    </Popover>
  );
}
```

`apps/docs/content/docs/popover.mdx`:

```mdx
---
title: Popover
description: Opens an anchored surface beside its trigger.
---

import { PopoverDemo } from "../../src/components/popover-demo";

## Usage

<PopoverDemo client:load />

## Parts

| Part                                  | Purpose                                      |
| ------------------------------------- | -------------------------------------------- |
| `Popover`                             | Owns open state, placement and dismissal.    |
| `PopoverTrigger`                      | Opens the popover.                           |
| `PopoverContent`                      | The anchored surface; flips away from edges. |
| `PopoverTitle` / `PopoverDescription` | Name and context.                            |
| `PopoverClose`                        | Dismisses; several allowed.                  |

Styling lives in `@hashti/styles` under `.hashti-popover-*` — an 18px surface with the popover shadow, placed by ui-sdk with flip.
```

`apps/docs/content/docs/meta.json` — `pages` becomes
`["index", "avatar", "button", "checkbox", "dialog", "field", "input", "label", "popover", "radio", "select", "separator", "switch", "textarea"]`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(open → anchored surface beside the trigger, 18px radius, popover shadow,
title/description typography, Escape/outside dismissal, placement flip).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-popover" packages/react/src packages/styles/src` shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/popover.css` returns nothing
- [ ] `grep -n "popover" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the six parts is not exported from `@ui-sdk/react/popover` — quote
  the error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The arrow recipe lands with the Menu cycle (side-aware skinning).
- Modal popovers and hover-open are deferred; ui-sdk ships the behavior.
