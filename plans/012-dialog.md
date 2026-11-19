# Plan 012: Dialog — modal surface, scrim, and dismissal

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 5edf526..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED (top-layer surface, scrim, focus-ring inset rule)
- **Depends on**: plans/011-select (DONE)
- **Category**: migration (component build-out, cycle 12)
- **Planned at**: commit `70744f4`, 2026-11-20

## Why this matters

Dialog is the first modal: scrim, top-layer surface, dismissal, and the
focus-ring inset rule for overlay close buttons. Its recipes (scrim, modal
shadow, entrance motion) are the template for AlertDialog, Drawer, Sheet and
the Toast host.

## Current state

- `packages/react/src/select/select.tsx` — the multi-part wrapper exemplar
  with the `join` helper (state-function classNames). Dialog follows it with
  seven parts. NOTE: ui-sdk's Select root shipped as a direct re-export
  because it renders no DOM node; check whether `Dialog`'s root takes
  `className` the same way (if typecheck rejects it, re-export the root
  directly like Select and say so in your report).
- `packages/styles/src/select.css` — the popup-motion exemplar
  (starting/ending styles + reduced-motion override).
- `apps/docs/src/components/select-demo.tsx` — the compound docs pattern.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "avatar", "button", "checkbox", "field", "input", "label", "radio", "select", "separator", "switch", "textarea"]`.

### ui-sdk Dialog facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/dialog.md`)

- Import: `import { Dialog, DialogBackdrop, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@ui-sdk/react/dialog"`.
- Composition: `Dialog` → (`DialogTrigger`, `DialogBackdrop`, `DialogContent`
  → `DialogTitle`, `DialogDescription`, `DialogClose`).
- The backdrop is optional; without one, style the content's `::backdrop`.
- Renders in the browser's top layer (no portal); `[data-theme]` ancestry
  works.
- States: `data-open`/`data-closed` on trigger/backdrop/content;
  `data-starting-style`/`data-ending-style` on backdrop and content;
  `data-presentation` (`dialog` | `sheet` — sheet is deferred).
- `modal` prop controls focus trapping; Escape dismisses (topmost layer).
- The title names the dialog; the description gives context; several Close
  parts are allowed; icon-only close needs an accessible name.

### Design rules that bite (from `design/DESIGN.md`)

- **Surface radius**: 18px overlay — `var(--hashti-popover-radius)`
  (DESIGN.md groups popovers, menus and dialogs at the 18px overlay radius).
- **Surface**: `var(--hashti-layer-01)` background, 1px
  `var(--hashti-border-subtle-00)` border, **modal shadow**
  `0 16px 48px var(--hashti-shadow)` (the shadow token is a color, composed
  into the stack — never the whole value).
- **Scrim**: `var(--hashti-overlay)` (rgb(18 22 32 / 50%)) as the backdrop's
  background; optional `backdrop-filter: blur(6px)` behind dialogs —
  include it; it is a design-specified optional.
- **Title**: the title role — 18px/600, line-height 1.4
  (`font-size: 1.125rem; font-weight: 600; line-height: 1.4`).
- **Description**: body role — 0.875rem/400/1.5, ink
  `var(--hashti-text-secondary)`.
- **Geometry**: `max-inline-size: 32rem`, `inline-size: calc(100% - 2rem)`,
  `padding: 1.5rem`, content gap `0.75rem` between title/description/close
  rows.
- **Focus ring — overlay close buttons take it INSET**: 2px outline at
  **-2px offset** (focus matrix). Non-interactive dialog surfaces paint
  none.
- **Motion**: content `data-starting-style`/`data-ending-style` →
  `opacity: 0; scale(0.96)`; backdrop → `opacity: 0`; transition
  `var(--hashti-duration-moderate-01)` (230ms)
  `cubic-bezier(0.16, 1, 0.3, 1)` on opacity/scale/translate;
  `prefers-reduced-motion` → opacity only, no scale.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/dialog/dialog.tsx` — create
- `packages/react/src/dialog/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/dialog.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/dialog-demo.tsx` — create
- `apps/docs/content/docs/dialog.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"dialog"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Sheet presentation (`data-presentation: sheet`, drawer vars) — Drawer cycle
- Nested-dialog stack styling (`--dialog-stack`) — deferred
- Dirty-form guard, keyboard shortcut opening — behavior exists in ui-sdk;
  recipes documented later
