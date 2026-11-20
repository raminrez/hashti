# Plan 015: Toast — region, toast, and the status types

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat df8f0df..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (region positioning + the status vocabulary)
- **Depends on**: plans/014-tooltip (DONE)
- **Category**: migration (component build-out, cycle 15)
- **Planned at**: commit `df8f0df`, 2026-11-20

## Why this matters

Toast is the transient-feedback family: a region at the page's foot, toasts
typed by the status vocabulary (success/warning/error/info), and the
`toast()` call from anywhere. It completes the feedback triad (inline
notifications and alerts come later if asked).

## Current state

- `packages/react/src/tooltip/tooltip.tsx` — the wrapper exemplar (Tooltip
  root shipped as a direct re-export — no DOM node; apply the same check to
  ToastRegion/Toast roots).
- `packages/styles/src/tooltip.css` — the motion exemplar (fast-02).
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "avatar", "button", "checkbox", "dialog", "field", "input", "label", "popover", "radio", "select", "separator", "switch", "textarea", "tooltip"]`.

### ui-sdk Toast facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/toast.md`)

- Import: `import { Toast, ToastAction, ToastClose, ToastDescription, ToastRegion, ToastTitle, toast } from "@ui-sdk/react/toast"`.
- Composition: `ToastRegion` → children function → `Toast` →
  (`ToastTitle`, `ToastDescription`, `ToastAction`, `ToastClose`).
- `toast("Event created", { description })` from anywhere; `toast.success`,
  `.info`, `.warning`, `.error`, `.loading` set the type, exposed as
  **`data-type`** on the toast for icon or color.
- Empty parts show the toast data's text. The region renders newest first.
- Toast states: `data-open`/`data-closed`,
  `data-starting-style`/`data-ending-style`; ToastClose/ToastAction get
  `data-pending`.
- Place the region once near the app root.

### Design rules that bite (from `design/DESIGN.md`, `design/extraction/`)

- **Region**: `position: fixed; inset-block-end: 1rem; inset-inline-end:
1rem; display: grid; gap: 0.5rem; inline-size: 22rem;` (bottom-end,
  stacked, newest first — ui-sdk order).
