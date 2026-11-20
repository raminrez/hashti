# Plan 043: AlertDialog — the confirm modal

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat eefe20b..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW (Dialog's recipes with a danger accent)
- **Depends on**: plans/042-resizable (DONE)
- **Category**: migration (component build-out, cycle 43 — M batch)
- **Planned at**: commit `eefe20b`, 2026-11-20

## Why this matters

AlertDialog is the explicit-answer modal — Dialog's surface recipes plus
the danger Close accent. It completes the modal pair.

## Current state

- `packages/styles/src/dialog.css` — the surface/scrim/motion exemplar;
  copy its content/backdrop/trigger recipes. The close ring is INSET
  (dialog family).
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "alert-dialog" ← insert here, "avatar", "badge", "button", "carousel", "checkbox", "collapsible", "date-input", "dialog", "field", "file-input", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "number-input", "pagination", "password-input", "popover", "progress", "radio", "rating", "resizable", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "time-input", "timeline", "toast", "toolbar", "toggle", "tooltip"]`.

### ui-sdk AlertDialog facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/alert-dialog.md`)

- Import: `import { AlertDialog, AlertDialogBackdrop, AlertDialogClose, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@ui-sdk/react/alert-dialog"` (verify).
- Composition: same shape as Dialog — Trigger, Backdrop, Content →
  Title, Description, one or more `AlertDialogClose` (each reports its
  `value`; `value="confirm"` is the agreeing answer).
- States mirror Dialog: `data-open`/`data-closed`,
  `data-starting-style`/`data-ending-style` on backdrop + content.
- Escape does NOT dismiss (explicit answer required — check the docs;
  outside press likewise; only a Close part answers). Style nothing
  extra — behavior is ui-sdk's.

### Design rules that bite (from dialog.css + the danger vocabulary)

- **Copy dialog.css's recipes** for trigger (quiet action), backdrop
  (scrim + blur), content (18px surface, modal shadow, 24px padding,
  motion), title (18px/600), description (secondary).
- **Close buttons**: `align-self: flex-start` row at the end — the answers
  are a row: wrap closes in a consumer layout; style each close as a
  BUTTON-SIZE action, not the ghost icon: `display: inline-flex;
align-items: center; justify-content: center; padding: 0 1rem;
min-block-size: 2.5rem; border-radius: var(--hashti-control-radius);
border: 1px solid var(--hashti-border-strong-01); background:
var(--hashti-layer-01); color: var(--hashti-text-primary);
font-size: 0.875rem; font-weight: 500; cursor: pointer;`
  - `[data-variant]` is NOT ui-sdk's contract — the agreeing answer
    (`value="confirm"`) gets the danger treatment via the demo passing
    `className`? NO — simplest: style every AlertDialogClose the same
    (neutral secondary), and let the DEMO mark the confirm answer with
    `data-danger` attribute (plain attribute pass-through) →
    `.hashti-alert-dialog-close[data-danger] { border-color: var(--hashti-support-error);
color: var(--hashti-support-error); }` hover → tinted background
    `var(--hashti-notification-background-error)`. Document the attribute
    in the MDX.
  - `:focus-visible` → the INSET ring (2px @-2px — the overlay close
    rule from the focus matrix, same as Dialog's close).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/alert-dialog/alert-dialog.tsx` — create
- `packages/react/src/alert-dialog/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/alert-dialog.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/alert-dialog-demo.tsx` — create
- `apps/docs/content/docs/alert-dialog.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"alert-dialog"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Async action pending states, nested dialogs — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/043-alert-dialog`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the AlertDialog wrappers in `@hashti/react`

`packages/react/src/alert-dialog/alert-dialog.tsx` — the `join` helper
pattern (direct-re-export check on the root; the Dialog precedent
applies):

| Part                     | Class                                       |
| ------------------------ | ------------------------------------------- |
| `AlertDialog`            | `hashti-alert-dialog` (or direct re-export) |
| `AlertDialogTrigger`     | `hashti-alert-dialog-trigger`               |
| `AlertDialogBackdrop`    | `hashti-alert-dialog-backdrop`              |
| `AlertDialogContent`     | `hashti-alert-dialog-content`               |
| `AlertDialogTitle`       | `hashti-alert-dialog__title`                |
| `AlertDialogDescription` | `hashti-alert-dialog__description`          |
| `AlertDialogClose`       | `hashti-alert-dialog-close`                 |

Export all seven from `./alert-dialog` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/alert-dialog.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/alert-dialog.css`
→ no matches; `grep -c "data-" packages/styles/src/alert-dialog.css` →
≥ 6.

### Step 3: Docs demo component and page

`apps/docs/src/components/alert-dialog-demo.tsx`:

```tsx
"use client";

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@hashti/react";

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete project</AlertDialogTrigger>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogTitle>Delete this project?</AlertDialogTitle>
        <AlertDialogDescription>
          This removes every file and comment. It cannot be undone.
        </AlertDialogDescription>
        <AlertDialogClose value="cancel">Cancel</AlertDialogClose>
        <AlertDialogClose value="confirm" data-danger>
          Delete
        </AlertDialogClose>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

(The close row layout: wrap the two closes in a flex row div in the demo
if the content column stacks them awkwardly — styling is per-button.)

`apps/docs/content/docs/alert-dialog.mdx`:

```mdx
---
title: AlertDialog
description: Asks a question that needs an explicit answer.
---

import { AlertDialogDemo } from "../../src/components/alert-dialog-demo";

## Usage

<AlertDialogDemo client:load />

## Parts

| Part                                          | Purpose                                                                                 |
| --------------------------------------------- | --------------------------------------------------------------------------------------- |
| `AlertDialog`                                 | Owns the open state; only a Close part answers.                                         |
| `AlertDialogTrigger`                          | Opens the dialog.                                                                       |
| `AlertDialogBackdrop`                         | The scrim.                                                                              |
| `AlertDialogContent`                          | The modal surface.                                                                      |
| `AlertDialogTitle` / `AlertDialogDescription` | The question and context.                                                               |
| `AlertDialogClose`                            | One answer; `value="confirm"` is the agreeing one, `data-danger` marks destructive ink. |

Styling lives in `@hashti/styles` under `.hashti-alert-dialog*` — the dialog surface with answer buttons; the destructive answer carries error ink. Escape does not dismiss.
```

`apps/docs/content/docs/meta.json` — insert `"alert-dialog"` after
`"accordion"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(open → scrim + surface, answers row, danger ink on the confirm answer,
Escape does NOT dismiss, a Close answers and closes, inset close ring).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-alert-dialog" packages/react/src packages/styles/src`
      shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/alert-dialog.css`
      returns nothing
- [ ] `grep -n "alert-dialog" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the seven parts is not exported from
  `@ui-sdk/react/alert-dialog` — quote the error.
- The docs show Escape DOES dismiss — report the actual behavior and keep
  the MDX honest.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The answer-button row could become a DialogActions recipe later.
- Async pending states on closes land with the async pass.