- Alert Dialog — its own cycle
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/012-dialog`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Dialog wrappers in `@hashti/react`

`packages/react/src/dialog/dialog.tsx` — the `join` helper pattern from
`packages/react/src/field/field.tsx`; parts and classes:

| Part | Class |
| --- | --- |
| `Dialog` | `hashti-dialog` (if the root takes className; otherwise direct re-export, as Select) |
| `DialogTrigger` | `hashti-dialog-trigger` |
| `DialogBackdrop` | `hashti-dialog-backdrop` |
| `DialogContent` | `hashti-dialog-content` |
| `DialogTitle` | `hashti-dialog__title` |
| `DialogDescription` | `hashti-dialog__description` |
| `DialogClose` | `hashti-dialog-close` |

Export all seven from `./dialog` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/dialog.css` — write the rules from the design-rules
section above. Structure:

1. Trigger: a quiet action — `display: inline-flex; align-items: center;
   gap: 0.5rem; padding: 0 0.75rem; min-block-size: 2.75rem; border: none;
   border-radius: var(--hashti-control-radius); background: transparent;
   color: var(--hashti-text-primary); font-size: 0.875rem; font-weight: 500;
   cursor: pointer;` + hover background `var(--hashti-background-hover)`
   inside `@media (hover: hover)` guarded by `:not([data-disabled])`.
2. Backdrop: `position: fixed; inset: 0; background:
   var(--hashti-overlay); backdrop-filter: blur(6px);` + opacity
   transition + starting/ending styles (`opacity: 0`).
3. Content: `position: fixed; inset: 0; margin: auto; block-size: fit-content;`
   (centered in the top layer), `max-inline-size: 32rem; inline-size:
   calc(100% - 2rem); padding: 1.5rem; display: flex; flex-direction:
   column; gap: 0.75rem;` surface (layer-01, subtle border, 18px radius,
   modal shadow) + transition + starting/ending styles (`opacity: 0;
   scale(0.96)`) + reduced-motion override.
4. Title (18px/600), description (0.875rem, secondary ink).
5. Close: `align-self: flex-end`-friendly inline-flex ghost with the
   INSET focus ring (`outline-offset: -2px`).

If the content's centering needs a different mechanism (check how ui-sdk
renders the content element — `position: fixed` + `inset: 0` + `margin:
auto` is the native dialog pattern), adapt and note it.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/dialog.css` → no matches; `grep -c "data-" packages/styles/src/dialog.css` → ≥ 6.

### Step 3: Docs demo component and page

`apps/docs/src/components/dialog-demo.tsx`:

```tsx
"use client"

import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@hashti/react"

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger>Open project details</DialogTrigger>
      <DialogBackdrop />
      <DialogContent>
        <DialogTitle>Project details</DialogTitle>
        <DialogDescription>
          Review the details before continuing.
        </DialogDescription>
        <DialogClose>Close</DialogClose>
      </DialogContent>
    </Dialog>
  )
}
```

`apps/docs/content/docs/dialog.mdx`:

```mdx
---
title: Dialog
description: Opens a modal surface over the page.
---

import { DialogDemo } from '../../src/components/dialog-demo'

## Usage

<DialogDemo client:load />

## Parts

| Part | Purpose |
| --- | --- |
| `Dialog` | Owns open state, focus trapping and dismissal. |
| `DialogTrigger` | Opens the dialog. |
| `DialogBackdrop` | The scrim; optional. |
| `DialogContent` | The modal surface. |
| `DialogTitle` / `DialogDescription` | Name and context. |
| `DialogClose` | Dismisses; several allowed. |

Styling lives in `@hashti/styles` under `.hashti-dialog-*` — an 18px surface with the modal shadow over a dimmed, blurred scrim. Escape and a press outside dismiss; the close button's focus ring is inset.
```

`apps/docs/content/docs/meta.json` — `pages` becomes
`["index", "avatar", "button", "checkbox", "dialog", "field", "input", "label", "radio", "select", "separator", "switch", "textarea"]`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(open → scrim + surface + motion, Escape and outside-press dismissal, focus
trapped, close button's inset ring, title/description typography, reduced
motion).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-dialog" packages/react/src packages/styles/src` shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/dialog.css` returns nothing
- [ ] `grep -n "dialog" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the seven parts is not exported from `@ui-sdk/react/dialog` — quote
  the error.
- The content's centering cannot be achieved with the native top-layer
  pattern — report what the rendered element structure actually is.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The scrim/modal-shadow/motion recipes are the template for AlertDialog,
  Drawer and the Toast host.
- Sheet presentation and the nested-dialog stack land with the Drawer cycle.
- The dirty-form guard recipe (dismissal attempt) is documented behavior in
  ui-sdk; Hashti documents the recipe when a forms guide cycle exists.