- **Toast surface**: `var(--hashti-layer-01)` background, 1px
  `var(--hashti-border-subtle-00)` border,
  `border-radius: var(--hashti-popover-radius)`? NO — toasts are
  transient notices: use `var(--hashti-border-radius-16)` (1rem — between
  control and overlay; the old system's toast radius). **Toast shadow**
  (DESIGN.md): `0 10px 30px rgb(0 0 0 / 12%), 0 2px 8px rgb(0 0 0 / 6%)` —
  quote it verbatim with a `/* shadow stack from DESIGN.md */` comment (the
  design doc specifies this literal stack; the single --hashti-shadow token
  does not express the two-layer toast stack).
- **Layout**: `display: grid; gap: 0.25rem; padding: 0.75rem 1rem;`
  title row with close at the inline end.
- **Title**: 0.875rem/600, ink `var(--hashti-text-primary)`.
- **Description**: 0.8125rem/400, ink `var(--hashti-text-secondary)`.
- **Status types** (subtle recipe — surface + ink pairs from the status
  vocabulary, keyed on `data-type`):
  - `success` → background `var(--hashti-notification-background-success)`,
    title ink `var(--hashti-support-success)`
  - `warning` → background `var(--hashti-notification-background-warning)`,
    title ink `var(--hashti-support-warning)`
  - `error` → background `var(--hashti-notification-background-error)`,
    title ink `var(--hashti-support-error)`
  - `info`/`loading` → the neutral surface (no tint)
  - description ink stays `var(--hashti-text-secondary)` on tinted surfaces
    EXCEPT error, where it reads `var(--hashti-text-error)` (recovery
    vocabulary: error text is error ink).
- **Close**: quiet icon-button row at the inline end; standard
  `:focus-visible` ring (2px/2px).
- **Motion**: starting/ending → `opacity: 0; translate: 0 0.5rem;`
  (toasts rise from the foot); transition
  `var(--hashti-duration-fast-02) cubic-bezier(0.16, 1, 0.3, 1)`;
  reduced-motion → opacity only.
- Colours only via `var(--hashti-*)` except the DESIGN.md-quoted shadow
  stack above.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/toast/toast.tsx` — create
- `packages/react/src/toast/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/toast.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/toast-demo.tsx` — create
- `apps/docs/content/docs/toast.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"toast"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Promise toasts, stacking/queue configuration, position variants, keyboard
  shortcut, OverlayHost confirm — deferred
- Inline notifications / Alert — not in the program list
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/015-toast`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Toast wrappers in `@hashti/react`

`packages/react/src/toast/toast.tsx` — the `join` helper pattern; parts and
classes (apply the direct-re-export check to `ToastRegion` and `Toast`
roots — they may take no className):

| Part               | Class                                       |
| ------------------ | ------------------------------------------- |
| `ToastRegion`      | `hashti-toast-region` (or direct re-export) |
| `Toast`            | `hashti-toast` (or direct re-export)        |
| `ToastTitle`       | `hashti-toast__title`                       |
| `ToastDescription` | `hashti-toast__description`                 |
| `ToastAction`      | `hashti-toast-action`                       |
| `ToastClose`       | `hashti-toast-close`                        |

Also re-export `toast` (the imperative API) from the same module if
`@ui-sdk/react/toast` exports it — check the dist exports; if `toast` comes
from a different entry, re-export from that entry and note it.

Export all parts from `./toast` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/toast.css` — write the rules from the design-rules
section above: region, toast surface + shadow stack (quoted comment),
layout, title/description typography, the four `data-type` variants,
close button, motion (starting/ending + reduced-motion override).

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/toast.css` → no matches; `grep -c "data-type" packages/styles/src/toast.css` → ≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/toast-demo.tsx`:

```tsx
"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  toast,
} from "@hashti/react";

export function ToastDemo() {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button
        type="button"
        className="hashti-button"
        data-variant="secondary"
        onClick={() =>
          toast("Event created", { description: "Friday at 10:00 AM" })
        }
      >
        Default
      </button>
      <button
        type="button"
        className="hashti-button"
        data-variant="secondary"
        onClick={() => toast.success("Saved")}
      >
        Success
      </button>
      <button
        type="button"
        className="hashti-button"
        data-variant="secondary"
        onClick={() => toast.warning("Storage almost full")}
      >
        Warning
      </button>
      <button
        type="button"
        className="hashti-button"
        data-variant="danger"
        onClick={() => toast.error("Couldn't save. Try again.")}
      >
        Error
      </button>
      <ToastRegion>
        {() => (
          <Toast>
            <ToastTitle />
            <ToastDescription />
            <ToastClose aria-label="Dismiss" />
          </Toast>
        )}
      </ToastRegion>
    </div>
  );
}
```

`apps/docs/content/docs/toast.mdx`:

```mdx
---
title: Toast
description: Transient feedback at the foot of the page.
---

import { ToastDemo } from "../../src/components/toast-demo";

## Usage

<ToastDemo client:load />

## Parts

| Part                              | Purpose                                                    |
| --------------------------------- | ---------------------------------------------------------- |
| `ToastRegion`                     | The stacked region; place once near the root.              |
| `Toast`                           | One toast; renders through the region's children function. |
| `ToastTitle` / `ToastDescription` | Text; empty parts show the toast data's.                   |
| `ToastClose`                      | Dismisses.                                                 |

Call `toast()`, `toast.success`, `.warning`, `.error` from anywhere — the type drives the status surface and ink.
```

`apps/docs/content/docs/meta.json` — `pages` becomes
`["index", "avatar", "button", "checkbox", "dialog", "field", "input", "label", "popover", "radio", "select", "separator", "switch", "textarea", "toast", "tooltip"]`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(region at the foot-end, all four types with correct surface/ink pairs,
dismiss, motion, newest-first stacking).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-toast" packages/react/src packages/styles/src` shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/toast.css` returns nothing
- [ ] `grep -n "toast" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any part is not exported from `@ui-sdk/react/toast`, or `toast` is not
  reachable from the package's exports — quote what you found.
- `ToastRegion` or `Toast` takes className (unlike Select/Dialog/Tooltip
  roots) — then wrap it with `hashti-toast-region`/`hashti-toast` instead of
  re-exporting.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Promise toasts, queue configuration and position variants are deferred.
- Inline notifications and Alert reuse the same status vocabulary.
